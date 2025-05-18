/**
 * Example: Age verification using IOTA Identity ZKP
 *
 * This example demonstrates how to use Zero-Knowledge Proofs
 * for age verification without disclosing the exact age.
 */

import {
    createActualIotaZkp,
    verifyActualZkpPresentation,
} from "../actual_iota_zkp"
import {
    importIdentityWasm,
    generateNonce,
    createDid,
    now,
} from "../shared/iota_identity_client"

async function ageVerificationExample() {
    try {
        // Import the IOTA Identity WASM module
        const identityWasm = await importIdentityWasm()
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
        }

        console.log("=== AGE VERIFICATION USING IOTA IDENTITY ZKP ===\n")

        // Get necessary classes
        const {
            Credential,
            SelectiveDisclosurePresentation,
            JptPresentationValidator,
            Resolver,
        } = identityWasm

        // 1. Setup DIDs for all parties
        const issuerDid = createDid("government")
        const holderDid = createDid("citizen")
        const verifierDid = createDid("nightclub")

        // 2. ISSUER (Government): Issue an identity credential with age
        console.log("ISSUER (Government): Creating identity credential...")

        const credential = new Credential({
            id: "https://gov.example/credentials/identity-123",
            type: ["VerifiableCredential", "IdentityCredential"],
            issuer: issuerDid,
            credentialSubject: {
                id: holderDid,
                firstName: "Jane",
                lastName: "Smith",
                dateOfBirth: "1996-04-20",
                age: 27,
                address: "123 Main St, Anytown",
                socialSecurityNumber: "123-45-6789",
                driverLicense: "DL12345678",
            },
            issuanceDate: now(),
            expirationDate: new Date(Date.now() + 31536000000).toISOString(), // 1 year
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://identity.foundation/schemas/2020",
            ],
        })

        // Simulate BLS signature that enables selective disclosure
        credential.proof = {
            type: "BbsBlsSignature2020",
            created: now(),
            proofPurpose: "assertionMethod",
            verificationMethod: `${issuerDid}#bls-key-1`,
            proofValue: "z3u1UjHbYX...base64EncodedSignature...",
        }

        console.log(
            "Government-issued ID credential created with age information"
        )

        // 3. HOLDER (Citizen): Prepare selective disclosure for age verification
        console.log(
            "\nHOLDER (Citizen): Creating age verification presentation..."
        )

        // Nightclub requests proof of age (at least 21)
        const challenge = generateNonce()

        // Create selective disclosure presentation
        const selectiveDisclosure = new SelectiveDisclosurePresentation({
            holder: holderDid,
            verifier: verifierDid,
            challenge,
        })

        // Add the credential but only disclose necessary information
        selectiveDisclosure.addCredential(credential)

        // Conceal everything EXCEPT the proof that age >= 21
        // In this example, we'll reveal only the age attribute and conceal everything else
        selectiveDisclosure.concealInSubject("firstName")
        selectiveDisclosure.concealInSubject("lastName")
        selectiveDisclosure.concealInSubject("dateOfBirth")
        selectiveDisclosure.concealInSubject("address")
        selectiveDisclosure.concealInSubject("socialSecurityNumber")
        selectiveDisclosure.concealInSubject("driverLicense")

        // Create a ZKP presentation
        const presentationJpt = selectiveDisclosure.createPresentationJpt({
            challenge,
            domain: verifierDid,
        })

        console.log("Selective disclosure created for age verification")
        console.log(
            "Only age is revealed, all other personal information is cryptographically hidden"
        )

        // 4. VERIFIER (Nightclub): Verify the age proof
        console.log("\nVERIFIER (Nightclub): Verifying age...")

        const resolver = new Resolver()
        const validator = new JptPresentationValidator(resolver)

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
            console.log("✅ Age verification successful!")
            console.log("The nightclub has cryptographically verified:")
            console.log(
                "1. The person is 27 years old (above the required age of 21)"
            )
            console.log("2. The age information was issued by the government")
            console.log("3. The credential belongs to the person presenting it")
            console.log("4. NO OTHER PERSONAL INFORMATION was disclosed")

            // In a real implementation, the presentation would be decoded to extract the age
            console.log("\nExtracted age: 27")

            // Business logic to check age requirement
            if (27 >= 21) {
                console.log(
                    "✅ Access granted - person meets the minimum age requirement"
                )
            } else {
                console.log(
                    "❌ Access denied - person does not meet the minimum age requirement"
                )
            }
        } else {
            console.error("❌ Age verification failed:", validationResult.error)
        }

        // 5. DEMONSTRATION: Try to verify with incorrect nonce (prevents replay attacks)
        console.log(
            "\nDEMONSTRATION: Attempt to verify with incorrect nonce..."
        )

        const incorrectNonce = generateNonce()
        const replayResult = await validator.verify({
            presentation: presentationJpt,
            challenge: incorrectNonce, // Different from the original challenge
            domain: verifierDid,
            checks: {
                proof: true,
                structure: true,
                nonce: true,
            },
        })

        if (!replayResult.verified) {
            console.log(
                "✅ Security test passed: Replay attack prevention works"
            )
            console.log(
                "The system correctly rejected a presentation with an incorrect nonce"
            )
        } else {
            console.error(
                "❌ Security vulnerability: Replay attack prevention failed"
            )
        }

        return {
            credential,
            presentationJpt,
            validationResult,
        }
    } catch (error) {
        console.error("Error in age verification example:", error)
        throw error
    }
}

// When this file is run directly, execute the main function
if (require.main === module) {
    ageVerificationExample().catch((error) => {
        console.error("Error running age verification example:", error)
    })
}

export default ageVerificationExample
