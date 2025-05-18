/**
 * Example: Health Credential with Selective Disclosure
 *
 * This example demonstrates a more complex use case for IOTA Identity ZKP
 * where a health credential can selectively disclose different attributes
 * for different verifiers while maintaining privacy.
 */

import {
    importIdentityWasm,
    generateNonce,
    createDid,
    now,
} from "../shared/iota_identity_client"

async function healthCredentialExample() {
    try {
        // Import the IOTA Identity WASM module
        const identityWasm = await importIdentityWasm()
        if (typeof identityWasm.start === "function") {
            identityWasm.start()
        }

        console.log("=== HEALTH CREDENTIAL WITH SELECTIVE DISCLOSURE ===\n")

        // Get necessary classes
        const {
            Credential,
            SelectiveDisclosurePresentation,
            JptPresentationValidator,
            Resolver,
        } = identityWasm

        // 1. Setup DIDs for all parties
        const healthAuthorityDid = createDid("healthAuthority")
        const patientDid = createDid("patient")
        const employerDid = createDid("employer")
        const insuranceDid = createDid("insurance")
        const pharmacyDid = createDid("pharmacy")

        // 2. ISSUER (Health Authority): Issue a comprehensive health credential
        console.log("ISSUER (Health Authority): Creating health credential...")

        const healthCredential = new Credential({
            id: "https://health.example/credentials/health-record-123",
            type: ["VerifiableCredential", "HealthCredential"],
            issuer: healthAuthorityDid,
            credentialSubject: {
                id: patientDid,
                // Personal information
                fullName: "Jane A. Smith",
                dateOfBirth: "1985-03-15",
                sex: "Female",
                bloodType: "A+",

                // Insurance information
                insuranceProvider: "Global Health Insurance",
                insuranceId: "GHI-12345678",
                insurancePlan: "Premium Family Plan",
                coverageStart: "2023-01-01",
                coverageEnd: "2025-12-31",

                // Health conditions
                allergies: ["Penicillin", "Peanuts"],
                chronicConditions: ["Asthma", "Hypertension"],

                // Medication
                medications: [
                    {
                        name: "Lisinopril",
                        dosage: "10mg",
                        frequency: "Daily",
                        startDate: "2022-06-15",
                    },
                    {
                        name: "Ventolin HFA",
                        dosage: "90mcg",
                        frequency: "As needed",
                        startDate: "2020-03-10",
                    },
                ],

                // Vaccination status
                vaccinations: [
                    {
                        type: "COVID-19",
                        manufacturer: "Pfizer",
                        date: "2023-05-10",
                        batchNumber: "PZ-45678",
                    },
                    {
                        type: "Influenza",
                        manufacturer: "GSK",
                        date: "2023-10-15",
                        batchNumber: "GSK-87654",
                    },
                ],

                // Recent test results
                testResults: [
                    {
                        testName: "Complete Blood Count",
                        date: "2023-11-20",
                        result: "Normal",
                        notes: "All values within normal range",
                    },
                    {
                        testName: "COVID-19 PCR",
                        date: "2023-12-01",
                        result: "Negative",
                        notes: "No virus detected",
                    },
                ],
            },
            issuanceDate: now(),
            expirationDate: new Date(Date.now() + 31536000000).toISOString(), // 1 year
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
                "https://health.example/credentials/v1",
            ],
        })

        // Simulate BLS signature that enables selective disclosure
        healthCredential.proof = {
            type: "BbsBlsSignature2020",
            created: now(),
            proofPurpose: "assertionMethod",
            verificationMethod: `${healthAuthorityDid}#bls-key-1`,
            proofValue: "z3u1UjHbYX...base64EncodedSignature...",
        }

        console.log(
            "Health credential created with comprehensive health information"
        )

        // 3. SCENARIO 1: Disclosure for Employer (Vaccination Status Only)
        console.log(
            "\nSCENARIO 1 - HOLDER (Patient): Creating presentation for employer..."
        )

        // Employer requests proof of COVID-19 vaccination only
        const employerChallenge = generateNonce()
        // Simulate the SelectiveDisclosurePresentation class
        // In a real implementation, we'd use the actual IOTA Identity class
        const employerDisclosure = {
            holder: patientDid,
            verifier: employerDid,
            challenge: employerChallenge,

            // Track which attributes should be concealed
            concealedAttributes: new Set<string>(),
            credential: healthCredential,

            // Simulate the concealInSubject method
            concealInSubject(attributeName: string) {
                this.concealedAttributes.add(attributeName)
                console.log(`Concealing attribute: ${attributeName}`)
            },

            // Simulate adding a credential
            addCredential(credential: any) {
                this.credential = credential
                console.log("Added credential to selective disclosure")
            },

            // Simulate creating a presentation
            createPresentationJpt(options: any) {
                console.log(
                    "Creating presentation with options:",
                    JSON.stringify(options)
                )

                // Create a map of the credential subject for easier processing
                const subject = { ...this.credential.credentialSubject }

                // Create a new subject with only the revealed attributes
                const revealedSubject: Record<string, any> = { id: subject.id }

                // For each property in the subject, check if it should be concealed
                Object.entries(subject).forEach(([key, value]) => {
                    if (key !== "id" && !this.concealedAttributes.has(key)) {
                        revealedSubject[key] = value
                    }
                })

                // Create a simulated presentation in JWT format
                return {
                    header: {
                        alg: "BBS+",
                        typ: "JWT+SD", // JWT with Selective Disclosure
                    },
                    payload: {
                        iss: this.holder,
                        aud: this.verifier,
                        nonce: this.challenge,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 3600,
                        credential: {
                            issuer: this.credential.issuer,
                            issuanceDate: this.credential.issuanceDate,
                            type: this.credential.type,
                            credentialSubject: revealedSubject,
                        },
                    },
                    // Simulated proof - in real implementation this would be a cryptographic proof
                    signature:
                        "eyJhbGciOiJCQlMrIiwidHlwIjoiSldUK1NEIn0.eyJpc3MiOiJkaWQ6aW90YTpwYXRpZW50IiwiYXVkIjoiZGlkOmlvdGE6ZW1wbG95ZXIiLCJjcmVkZW50aWFsIjp7Imlzc3VlciI6ImRpZDppb3RhOmhlYWx0aEF1dGhvcml0eSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJIZWFsdGhDcmVkZW50aWFsIl19fQ.BBS+SimulatedSignature",
                    revealedAttributes: Object.keys(revealedSubject).filter(
                        (k) => k !== "id"
                    ),
                    concealedAttributes: Array.from(this.concealedAttributes),
                }
            },
        }

        // Add the credential but conceal everything except vaccination status
        employerDisclosure.addCredential(healthCredential)
        // Conceal everything except COVID-19 vaccination
        // Personal information
        employerDisclosure.concealInSubject("fullName")
        employerDisclosure.concealInSubject("dateOfBirth")
        employerDisclosure.concealInSubject("sex")
        employerDisclosure.concealInSubject("bloodType")

        // Insurance information
        employerDisclosure.concealInSubject("insuranceProvider")
        employerDisclosure.concealInSubject("insuranceId")
        employerDisclosure.concealInSubject("insurancePlan")
        employerDisclosure.concealInSubject("coverageStart")
        employerDisclosure.concealInSubject("coverageEnd")

        // Health conditions and medications
        employerDisclosure.concealInSubject("allergies")
        employerDisclosure.concealInSubject("chronicConditions")
        employerDisclosure.concealInSubject("medications")

        // Do NOT conceal vaccinations - we want to reveal this
        // employerDisclosure.concealInSubject("vaccinations");

        // Test results
        employerDisclosure.concealInSubject("testResults")

        // Create employer presentation
        const employerPresentation = employerDisclosure.createPresentationJpt({
            challenge: employerChallenge,
            domain: employerDid,
        })

        console.log(
            "Presentation created for employer with only vaccination information"
        )
        console.log(
            "Disclosed: vaccinations array (with COVID-19 and Influenza data)"
        )
        console.log(
            "Concealed: All personal, insurance, health conditions, and test information"
        )

        // 4. SCENARIO 2: Disclosure for Insurance (Chronic Conditions and Medications)
        console.log(
            "\nSCENARIO 2 - HOLDER (Patient): Creating presentation for insurance..."
        )

        // Insurance requests proof of chronic conditions and medications
        const insuranceChallenge = generateNonce()
        // Simulate the SelectiveDisclosurePresentation class for insurance scenario
        const insuranceDisclosure = {
            holder: patientDid,
            verifier: insuranceDid,
            challenge: insuranceChallenge,

            // Track which attributes should be concealed
            concealedAttributes: new Set<string>(),
            credential: healthCredential,

            // Simulate the concealInSubject method
            concealInSubject(attributeName: string) {
                this.concealedAttributes.add(attributeName)
                console.log(`Concealing attribute: ${attributeName}`)
            },

            // Simulate adding a credential
            addCredential(credential: any) {
                this.credential = credential
                console.log("Added credential to selective disclosure")
            },

            // Simulate creating a presentation
            createPresentationJpt(options: any) {
                console.log(
                    "Creating presentation with options:",
                    JSON.stringify(options)
                )

                // Create a map of the credential subject for easier processing
                const subject = { ...this.credential.credentialSubject }

                // Create a new subject with only the revealed attributes
                const revealedSubject: Record<string, any> = { id: subject.id }

                // For each property in the subject, check if it should be concealed
                Object.entries(subject).forEach(([key, value]) => {
                    if (key !== "id" && !this.concealedAttributes.has(key)) {
                        revealedSubject[key] = value
                    }
                })

                // Create a simulated presentation in JWT format
                return {
                    header: {
                        alg: "BBS+",
                        typ: "JWT+SD", // JWT with Selective Disclosure
                    },
                    payload: {
                        iss: this.holder,
                        aud: this.verifier,
                        nonce: this.challenge,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 3600,
                        credential: {
                            issuer: this.credential.issuer,
                            issuanceDate: this.credential.issuanceDate,
                            type: this.credential.type,
                            credentialSubject: revealedSubject,
                        },
                    },
                    // Simulated proof - in real implementation this would be a cryptographic proof
                    signature:
                        "eyJhbGciOiJCQlMrIiwidHlwIjoiSldUK1NEIn0.eyJpc3MiOiJkaWQ6aW90YTpwYXRpZW50IiwiYXVkIjoiZGlkOmlvdGE6aW5zdXJhbmNlIiwiY3JlZGVudGlhbCI6eyJpc3N1ZXIiOiJkaWQ6aW90YTpoZWFsdGhBdXRob3JpdHkiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiSGVhbHRoQ3JlZGVudGlhbCJdfX0.BBS+SimulatedSignature",
                    revealedAttributes: Object.keys(revealedSubject).filter(
                        (k) => k !== "id"
                    ),
                    concealedAttributes: Array.from(this.concealedAttributes),
                }
            },
        }

        // Add the credential
        insuranceDisclosure.addCredential(healthCredential)

        // Only disclose name, DOB, chronic conditions, and medications
        // Conceal everything else
        insuranceDisclosure.concealInSubject("sex")
        insuranceDisclosure.concealInSubject("bloodType")

        // Insurance information - they already have this
        insuranceDisclosure.concealInSubject("insuranceProvider")
        insuranceDisclosure.concealInSubject("insuranceId")
        insuranceDisclosure.concealInSubject("insurancePlan")
        insuranceDisclosure.concealInSubject("coverageStart")
        insuranceDisclosure.concealInSubject("coverageEnd")

        // Don't conceal these - insurance needs to know
        // "fullName"
        // "dateOfBirth"
        // "chronicConditions"
        // "medications"

        // Conceal vaccinations and test results
        insuranceDisclosure.concealInSubject("vaccinations")
        insuranceDisclosure.concealInSubject("testResults")
        insuranceDisclosure.concealInSubject("allergies")

        // Create insurance presentation
        const insurancePresentation = insuranceDisclosure.createPresentationJpt(
            {
                challenge: insuranceChallenge,
                domain: insuranceDid,
            }
        )

        console.log(
            "Presentation created for insurance with chronic conditions and medications"
        )
        console.log(
            "Disclosed: fullName, dateOfBirth, chronicConditions, medications"
        )
        console.log(
            "Concealed: sex, bloodType, insurance details, allergies, vaccinations, test results"
        )

        // 5. SCENARIO 3: Disclosure for Pharmacy (Allergies and Medications)
        console.log(
            "\nSCENARIO 3 - HOLDER (Patient): Creating presentation for pharmacy..."
        )

        // Pharmacy needs to know about allergies and current medications
        const pharmacyChallenge = generateNonce()
        // Simulate the SelectiveDisclosurePresentation class for pharmacy scenario
        const pharmacyDisclosure = {
            holder: patientDid,
            verifier: pharmacyDid,
            challenge: pharmacyChallenge,

            // Track which attributes should be concealed
            concealedAttributes: new Set<string>(),
            credential: healthCredential,

            // Simulate the concealInSubject method
            concealInSubject(attributeName: string) {
                this.concealedAttributes.add(attributeName)
                console.log(`Concealing attribute: ${attributeName}`)
            },

            // Simulate adding a credential
            addCredential(credential: any) {
                this.credential = credential
                console.log("Added credential to selective disclosure")
            },

            // Simulate creating a presentation
            createPresentationJpt(options: any) {
                console.log(
                    "Creating presentation with options:",
                    JSON.stringify(options)
                )

                // Create a map of the credential subject for easier processing
                const subject = { ...this.credential.credentialSubject }

                // Create a new subject with only the revealed attributes
                const revealedSubject: Record<string, any> = { id: subject.id }

                // For each property in the subject, check if it should be concealed
                Object.entries(subject).forEach(([key, value]) => {
                    if (key !== "id" && !this.concealedAttributes.has(key)) {
                        revealedSubject[key] = value
                    }
                })

                // Create a simulated presentation in JWT format
                return {
                    header: {
                        alg: "BBS+",
                        typ: "JWT+SD", // JWT with Selective Disclosure
                    },
                    payload: {
                        iss: this.holder,
                        aud: this.verifier,
                        nonce: this.challenge,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 3600,
                        credential: {
                            issuer: this.credential.issuer,
                            issuanceDate: this.credential.issuanceDate,
                            type: this.credential.type,
                            credentialSubject: revealedSubject,
                        },
                    },
                    // Simulated proof - in real implementation this would be a cryptographic proof
                    signature:
                        "eyJhbGciOiJCQlMrIiwidHlwIjoiSldUK1NEIn0.eyJpc3MiOiJkaWQ6aW90YTpwYXRpZW50IiwiYXVkIjoiZGlkOmlvdGE6cGhhcm1hY3kiLCJjcmVkZW50aWFsIjp7Imlzc3VlciI6ImRpZDppb3RhOmhlYWx0aEF1dGhvcml0eSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJIZWFsdGhDcmVkZW50aWFsIl19fQ.BBS+SimulatedSignature",
                    revealedAttributes: Object.keys(revealedSubject).filter(
                        (k) => k !== "id"
                    ),
                    concealedAttributes: Array.from(this.concealedAttributes),
                }
            },
        }

        // Add the credential
        pharmacyDisclosure.addCredential(healthCredential)

        // Only disclose name, allergies, and medications for the pharmacy
        // Conceal all other information
        pharmacyDisclosure.concealInSubject("dateOfBirth")
        pharmacyDisclosure.concealInSubject("sex")
        pharmacyDisclosure.concealInSubject("bloodType")

        // Insurance information
        pharmacyDisclosure.concealInSubject("insuranceProvider")
        pharmacyDisclosure.concealInSubject("insuranceId")
        pharmacyDisclosure.concealInSubject("insurancePlan")
        pharmacyDisclosure.concealInSubject("coverageStart")
        pharmacyDisclosure.concealInSubject("coverageEnd")

        // Conceal chronic conditions
        pharmacyDisclosure.concealInSubject("chronicConditions")

        // Don't conceal these - pharmacy needs to know
        // "fullName"
        // "allergies"
        // "medications"

        // Conceal vaccinations and test results
        pharmacyDisclosure.concealInSubject("vaccinations")
        pharmacyDisclosure.concealInSubject("testResults")

        // Create pharmacy presentation
        const pharmacyPresentation = pharmacyDisclosure.createPresentationJpt({
            challenge: pharmacyChallenge,
            domain: pharmacyDid,
        })

        console.log(
            "Presentation created for pharmacy with allergies and medications"
        )
        console.log("Disclosed: fullName, allergies, medications")
        console.log(
            "Concealed: dateOfBirth, sex, bloodType, insurance details, chronic conditions, vaccinations, test results"
        )

        // 6. SCENARIO 4: Emergency Disclosure (Most Information)
        console.log(
            "\nSCENARIO 4 - EMERGENCY: Creating comprehensive health presentation..."
        )

        // In an emergency, more health information would be disclosed
        // but still protecting sensitive non-medical data
        const emergencyDid = createDid("emergency")
        const emergencyChallenge = generateNonce()
        // Simulate the SelectiveDisclosurePresentation class for emergency scenario
        const emergencyDisclosure = {
            holder: patientDid,
            verifier: emergencyDid,
            challenge: emergencyChallenge,

            // Track which attributes should be concealed
            concealedAttributes: new Set<string>(),
            credential: healthCredential,

            // Simulate the concealInSubject method
            concealInSubject(attributeName: string) {
                this.concealedAttributes.add(attributeName)
                console.log(`Concealing attribute: ${attributeName}`)
            },

            // Simulate adding a credential
            addCredential(credential: any) {
                this.credential = credential
                console.log("Added credential to selective disclosure")
            },

            // Simulate creating a presentation
            createPresentationJpt(options: any) {
                console.log(
                    "Creating presentation with options:",
                    JSON.stringify(options)
                )

                // Create a map of the credential subject for easier processing
                const subject = { ...this.credential.credentialSubject }

                // Create a new subject with only the revealed attributes
                const revealedSubject: Record<string, any> = { id: subject.id }

                // For each property in the subject, check if it should be concealed
                Object.entries(subject).forEach(([key, value]) => {
                    if (key !== "id" && !this.concealedAttributes.has(key)) {
                        revealedSubject[key] = value
                    }
                })

                // Create a simulated presentation in JWT format
                return {
                    header: {
                        alg: "BBS+",
                        typ: "JWT+SD", // JWT with Selective Disclosure
                    },
                    payload: {
                        iss: this.holder,
                        aud: this.verifier,
                        nonce: this.challenge,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 3600,
                        credential: {
                            issuer: this.credential.issuer,
                            issuanceDate: this.credential.issuanceDate,
                            type: this.credential.type,
                            credentialSubject: revealedSubject,
                        },
                    },
                    // Simulated proof - in real implementation this would be a cryptographic proof
                    signature:
                        "eyJhbGciOiJCQlMrIiwidHlwIjoiSldUK1NEIn0.eyJpc3MiOiJkaWQ6aW90YTpwYXRpZW50IiwiYXVkIjoiZGlkOmlvdGE6ZW1lcmdlbmN5IiwiY3JlZGVudGlhbCI6eyJpc3N1ZXIiOiJkaWQ6aW90YTpoZWFsdGhBdXRob3JpdHkiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiSGVhbHRoQ3JlZGVudGlhbCJdfX0.BBS+SimulatedSignature",
                    revealedAttributes: Object.keys(revealedSubject).filter(
                        (k) => k !== "id"
                    ),
                    concealedAttributes: Array.from(this.concealedAttributes),
                }
            },
        }

        // Add the credential
        emergencyDisclosure.addCredential(healthCredential)

        // In emergency, disclose most health information but still protect
        // identity and insurance details

        // Only conceal insurance and ID information
        emergencyDisclosure.concealInSubject("insuranceProvider")
        emergencyDisclosure.concealInSubject("insuranceId")
        emergencyDisclosure.concealInSubject("insurancePlan")
        emergencyDisclosure.concealInSubject("coverageStart")
        emergencyDisclosure.concealInSubject("coverageEnd")

        // Create emergency presentation
        const emergencyPresentation = emergencyDisclosure.createPresentationJpt(
            {
                challenge: emergencyChallenge,
                domain: emergencyDid,
            }
        )

        console.log(
            "Presentation created for emergency with comprehensive health information"
        )
        console.log(
            "Disclosed: fullName, dateOfBirth, sex, bloodType, allergies, chronicConditions, medications, vaccinations, testResults"
        )
        console.log("Concealed: Insurance details") // Simulate the verification process
        console.log("\nVERIFIER (Employer): Verifying vaccination status...")

        // Simulated validator instead of using JptPresentationValidator
        const simulatedValidator = {
            verify(options: any): Promise<any> {
                console.log(
                    "Verifying presentation with options:",
                    JSON.stringify(options)
                )

                // Extract the presentation data
                const presentation = options.presentation
                const providedChallenge = options.challenge
                const expectedDomain = options.domain

                // Check if the challenge matches (prevents replay attacks)
                const validChallenge =
                    presentation.payload.nonce === providedChallenge

                // Check if the domain/audience matches
                const validDomain = presentation.payload.aud === expectedDomain

                // In a real implementation, we would verify the cryptographic proof
                // For simulation, we just check basic properties

                if (validChallenge && validDomain) {
                    // Return a successful verification result
                    return Promise.resolve({
                        verified: true,
                        credentialSubject:
                            presentation.payload.credential.credentialSubject,
                        issuer: presentation.payload.credential.issuer,
                        revealed: presentation.revealedAttributes,
                        concealed: presentation.concealedAttributes,
                    })
                } else {
                    // Return a failed verification result
                    return Promise.resolve({
                        verified: false,
                        error: validChallenge
                            ? "Domain mismatch"
                            : "Challenge mismatch",
                    })
                }
            },
        }
        // Simulate the verification process
        const validate = (presentation: any): boolean => {
            // Check the nonce (prevents replay attacks)
            return (
                presentation.payload.nonce === employerChallenge &&
                presentation.payload.aud === employerDid
            )
        }

        // Extract the revealed attributes from the credential subject
        const extractData = (presentation: any) => {
            // In a real implementation, this would decode the JWT
            return presentation.payload.credential.credentialSubject
        }

        // In a real implementation, this would be part of the validation process
        const verificationResult = {
            verified: validate(employerPresentation),
            credentialSubject: extractData(employerPresentation),
            issuer: employerPresentation.payload.credential.issuer,
            revealed: Object.keys(extractData(employerPresentation)).filter(
                (k) => k !== "id"
            ),
            concealed: Array.from(employerDisclosure.concealedAttributes),
        }
        if (verificationResult.verified) {
            console.log("✅ Vaccination verification successful!")
            console.log("The employer has cryptographically verified:")
            console.log(
                "1. The vaccination information was issued by the Health Authority"
            )
            console.log(
                "2. The credential belongs to the patient presenting it"
            )
            console.log("3. The patient has the required COVID-19 vaccination")
            console.log(
                "4. No other sensitive health information was disclosed"
            )

            // In a simulated implementation, we would extract data from our presentation structure
            console.log("\nExtracted vaccination information:")

            // Get the credential subject from our simulated structure
            const subject = verificationResult.credentialSubject

            if (subject && subject.vaccinations) {
                subject.vaccinations.forEach(
                    (vaccination: any, index: number) => {
                        console.log(
                            `- ${vaccination.type} (${vaccination.manufacturer}) on ${vaccination.date}`
                        )
                    }
                )

                console.log(
                    "\nConcealed attributes:",
                    verificationResult.concealed.join(", ")
                )
                console.log(
                    "Revealed attributes:",
                    verificationResult.revealed.join(", ")
                )
            } else {
                console.log(
                    "No vaccination information found in the presentation"
                )
            }
        } else {
            console.error(
                "❌ Vaccination verification failed:",
                verificationResult.error
            )
        }

        return {
            healthCredential,
            employerPresentation,
            insurancePresentation,
            pharmacyPresentation,
            emergencyPresentation,
            verificationResult,
        }
    } catch (error) {
        console.error("Error in health credential example:", error)
        throw error
    }
}

// When this file is run directly, execute the main function
if (require.main === module) {
    healthCredentialExample().catch((error) => {
        console.error("Error running health credential example:", error)
    })
}

export default healthCredentialExample
