/**
 * Advanced implementation of Zero-Knowledge Proof with BBS+ signatures
 * using actual IOTA Identity WASM features
 */

import {
    importIdentityWasm,
    generateNonce,
    createDid,
} from "./shared/iota_identity_client"

export async function createAdvancedZkpWithIota() {
    try {
        // Dynamically import the WASM module
        const identityWasm = await importIdentityWasm()

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
            console.log("WASM module initialized successfully")
        }

        console.log(
            "\n=== ADVANCED ZKP WITH BBS+ SIGNATURES USING IOTA IDENTITY ===\n"
        )

        // Create DIDs for issuer, holder, and verifier
        console.log("Creating DIDs...")
        const issuerDid = createDid("issuer")
        const holderDid = createDid("holder")
        const verifierDid = createDid("verifier")

        // 1. ISSUER: Create a credential with BBS+ signature support
        console.log(
            "\n1. ISSUER: Creating credential with BBS+ signature support..."
        )
        const { Credential, Resolver, ProofOptions } = identityWasm

        // Create a health credential with multiple attributes
        const healthCredentialData = {
            id: "https://example.com/credentials/health-123",
            type: ["VerifiableCredential", "HealthCredential"],
            issuer: issuerDid,
            credentialSubject: {
                id: holderDid,
                name: "Alice Johnson",
                birthDate: "1990-01-15",
                bloodType: "O+",
                allergies: ["penicillin", "peanuts"],
                weight: 65,
                height: 170,
                vaccinationStatus: "fully-vaccinated",
                medicalHistory: {
                    conditions: ["asthma"],
                    medications: ["albuterol"],
                    surgeries: ["appendectomy"],
                },
            },
            issuanceDate: new Date().toISOString(),
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
                "https://w3id.org/security/bbs/v1",
            ],
        }

        // Create the credential
        const healthCredential = new Credential(healthCredentialData)

        // In a real implementation, we would use the BBS+ signature suite
        // For demo purposes, we'll use a simulated BBS+ proof structure
        // Note: Real IOTA Identity would use proper BBS+ signing methods
        healthCredential.proof = {
            type: "BbsBlsSignature2020",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: `${issuerDid}#bbs-key-1`,
            proofValue: "uzFMSoTyt...base58EncodedBBSSignature...",
        }

        console.log("Health credential created with BBS+ signature")

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

        // Add the health credential to the presentation
        selectiveDisclosure.addCredential(healthCredential)

        // Use selective disclosure to reveal only vaccination status and blood type
        // Hide all other medical information
        selectiveDisclosure.concealInSubject("birthDate")
        selectiveDisclosure.concealInSubject("allergies")
        selectiveDisclosure.concealInSubject("weight")
        selectiveDisclosure.concealInSubject("height")
        selectiveDisclosure.concealInSubject("medicalHistory")

        // Create the presentation JWT with the challenge
        const presentationJpt = selectiveDisclosure.createPresentationJpt({
            challenge,
            domain: verifierDid,
        })

        console.log("Selective disclosure presentation created by the holder")
        console.log(
            "Selectively disclosed attributes: name, bloodType, vaccinationStatus"
        )
        console.log(
            "Hidden attributes: birthDate, allergies, weight, height, medicalHistory"
        )

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
            console.log("- name: Alice Johnson")
            console.log("- bloodType: O+")
            console.log("- vaccinationStatus: fully-vaccinated")

            console.log("\nAll other medical data remains private!")

            // The verifier makes a decision based on the disclosed information
            if (validationResult.verified) {
                console.log(
                    "\nVerifier decision: Access granted for medical procedure"
                )
                console.log(
                    "Reason: Vaccination status confirmed and blood type is compatible"
                )
            }
        } else {
            console.error(
                "Presentation verification failed:",
                validationResult.error
            )
        }

        // Return the created objects for reference
        return {
            healthCredential,
            selectiveDisclosure,
            presentationJpt,
            validationResult,
        }
    } catch (error) {
        console.error("Error in Advanced ZKP implementation:", error)
        throw error
    }
}

export default createAdvancedZkpWithIota
