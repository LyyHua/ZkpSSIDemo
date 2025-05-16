import {
    IotaDocument,
    IotaDID,
    VerificationMethod,
    MethodData,
    MethodType,
    DIDUrl,
    MethodScope,
    CoreDID,
    Credential,
} from "@iota/identity-wasm/node/identity_wasm"

import * as crypto from "crypto"

// Define an interface for the structure of our simplified credential payload
interface SimplifiedCredentialPayload {
    id: string
    issuer: string
    type: string
    credentialSubject: { [key: string]: any } // Allow any properties in credentialSubject
    // Add other fields like issuanceDate if you use them
}

export async function initializeDID(): Promise<IotaDocument> {
    console.log("Attempting to initialize DID and Document...")

    const networkName = "smr" // Shimmer network (example)

    // Generate a new Ed25519 key pair using Node.js crypto
    const { publicKey: cryptoPublicKey } = crypto.generateKeyPairSync("ed25519")
    // Export the public key in SPKI DER format
    const spkiDer = cryptoPublicKey.export({ type: "spki", format: "der" })
    // For Ed25519, the raw public key is the last 32 bytes of the SPKI DER.
    const publicKeyBytes = new Uint8Array(spkiDer.slice(-32))
    console.log("Ed25519 public key bytes generated.")

    // Create a new DID with the public key bytes
    const did: IotaDID = new IotaDID(publicKeyBytes, networkName)
    console.log(`DID created: ${did.toString()}`)

    // Create a new IOTA Document with the DID
    let document: IotaDocument = IotaDocument.newWithId(did)
    console.log("IOTA Document created.")

    // Define properties for the new Verification Method
    const fragment = "key-1"
    const methodTypeInstance: MethodType =
        MethodType.Ed25519VerificationKey2018()
    // Create MethodData from the public key bytes
    const methodData: MethodData = MethodData.newBase58(publicKeyBytes)

    // Construct the full DID URL for the verification method
    const methodIdString = document.id().toString() + "#" + fragment
    const methodId: DIDUrl = DIDUrl.parse(methodIdString)

    // The controller of the verification method is the DID of the document itself.
    const controller: CoreDID = CoreDID.parse(document.id().toString())

    // Create a new Verification Method instance
    const verificationMethod: VerificationMethod = new VerificationMethod(
        methodId, // id: DIDUrl (full URL of the method)
        controller, // controller: CoreDID (DID of the document)
        methodTypeInstance, // type_: MethodType
        methodData // data: MethodData (public key material)
    )
    console.log("Verification method created.")

    // Insert the verification method into the document
    document.insertMethod(verificationMethod, MethodScope.Authentication())
    console.log("Verification method inserted into document.")

    console.log("DID and Document initialization complete.")
    console.log("Document JSON:", JSON.stringify(document.toJSON(), null, 2))
    return document
}

// Helper to create a JWS-like structure (simplified for demo)
function simpleSign(
    payload: object,
    privateKey: crypto.KeyObject,
    kid: string
): string {
    const header = { alg: "EdDSA", kid: kid } // kid helps verifier find the key
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
        "base64url"
    )
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        "base64url"
    )
    const messageToSign = `${encodedHeader}.${encodedPayload}`
    const signature = crypto.sign(null, Buffer.from(messageToSign), privateKey)
    const encodedSignature = signature.toString("base64url")
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

// Helper to verify a JWS-like structure (simplified for demo)
// publicKey should be the crypto.KeyObject for the issuer's public key
function simpleVerify(
    jws: string,
    publicKey: crypto.KeyObject
): SimplifiedCredentialPayload | null {
    const parts = jws.split(".")
    if (parts.length !== 3) {
        console.error("JWS verify: Invalid JWS structure")
        return null
    }
    const [encodedHeader, encodedPayload, encodedSignature] = parts

    try {
        const payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString()
        ) as SimplifiedCredentialPayload
        const messageToVerify = `${encodedHeader}.${encodedPayload}`
        const signature = Buffer.from(encodedSignature, "base64url")

        const isValid = crypto.verify(
            null,
            Buffer.from(messageToVerify),
            publicKey,
            signature
        )
        return isValid ? payload : null
    } catch (e) {
        console.error("JWS Verification error:", e)
        return null
    }
}

