/**
 * Age Verification Example using IOTA Identity ZKP Selective Disclosure
 *
 * This example demonstrates:
 * 1. A government issuing an identity credential with personal information
 * 2. A user (holder) creating a selective disclosure presentation revealing only their age
 * 3. A verifier (bar) validating the presentation without seeing other personal information
 */

import {
    importIdentityWasm,
    generateNonce,
    createDid,
} from "../shared/iota_identity_client"

import { verifyPresentationWithIota } from "../verifier_with_iota"

export async function runAgeVerificationExample() {
    try {
        // Import IOTA Identity WASM
        const identityWasm = await importIdentityWasm()

        // Initialize WASM module
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
        }

        console.log(
            "\n=== AGE VERIFICATION EXAMPLE WITH IOTA IDENTITY ZKP ===\n"
        )

        // Create DIDs for all parties
        const governmentDid = createDid("government")
        const citizenDid = createDid("citizen")
        const barDid = createDid("bar")

        // 1. GOVERNMENT (ISSUER): Create an identity credential
        console.log("1. GOVERNMENT: Creating identity credential...")

        const { Credential, SelectiveDisclosurePresentation, Resolver } =
            identityWasm

        const identityCredential = new Credential({
            id: "https://government.example/credentials/identity-1234",
            type: ["VerifiableCredential", "IdentityCredential"],
            issuer: governmentDid,
            credentialSubject: {
                id: citizenDid,
                firstName: "Jane",
                lastName: "Citizen",
                dateOfBirth: "1995-05-15",
                address: "123 Privacy Street, Secureville",
                documentNumber: "ID-123456789",
                nationality: "Example Country",
                // Age is derived from dateOfBirth but included for simplicity
                age: 28,
            },
            issuanceDate: new Date().toISOString(),
            expirationDate: new Date(
                Date.now() + 5 * 365 * 24 * 60 * 60 * 1000
            ).toISOString(), // 5 years
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
            ],
        })

        // Apply BLS12-381 signature (simulated for the example)
        identityCredential.proof = {
            type: "BbsBlsSignature2020",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: `${governmentDid}#key-1`,
            proofValue: "z3uPqm9ZxFZbYMYpK9c6YfZBDvfB2...simulatedSignature...",
        }

        console.log("Government issued identity credential to citizen")

        // 2. CITIZEN (HOLDER): Create a selective disclosure presentation for age verification
        console.log(
            "\n2. CITIZEN: Creating selective disclosure for bar entry..."
        )

        // Bar requests age verification
        const challenge = generateNonce()

        // Citizen creates a selective disclosure presentation
        const ageVerificationPresentation = new SelectiveDisclosurePresentation(
            {
                holder: citizenDid,
                verifier: barDid,
            }
        )

        // Add the identity credential to the presentation
        ageVerificationPresentation.addCredential(identityCredential)

        // Conceal everything except age (and ID which is required)
        ageVerificationPresentation.concealInSubject("firstName")
        ageVerificationPresentation.concealInSubject("lastName")
        ageVerificationPresentation.concealInSubject("dateOfBirth")
        ageVerificationPresentation.concealInSubject("address")
        ageVerificationPresentation.concealInSubject("documentNumber")
        ageVerificationPresentation.concealInSubject("nationality")

        // The age remains disclosed to prove the person is over 21

        // Create the presentation JWT with the challenge
        const presentationJpt =
            ageVerificationPresentation.createPresentationJpt({
                challenge,
                domain: barDid,
            })

        console.log("Citizen created selective disclosure revealing only age")
        console.log(
            "Concealed attributes: name, date of birth, address, document number, nationality"
        )

        // 3. BAR (VERIFIER): Verify the selective disclosure presentation
        console.log("\n3. BAR: Verifying age credential...")

        // Verify the presentation
        const verificationResult = await verifyPresentationWithIota(
            presentationJpt,
            challenge,
            barDid
        )
        if (verificationResult.valid) {
            console.log("Bar successfully verified the age credential!")

            // Extract the age from the verified presentation
            const age =
                verificationResult.extractedAttributes?.disclosedAttributes
                    ?.age || 0

            // Make a decision based on the age
            if (age >= 21) {
                console.log(
                    `\nDECISION: Access granted. Customer is ${age} years old (over 21).`
                )
                console.log(
                    "Bar doesn't know the customer's name, address, or other private information."
                )
            } else {
                console.log(
                    `\nDECISION: Access denied. Customer is only ${age} years old (under 21).`
                )
            }
        } else {
            console.error("Age verification failed:", verificationResult.error)
        }

        return {
            identityCredential,
            ageVerificationPresentation,
            presentationJpt,
            verificationResult,
        }
    } catch (error) {
        console.error("Error in age verification example:", error)
        throw error
    }
}

export default runAgeVerificationExample
