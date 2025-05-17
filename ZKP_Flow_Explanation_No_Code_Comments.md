# Zero-Knowledge Proof (ZKP) Simulation Flow Explanation (No Code Comments)

This document outlines the flow of the simplified Zero-Knowledge Proof simulation as implemented in `src/zkp.ts`. The simulation demonstrates selective disclosure using a JWS-like mechanism with IOTA DIDs.

## Overview

The simulation involves three main parties:

1.  **Issuer**: Creates and signs a full credential for the Holder.
2.  **Holder (Alice)**: Receives the credential, verifies it, and then prepares a presentation with only selected information (claims) to show to a Verifier.
3.  **Verifier**: Receives the presentation from the Holder, verifies the original credential's authenticity (via the JWS proof), and then checks if the Holder's selectively disclosed claims are consistent with the verified full credential.

The core idea is that the Holder can prove they possess a valid credential issued by a trusted Issuer, and reveal only specific parts of that credential, without revealing the entire content.

## Detailed Flow (referencing `src/zkp.ts`)

The main simulation logic is within the `simulateZKP` async function.

### 1. Common Setup / Issuer Key Generation

-   **Objective**: The Issuer needs a cryptographic identity (DID) and keys to sign credentials.
-   **Code**:

    ```typescript
    const {
        publicKey: issuerCryptoPublicKey,
        privateKey: issuerCryptoPrivateKey,
    } = crypto.generateKeyPairSync("ed25519")
    const issuerSpkiDer = issuerCryptoPublicKey.export({
        type: "spki",
        format: "der",
    })
    const issuerPublicKeyBytes = new Uint8Array(issuerSpkiDer.subarray(-32))
    console.log("Issuer Ed25519 keys generated for ZKP demo.")

    const networkName = "smr"
    const issuerDid = new IotaDID(issuerPublicKeyBytes, networkName)
    let issuerDocument = IotaDocument.newWithId(issuerDid)
    const issuerVerificationMethodFragment = "key-1"
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
    issuerDocument.insertMethod(
        issuerVerificationMethod,
        MethodScope.AssertionMethod()
    )
    console.log(`Issuer DID for ZKP: ${issuerDocument.id().toString()}`)
    ```

-   **Explanation**:
    -   An Ed25519 key pair (`issuerCryptoPublicKey`, `issuerCryptoPrivateKey`) is generated for the Issuer using Node.js `crypto`.
    -   The raw public key bytes (`issuerPublicKeyBytes`) are extracted from the SPKI DER format.
    -   An IOTA DID (`issuerDid`) is created using these public key bytes and a network name (`smr`).
    -   An IOTA Document (`issuerDocument`) is initialized with this DID.
    -   A `VerificationMethod` (specifically `Ed25519VerificationKey2018`) is created using the Issuer's public key. This method is added to the Issuer's DID Document with the `AssertionMethod` scope, indicating it can be used for issuing credentials (signing). The fragment `key-1` will be part of the Key ID (`kid`) in the JWS, which is used by verifiers to locate the correct public key.

### 2. Issuer Side: Credential Creation and Signing

-   **Objective**: The Issuer creates a credential containing Alice's full details and signs it.
-   **Code**:

    ```typescript
    console.log("\n--- Issuer Side ---")
    const subjectData = {
        id: "did:example:alice",
        name: "Alice Wonder",
        degree: "BSc",
        major: "Cryptography",
        university: "Wonderland University",
        year: 2025,
    }
    console.log(
        "Credential Subject Data (Issuer's view):",
        JSON.stringify(subjectData, null, 2)
    )

    const credentialToIssue = new Credential({
        id: "https://example.edu/credentials/alice/degree/3732",
        issuer: issuerDocument.id().toString(),
        type: "UniversityDegreeCredential",
        credentialSubject: subjectData,
    })
    console.log(
        "Credential to be issued (JSON):",
        JSON.stringify(credentialToIssue.toJSON(), null, 2)
    )

    const kidForJWS =
        issuerDocument.id().toString() + "#" + issuerVerificationMethodFragment
    const signedFullCredentialJWS = simpleSign(
        credentialToIssue.toJSON(),
        issuerCryptoPrivateKey,
        kidForJWS
    )
    console.log(
        "Issuer signed the full credential (JWS):",
        signedFullCredentialJWS.substring(0, 120) + "..."
    )
    ```

