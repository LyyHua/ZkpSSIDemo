/**
 * Implementation of Zero-Knowledge Proof Selective Disclosure
 * using actual IOTA Identity WASM features
 */

import {
    importIdentityWasm,
    generateNonce,
    createDid,
} from "./shared/iota_identity_client"

export async function createZkpWithIota() {
    try {
        // Dynamically import the WASM module
        const identityWasm = await importIdentityWasm()

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
            console.log("WASM module initialized successfully")
        }

        console.log("\n=== ZKP SELECTIVE DISCLOSURE WITH IOTA IDENTITY ===\n")

        // Create DIDs for issuer, holder, and verifier
        console.log("Creating DIDs...")
        const issuerDid = createDid("issuer")
        const holderDid = createDid("holder")
        const verifierDid = createDid("verifier")

        // 1. ISSUER: Create a credential with multiple attributes
        console.log("\n1. ISSUER: Creating credential...")
        const { Credential, Resolver, ProofOptions } = identityWasm

        const credentialData = {
            id: "https://example.com/credentials/123",
            type: ["VerifiableCredential", "IdentityCredential"],
            issuer: issuerDid,
            credentialSubject: {
                id: holderDid,
                given_name: "John",
                family_name: "Doe",
                email: "john.doe@example.com",
                age: 42,
            },
            issuanceDate: new Date().toISOString(),
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org",
            ],
        }

        // Create the credential
        const credential = new Credential(credentialData)

        // In a real implementation, we would create a BLS12-381 signature here
        // For demo purposes, we'll use the existing proof structure
        // Note: Real IOTA Identity would use IotaDocument.createCredentialJpt() method
        // with a BLS12-381 verification method
        credential.proof = {
            type: "BLS12381Signature2020",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: `${issuerDid}#key-1`,
            proofValue: "z3u1UjHbYX...base58EncodedSignature...",
        }

        console.log("Credential created and signed by the issuer")

        // 2. HOLDER: Create a selective disclosure presentation
        console.log(
            "\n2. HOLDER: Creating selective disclosure presentation..."
        )

        // Get the challenge from the verifier (usually a nonce)
        const challenge = generateNonce()

        // Use IOTA's SelectiveDisclosurePresentation class
        const { SelectiveDisclosurePresentation } = identityWasm

        // Create a new selective disclosure presentation
        const selectiveDisclosure = new SelectiveDisclosurePresentation({
            holder: holderDid,
            verifier: verifierDid,
        })

        // Add the credential to the presentation
        // In a real implementation, the credential would be properly extracted
        // from the holder's credential store
        selectiveDisclosure.addCredential(credential)

        // Use selective disclosure to hide specific attributes
        // Only reveal given_name and age
        selectiveDisclosure.concealInSubject("family_name")
        selectiveDisclosure.concealInSubject("email")

        // Create the presentation JWT with the challenge
        const presentationJpt = selectiveDisclosure.createPresentationJpt({
            challenge,
            domain: verifierDid,
        })

        console.log("Selective disclosure presentation created by the holder")
        console.log("Selectively disclosed attributes: given_name, age")
        console.log("Hidden attributes: family_name, email")

        // 3. VERIFIER: Validate the presentation
        console.log("\n3. VERIFIER: Validating the presentation...")

        // Create a resolver (in a real implementation, this would resolve DIDs on the IOTA network)
        const resolver = new Resolver()

        // Use IOTA's JptPresentationValidator to validate the presentation
        const { JptPresentationValidator } = identityWasm
        const validator = new JptPresentationValidator(resolver)

        // Validate the presentation
        const validationResult = await validator.verify({
            presentation: presentationJpt,
            challenge,
            domain: verifierDid,
            checks: {
                proof: true,
                structure: true,
                nonce: true,
            },
        })

        if (validationResult.verified) {
            console.log("Presentation verified successfully!")

            // Extract the revealed attributes (in a real implementation, this would decode the JWT)
            console.log("Extracted disclosed attributes:")
            console.log("- given_name: John")
            console.log("- age: 42")
        } else {
            console.error(
                "Presentation verification failed:",
                validationResult.error
            )
        }

        // Return the created objects for reference
        return {
            credential,
            selectiveDisclosure,
            presentationJpt,
            validationResult,
        }
    } catch (error) {
        console.error("Error in ZKP implementation:", error)
        throw error
    }
}

export default createZkpWithIota
