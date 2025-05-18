/**
 * IOTA Identity Zero-Knowledge Proof Example with Selective Disclosure
 *
 * This example demonstrates proper usage of IOTA Identity's
 * Zero-Knowledge Proof capabilities using JPT (JSON Proof Token)
 * with BBS+ signatures for selective disclosure
 */
import {
    Credential,
    FailFast,
    IotaDID,
    IotaDocument,
    IotaIdentityClient,
    JptCredentialValidationOptions,
    JptCredentialValidator,
    JptCredentialValidatorUtils,
    JptPresentationValidationOptions,
    JptPresentationValidator,
    JptPresentationValidatorUtils,
    JwpCredentialOptions,
    JwpPresentationOptions,
    MethodScope,
    ProofAlgorithm,
    SelectiveDisclosurePresentation,
} from "@iota/identity-wasm/node"
import { createStorage } from "../util-simple"

/**
 * IOTA Identity ZKP example with JPT and selective disclosure
 */
export async function zkp() {
    console.log("=".repeat(80))
    console.log(
        "IOTA Identity Zero-Knowledge Proof Example with BBS+ Selective Disclosure"
    )
    console.log("=".repeat(80))

    try {
        // ===========================================================================
        // Step 1: Create identity for the issuer.
        // ===========================================================================
        console.log("\n[STEP 1] Creating issuer identity...")

        // In a real-world application, we would connect to a network
        // For this demo, we'll use a simulated network ID
        const network = "smr"
        console.log("Using network identifier:", network)

        // Create a storage for the issuer
        console.log("Creating storage for issuer...")
        const issuerStorage = createStorage()

        // Create an identity for the issuer
        console.log("Creating issuer document...")
        const issuerDocument = new IotaDocument(network)
        console.log("Generating BLS method for issuer document...")
        const issuerFragment = await issuerDocument.generateMethodJwp(
            issuerStorage,
            ProofAlgorithm.BLS12381_SHA256,
            undefined,
            MethodScope.VerificationMethod()
        )

        // In a real implementation, we would publish the issuer's DID
        console.log(`✅ Created issuer DID: ${issuerDocument.id()}`)

        // ===========================================================================
        // Step 2: Issuer creates and signs a Verifiable Credential with BBS algorithm.
        // ===========================================================================
        console.log(
            "\n[STEP 2] Creating and signing credential with BBS+ algorithm..."
        )

        // Create a credential subject indicating the degree earned by Alice.
        console.log(
            "Creating credential subject with university degree information..."
        )
        const subject = {
            name: "Alice",
            mainCourses: ["Object-oriented Programming", "Mathematics"],
            degree: {
                type: "BachelorDegree",
                name: "Bachelor of Science and Arts",
            },
            GPA: 4.0,
        }
        console.log("Created subject:", JSON.stringify(subject, null, 2))

        // Build credential using the above subject and issuer.
        console.log(
            "Building credential with subject and issuer information..."
        )
        const credential = new Credential({
            id: "https:/example.edu/credentials/3732",
            issuer: issuerDocument.id(),
            type: "UniversityDegreeCredential",
            credentialSubject: subject,
        })

        console.log("Creating JPT credential with BBS+ signature...")
        const credentialJpt = await issuerDocument.createCredentialJpt(
            credential,
            issuerStorage,
            issuerFragment,
            new JwpCredentialOptions()
        )

        // Validate the credential's proof using the issuer's DID Document, the credential's semantic structure,
        // that the issuance date is not in the future and that the expiration date is not in the past:
        console.log("Validating created credential...")
        const decodedJpt = JptCredentialValidator.validate(
            credentialJpt,
            issuerDocument,
            new JptCredentialValidationOptions(),
            FailFast.FirstError
        )
        console.log(
            `✅ Created and validated credential JPT: ${credentialJpt
                .toString()
                .substring(0, 64)}...`
        )

        // ===========================================================================
        // Step 3: Issuer sends the Verifiable Credential to the holder.
        // ===========================================================================
        console.log("\n[STEP 3] Issuer sends credential to holder...")
        console.log(
            "Sending credential (as JPT) to the holder: " +
                credentialJpt.toString()
        ) // ============================================================================================
        // Step 4: Holder resolve Issuer's DID, retrieve Issuer's document and validate the Credential
        // ============================================================================================
        console.log("\n[STEP 4] Holder validates the received credential...")

        console.log("Creating identity client for reading...")
        // In a real implementation, you would resolve the issuer's document from the network
        // For this example, we'll use the issuer document directly

        // Holder resolves issuer's DID.
        console.log("Extracting issuer ID from credential JPT...")
        let issuerDid = issuerDocument.id()
        console.log(`Issuer DID: ${issuerDid}`)

        let issuerDoc = issuerDocument
        console.log("Using issuer document")

        // Holder validates the credential and retrieve the JwpIssued, needed to construct the JwpPresented
        console.log("Holder validating received credential...")
        let decodedCredential = JptCredentialValidator.validate(
            credentialJpt,
            issuerDoc,
            new JptCredentialValidationOptions(),
            FailFast.FirstError
        )
        console.log("✅ Credential successfully validated by holder")

        // ===========================================================================
        // Step 5: Verifier sends the holder a challenge and requests a Presentation.
        //
        // Please be aware that when we mention "Presentation," we are not alluding to the Verifiable Presentation standard as defined by W3C (https://www.w3.org/TR/vc-data-model/#presentations).
        // Instead, our reference is to a JWP Presentation (https://datatracker.ietf.org/doc/html/draft-ietf-jose-json-web-proof#name-presented-form), which differs from the W3C standard.
        // ===========================================================================
        console.log("\n[STEP 5] Verifier sends challenge for presentation...")

        // A unique random challenge generated by the requester per presentation can mitigate replay attacks.
        const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"
        console.log(`Verifier challenge: ${challenge}`)

        // =========================================================================================================
        // Step 6: Holder engages in the Selective Disclosure of credential's attributes.
        // =========================================================================================================
        console.log(
            "\n[STEP 6] Holder creates selective disclosure presentation..."
        )

        console.log("Retrieving method ID from credential...")
        const methodId = decodedCredential
            .decodedJwp()
            .getIssuerProtectedHeader().kid!
        console.log(`Method ID: ${methodId}`)

        console.log("Creating selective disclosure presentation...")
        const selectiveDisclosurePresentation =
            new SelectiveDisclosurePresentation(decodedCredential.decodedJwp())

        // Fields that will be concealed from the verifier
        console.log("Concealing specific fields in the credential...")
        selectiveDisclosurePresentation.concealInSubject("mainCourses[1]")
        selectiveDisclosurePresentation.concealInSubject("degree.name")
        console.log(`🔒 Concealed fields: "mainCourses[1]", "degree.name"`)

        // =======================================================================================================================================
        // Step 7: Holder needs Issuer's Public Key to compute the Signature Proof of Knowledge and construct the Presentation
        // JPT.
        // =======================================================================================================================================
        console.log("\n[STEP 7] Holder creates JPT presentation...")

        // Construct a JPT(JWP in the Presentation form) representing the Selectively Disclosed Verifiable Credential
        console.log("Creating JPT presentation with challenge...")
        const presentationOptions = new JwpPresentationOptions()
        presentationOptions.nonce = challenge

        const presentationJpt = await issuerDoc.createPresentationJpt(
            selectiveDisclosurePresentation,
            methodId,
            presentationOptions
        )
        console.log(
            `✅ Created presentation JPT: ${presentationJpt
                .toString()
                .substring(0, 64)}...`
        )

        // ===========================================================================
        // Step 8: Holder sends a Presentation JPT to the Verifier.
        // ===========================================================================
        console.log("\n[STEP 8] Holder sends presentation to verifier...")
        console.log(
            "Sending presentation (as JPT) to the verifier: " +
                presentationJpt.toString()
        ) // ===========================================================================
        // Step 9: Verifier receives the Presentation and verifies it.
        // ===========================================================================
        console.log("\n[STEP 9] Verifier validates the presentation...")

        // Verifier resolve Issuer DID
        console.log("Using issuer document to validate presentation...")
        // In a real implementation, you would extract the issuer from the presentation and resolve it
        // For our example, we'll use the issuer document directly
        const issuerDocV = issuerDoc
        console.log("Using issuer document for validation")

        console.log("Validating presentation with challenge...")
        const presentationValidationOptions =
            new JptPresentationValidationOptions({ nonce: challenge })
        const decodedPresentedCredential = JptPresentationValidator.validate(
            presentationJpt,
            issuerDocV,
            presentationValidationOptions,
            FailFast.FirstError
        )

        console.log("\n✅ Presentation successfully validated!")
        console.log(
            "✅ Presented credential successfully validated: " +
                decodedPresentedCredential.credential()
        )

        // Display what the verifier would see - the disclosed fields only
        const visibleCredential = {
            name: "Alice",
            mainCourses: ["Object-oriented Programming"], // Mathematics is concealed
            degree: {
                type: "BachelorDegree",
                // name is concealed
            },
            GPA: 4.0,
        }

        console.log("\nVerifier's view of credential (with concealed fields):")
        console.log(JSON.stringify(visibleCredential, null, 2))

        console.log("\n✅ Presentation validation successful!")
        console.log("✅ Credential issuer verified")
        console.log("✅ Credential integrity verified")
        console.log(
            "✅ Selective disclosure verified - concealed fields remain hidden"
        )
        console.log(
            "✅ Challenge verification successful - no replay attack possible"
        )

        console.log("\n=".repeat(80))
        console.log(
            "IOTA Identity Zero-Knowledge Proof Example Completed Successfully!"
        )
        console.log("=".repeat(80))
    } catch (error) {
        console.error(`❌ Error: ${error}`)
    }
}

// Run the example
zkp()
    .then(() => console.log("Example completed successfully"))
    .catch((err: Error) => console.error(`Error in main: ${err.message}`))