-   **Explanation**:
    -   `subjectData` defines the information about Alice that will go into the credential.
    -   A `Credential` object (`credentialToIssue`) is instantiated. It includes:
        -   A unique ID for the credential.
        -   The Issuer's DID string.
        -   The type of credential.
        -   The `subjectData`.
    -   The `simpleSign` helper function is used to create a JWS (JSON Web Signature).
        -   **Input**: The credential's JSON representation, the Issuer's private key (`issuerCryptoPrivateKey`), and a `kid` (Key Identifier).
        -   The `kidForJWS` is constructed from the Issuer's DID and the verification method fragment (`key-1`). This `kid` will be included in the JWS header, allowing a verifier to look up the correct public key in the Issuer's DID Document.
        -   **Output**: `signedFullCredentialJWS` is the JWS string representing the signed full credential.

### 3. Holder Side (Alice): Receiving and Verifying Credential, Preparing Presentation

-   **Objective**: Alice receives the signed credential, verifies its authenticity, and then prepares a presentation containing only the claims she wants to disclose.
-   **Code**:

    ```typescript
    console.log("\n--- Holder Side ---")
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
    console.log(
        "Holder: Verified Full Credential Payload (from JWS):",
        JSON.stringify(holderVerifiedFullCredential, null, 2)
    )

    const selectivelyDisclosedClaims = {
        name: holderVerifiedFullCredential.credentialSubject.name,
        degree: holderVerifiedFullCredential.credentialSubject.degree,
    }
    console.log(
        "Holder prepares presentation with selective claims:",
        JSON.stringify(selectivelyDisclosedClaims, null, 2)
    )

    const presentationToVerifier = {
        issuerDid: issuerDocument.id().toString(),
        claims: selectivelyDisclosedClaims,
        proof: {
            type: "SimplifiedJwsProof2024",
            jws: signedFullCredentialJWS,
        },
    }
    console.log("Holder: Presentation ready for Verifier.")
    console.log(
        "Holder: Full Presentation to Verifier:",
        JSON.stringify(presentationToVerifier, null, 2)
    )
    ```

-   **Explanation**:
    -   Alice receives `signedFullCredentialJWS`.
    -   She verifies it using the `simpleVerify` helper function and the Issuer's public key (`issuerCryptoPublicKey`). In a real scenario, Alice would fetch the Issuer's DID Document (using `issuerDocument.id().toString()`) and find the public key corresponding to the `kid` in the JWS header. The demo simplifies this by directly using `issuerCryptoPublicKey`. If verification fails, the process stops.
    -   Alice decides which claims to disclose. In this case, `name` and `degree` from the `holderVerifiedFullCredential.credentialSubject`.
    -   She constructs `presentationToVerifier`. This object contains:
        -   `issuerDid`: The DID of the Issuer (so the Verifier knows who issued the original credential).
        -   `claims`: The `selectivelyDisclosedClaims` (only name and degree).
        -   `proof`: This is crucial. The "proof" is the _original, unmodified `signedFullCredentialJWS`_. This JWS acts as evidence that Alice possesses a valid, fully signed credential from the Issuer, even though she's only showing parts of it.

### 4. Verifier Side: Verifying Presentation and Claims

-   **Objective**: The Verifier receives Alice's presentation, verifies the authenticity of the original credential (via the JWS proof), and then checks if Alice's disclosed claims are consistent with the (now trusted) full credential.
-   **Code**:

    ```typescript
    console.log("\n--- Verifier Side ---")
    console.log(
        "Verifier: Received Presentation:",
        JSON.stringify(presentationToVerifier, null, 2)
    )

    const verifierSideIssuerPublicKey = issuerCryptoPublicKey

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
        console.log(
            "Verifier: Verified Full Credential Payload (from JWS proof):",
            JSON.stringify(verifiedFullCredentialByVerifier, null, 2)
        )

        const presentedClaims = presentationToVerifier.claims
        const fullSubjectDataFromVerifiedCredential =
            verifiedFullCredentialByVerifier.credentialSubject

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

        if (claimsAreConsistent) {
            console.log(
                "Verifier: Selectively disclosed claims ARE CONSISTENT with the verified full credential."
            )
            console.log("ZKP principle (selective disclosure) demonstrated!")
            console.log(
                "Verifier can now trust and use Alice's disclosed claims:",
                JSON.stringify(presentationToVerifier.claims, null, 2)
            )

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
        "\n--- ZKP Simulation (Simplified JWS & Selective Disclosure) Complete ---"
    )
    ```