export async function simulateZKP() {
    console.log(
        "\\n--- Starting ZKP Simulation (Simplified JWS & Selective Disclosure) ---"
    )

    // --- COMMON SETUP / KEY GENERATION (for Issuer) ---
    const {
        publicKey: issuerCryptoPublicKey,
        privateKey: issuerCryptoPrivateKey,
    } = crypto.generateKeyPairSync("ed25519")
    const issuerSpkiDer = issuerCryptoPublicKey.export({
        type: "spki",
        format: "der",
    })
    const issuerPublicKeyBytes = new Uint8Array(issuerSpkiDer.slice(-32))
    console.log("Issuer Ed25519 keys generated for ZKP demo.")

    const networkName = "smr"
    const issuerDid = new IotaDID(issuerPublicKeyBytes, networkName)
    let issuerDocument = IotaDocument.newWithId(issuerDid)
    const issuerVerificationMethodFragment = "key-1" // Fragment for the signing key
    const issuerMethodType = MethodType.Ed25519VerificationKey2018()
    const issuerMethodData = MethodData.newBase58(issuerPublicKeyBytes)

    const issuerMethodIdString =
        issuerDocument.id().toString() + "#" + issuerVerificationMethodFragment
    const issuerMethodIdUrl = DIDUrl.parse(issuerMethodIdString)
    const issuerControllerDid = CoreDID.parse(issuerDocument.id().toString())

    const issuerVerificationMethod = new VerificationMethod(
        issuerMethodIdUrl,
        issuerControllerDid,
        issuerMethodType,
        issuerMethodData
    )
    // Use AssertionMethod for signing credentials
    issuerDocument.insertMethod(
        issuerVerificationMethod,
        MethodScope.AssertionMethod()
    )
    console.log(`Issuer DID for ZKP: ${issuerDocument.id().toString()}`)
    // console.log("Issuer Document for ZKP:", JSON.stringify(issuerDocument.toJSON(), null, 2));

    // --- ISSUER SIDE ---
    console.log("\\n--- Issuer Side ---")
    const subjectData = {
        id: "did:example:alice", // Placeholder DID for the subject (Alice)
        name: "Alice Wonder",
        degree: "BSc",
        major: "Cryptography",
        university: "Wonderland University",
        year: 2025,
    }
    console.log("Credential Subject Data:", subjectData)

    const credentialToIssue = new Credential({
        id: "https://example.edu/credentials/alice/degree/3732", // A unique ID for the credential
        issuer: issuerDocument.id().toString(), // Issuer's DID as a string
        type: "UniversityDegreeCredential", // Type of the credential
        credentialSubject: subjectData,
        // issuanceDate: new Timestamp(), // Optional: Timestamp.now() or a specific date
    })
    console.log(
        "Credential to be issued (JSON):",
        JSON.stringify(credentialToIssue.toJSON(), null, 2)
    )

    // Issuer signs the full credential. The KID in JWS points to the verification method.
    const kidForJWS =
        issuerDocument.id().toString() + "#" + issuerVerificationMethodFragment
    const signedFullCredentialJWS = simpleSign(
        credentialToIssue.toJSON(),
        issuerCryptoPrivateKey,
        kidForJWS
    )
    console.log(
        "Issuer signed the full credential (JWS):",
        signedFullCredentialJWS.substring(0, 100) + "..."
    ) // Log snippet

    // --- HOLDER SIDE (Alice) ---
    console.log("\\n--- Holder Side ---")
    // Alice receives the signedFullCredentialJWS from the issuer.
    // Alice can verify it herself using the issuer's public key (obtained from issuer's DID document).
    const holderVerifiedFullCredential = simpleVerify(
        signedFullCredentialJWS,
        issuerCryptoPublicKey
    )
    if (!holderVerifiedFullCredential) {
        console.error(
            "Holder: The received credential JWS from Issuer is invalid!"
        )
        return
    }
    console.log(
        "Holder: Successfully verified the JWS of the full credential from Issuer."
    )

    // Alice wants to selectively disclose her name and degree for a job application.
    // She does NOT want to disclose her major, university, or year of graduation in this presentation.
    const selectivelyDisclosedClaims = {
        name: holderVerifiedFullCredential.credentialSubject.name, // Now type-safe
        degree: holderVerifiedFullCredential.credentialSubject.degree, // Now type-safe
    }
    console.log(
        "Holder prepares presentation with selective claims:",
        selectivelyDisclosedClaims
    )

    // For the Verifier, Alice presents:
    // 1. The selectively disclosed claims.
    // 2. The *original JWS* of the full credential (this acts as her "proof").
    // 3. The Issuer's DID (so the Verifier can find the public key for verification).
    const presentationToVerifier = {
        issuerDid: issuerDocument.id().toString(),
        claims: selectivelyDisclosedClaims,
        proof: {
            // The "proof" is the original JWS
            type: "SimplifiedJwsProof2024", // A made-up type for this example
            jws: signedFullCredentialJWS,
        },
    }
    console.log("Holder: Presentation ready for Verifier.")

    // --- VERIFIER SIDE ---
    console.log("\\n--- Verifier Side ---")
    // console.log("Verifier receives presentation:", JSON.stringify(presentationToVerifier, null, 2));

    // Verifier needs the Issuer's public key to verify the JWS.
    // In a real system, the Verifier would resolve `presentationToVerifier.issuerDid`
    // to get the Issuer's DID Document and find the public key associated with the `kid`
    // from the JWS header.

    // For this demo, we'll "cheat" and use the `issuerCryptoPublicKey` directly,
    // as if the Verifier looked up the DID and found the key.
    // A real implementation would involve:
    // 1. Parse JWS header from `presentationToVerifier.proof.jws` to get `kid`.
    // 2. Resolve `presentationToVerifier.issuerDid` to get `issuerDoc`.
    // 3. Find the verification method in `issuerDoc` that matches `kid`.
    // 4. Extract public key material from that method and construct a crypto.KeyObject.
    const verifierSideIssuerPublicKey = issuerCryptoPublicKey // Simplified for demo

    console.log(
        `Verifier: Verifying JWS proof from issuer ${presentationToVerifier.issuerDid}`
    )
    const verifiedFullCredentialByVerifier = simpleVerify(
        presentationToVerifier.proof.jws,
        verifierSideIssuerPublicKey
    )

    if (verifiedFullCredentialByVerifier) {
        console.log(
            "Verifier: Successfully verified the signature on the original full credential via JWS proof."
        )

        // Now, Verifier checks if the selectively disclosed claims from Alice
        // are consistent with the (now trusted) full credential data.
        const presentedClaims = presentationToVerifier.claims
        const fullSubjectDataFromVerifiedCredential =
            verifiedFullCredentialByVerifier.credentialSubject // Now type-safe

        let claimsAreConsistent = true
        if (
            presentedClaims.name !== fullSubjectDataFromVerifiedCredential.name
        ) {
            claimsAreConsistent = false
            console.error(
                "Verifier: Disclosed 'name' does not match verified credential."
            )
        }
        if (
            presentedClaims.degree !==
            fullSubjectDataFromVerifiedCredential.degree
        ) {
            claimsAreConsistent = false
            console.error(
                "Verifier: Disclosed 'degree' does not match verified credential."
            )
        }
        // Add checks for any other disclosed claims if they existed

        if (claimsAreConsistent) {
            console.log(
                "Verifier: Selectively disclosed claims ARE CONSISTENT with the verified full credential."
            )
            console.log("ZKP principle (selective disclosure) demonstrated!")
            console.log(
                "Verifier can now trust and use Alice's disclosed claims:",
                presentedClaims
            )

            // Example: Verifier applies a policy to the disclosed claims
            if (presentedClaims.degree === "BSc") {
                console.log(
                    "Verifier Policy Check: Alice's disclosed degree (BSc) meets the job requirement."
                )
            } else {
                console.log(
                    "Verifier Policy Check: Alice's disclosed degree does not meet the job requirement."
                )
            }
        } else {
            console.error(
                "Verifier: Disclosed claims DO NOT MATCH the verified full credential. Presentation is invalid."
            )
        }
    } else {
        console.error(
            "Verifier: Signature verification of the original credential JWS FAILED. Presentation is invalid."
        )
    }

    console.log(
        "\\n--- ZKP Simulation (Simplified JWS & Selective Disclosure) Complete ---"
    )
    // We don't really return anything from simulateZKP as it's a self-contained demo.
}

// Removed publishDID and original simulateZKP content for this focused example.
// The initializeDID function is kept as it might be useful, though not directly called by the new simulateZKP.
// If initializeDID is to be used by the new simulateZKP, it would need to return private keys too.
