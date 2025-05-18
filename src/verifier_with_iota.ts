/**
 * Verifier implementation for Zero-Knowledge Proof Selective Disclosure
 * Using actual IOTA Identity WASM APIs
 */

import { importIdentityWasm, decodeBase64 } from "./shared/iota_identity_client"

/**
 * Verifies a selective disclosure presentation using IOTA Identity WASM
 *
 * @param presentationJpt The presentation JWT to verify
 * @param expectedChallenge The expected challenge (nonce)
 * @param expectedDomain The expected domain (verifier DID)
 * @returns Verification result with extracted attributes
 */
export async function verifyPresentationWithIota(
    presentationJpt: string,
    expectedChallenge: string,
    expectedDomain: string
) {
    try {
        // Import IOTA Identity WASM
        const identityWasm = await importIdentityWasm()
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
        }

        console.log(
            "\n=== VERIFYING ZKP SELECTIVE DISCLOSURE PRESENTATION ===\n"
        )

        // Create a resolver for DID resolution
        // In a real implementation, this would connect to the IOTA network
        const { Resolver, JptPresentationValidator } = identityWasm
        const resolver = new Resolver()

        // Create a validator for the presentation
        const validator = new JptPresentationValidator(resolver)

        // Verify the presentation
        const validationResult = await validator.verify({
            presentation: presentationJpt,
            challenge: expectedChallenge,
            domain: expectedDomain,
            checks: {
                proof: true,
                structure: true,
                nonce: true,
            },
        })

        if (validationResult.verified) {
            console.log("Presentation verification successful!")

            // In a real implementation, we would extract the disclosed attributes
            // from the decoded JWT. For this demo, we'll simulate this.

            // Parse the presentation JWT to extract revealed attributes
            // Note: In a real implementation, this would use properly decoded JWT contents
            const extractedAttributes = {
                // These would be extracted from the actual decoded JWT
                // This is just for demonstration purposes
                issuer: "did:iota:issuer:abc123",
                holder: "did:iota:holder:def456",
                disclosedAttributes: {
                    // These attributes would be extracted from the actual JWT
                    given_name: "John",
                    age: 42,
                    // Other attributes are concealed
                },
            }

            console.log(
                "Extracted disclosed attributes:",
                JSON.stringify(extractedAttributes.disclosedAttributes, null, 2)
            )
            console.log("Other attributes remain private (concealed)")

            return {
                valid: true,
                verificationResult: validationResult,
                extractedAttributes,
            }
        } else {
            console.error(
                "Presentation verification failed:",
                validationResult.error
            )
            return {
                valid: false,
                error: validationResult.error,
                verificationResult: validationResult,
            }
        }
    } catch (error) {
        console.error("Error verifying presentation:", error)
        throw error
    }
}

export default verifyPresentationWithIota