-   **Explanation**:
    -   The Verifier receives `presentationToVerifier`.
    -   The Verifier first needs to verify the `proof.jws` (the original `signedFullCredentialJWS`). To do this, it needs the Issuer's public key. Similar to the Holder's verification step, this is simplified in the demo by directly using `issuerCryptoPublicKey`. A real implementation would involve parsing the JWS header from `presentationToVerifier.proof.jws` to get the `kid`, resolving the `presentationToVerifier.issuerDid` to fetch the Issuer's DID Document, finding the verification method in the Issuer's DID Document that matches the `kid`, and then extracting the public key material from that method for verification. The `simpleVerify` function is called with the `presentationToVerifier.proof.jws` and the (supposedly resolved) Issuer's public key.
    -   **If JWS verification is successful (`verifiedFullCredentialByVerifier` is not null)**:
        -   The Verifier now trusts the _entire content_ of `verifiedFullCredentialByVerifier`, even though Alice only showed parts of it.
        -   The Verifier then compares Alice's `presentationToVerifier.claims` (the selectively disclosed ones) against the corresponding claims in the `verifiedFullCredentialByVerifier.credentialSubject`.
        -   If `claimsAreConsistent` is true (e.g., `presentedClaims.name` matches `fullSubjectDataFromVerifiedCredential.name`), the Verifier accepts Alice's disclosed information as valid and backed by the Issuer.
        -   The Verifier can then apply its own policies based on these trusted, selectively disclosed claims (e.g., checking if `presentedClaims.degree === "BSc"`).
    -   **If JWS verification fails, or if the disclosed claims are inconsistent**: The presentation is considered invalid.

## Helper Functions

-   **`simpleSign(payload, privateKey, kid)`**:
    -   **Code**:
        ```typescript
        function simpleSign(
            payload: object,
            privateKey: crypto.KeyObject,
            kid: string
        ): string {
            const header = { alg: "EdDSA", kid: kid }
            const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
                "base64url"
            )
            const encodedPayload = Buffer.from(
                JSON.stringify(payload)
            ).toString("base64url")
            const messageToSign = `${encodedHeader}.${encodedPayload}`
            const signature = crypto.sign(
                null,
                Buffer.from(messageToSign),
                privateKey
            )
            const encodedSignature = signature.toString("base64url")
            return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
        }
        ```
    -   **Explanation**:
        -   Creates a simplified JWS. It takes a payload object, the signer's private key, and a key identifier (`kid`).
        -   It base64url encodes a header (containing `alg: "EdDSA"` and the `kid`) and the payload.
        -   It signs the `encodedHeader.encodedPayload` string using `crypto.sign`.
        -   Returns the JWS as `encodedHeader.encodedPayload.encodedSignature`.
-   **`simpleVerify(jws, publicKey)`**:

    -   **Code**:

        ```typescript
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
        ```

    -   **Explanation**:
        -   Verifies a simplified JWS. It takes the JWS string and the signer's public key.
        -   It splits the JWS into its three parts.
        -   It reconstructs the message that was signed (`encodedHeader.encodedPayload`).
        -   It uses `crypto.verify` to check the signature against the message and public key.
        -   Returns the parsed payload object if valid, otherwise `null`.

## Conclusion

This simulation demonstrates how a Holder can present verifiable claims selectively without revealing their entire credential. The key is that the Holder provides the original JWS of the full credential as proof. The Verifier first validates this JWS against the Issuer's public key (obtained via the Issuer's DID). If the JWS is valid, the Verifier trusts the full credential's content and can then confidently check that the Holder's selectively disclosed claims match the corresponding data within that trusted full credential.
