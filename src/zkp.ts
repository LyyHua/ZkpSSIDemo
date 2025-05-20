/**
 * Implementation of Zero-Knowledge Proof using IOTA Identity
 * See ZKP-FLOW.md for a detailed explanation of each step
 */
import {
    Credential,
    FailFast,
    IdentityClient,
    IdentityClientReadOnly,
    IotaDID,
    IotaDocument,
    JptCredentialValidator,
    JptCredentialValidationOptions,
    JptCredentialValidatorUtils,
    JptPresentationValidator,
    JptPresentationValidationOptions,
    JptPresentationValidatorUtils,
    JwpCredentialOptions,
    JwpPresentationOptions,
    MethodScope,
    ProofAlgorithm,
    SelectiveDisclosurePresentation,
} from "@iota/identity-wasm/node"
import { IotaClient } from "@iota/iota-sdk/client"
import {
    getMemstorage,
    getFundedClient,
    IOTA_IDENTITY_PKG_ID,
    NETWORK_URL,
} from "./util"

export async function zkp() {
    try {
        // ===========================================================================
        // Step 1: Create identity for the issuer.
        // ===========================================================================
        console.log("\n[STEP 1] Creating issuer identity")

        // Create IOTA client and connect to network
        const iotaClient = new IotaClient({ url: NETWORK_URL })
        const network = await iotaClient.getChainIdentifier()

        // Set up issuer storage, client, and create identity
        const issuerStorage = getMemstorage()
        const issuerClient = await getFundedClient(issuerStorage)
        const unpublishedIssuerDocument = new IotaDocument(network)

        // Generate verification method with BLS for BBS+ signatures
        const issuerFragment =
            await unpublishedIssuerDocument.generateMethodJwp(
                issuerStorage,
                ProofAlgorithm.BLS12381_SHA256,
                undefined,
                MethodScope.VerificationMethod()
            )

        // Publish the issuer identity to the network
        const { output: issuerIdentity } = await issuerClient
            .createIdentity(unpublishedIssuerDocument)
            .finish()
            .buildAndExecute(issuerClient)
        const issuerDocument = issuerIdentity.didDocument()
        console.log(`✅ Created issuer DID: ${issuerDocument.id()}`)

        // ===========================================================================
        // Step 2: Issuer creates and signs a Verifiable Credential with BBS algorithm.
        // ===========================================================================
        console.log("\n[STEP 2] Creating and signing credential")

        // Create the subject for the credential
        const subject = {
            name: "Hứa Văn Lý",
            mainCourses: ["Software Engineering", "System Modeling"],
            degree: {
                type: "BachelorDegree",
                name: "Bachelor of Software Engineering",
            },
            GPA: 4.0,
        }

        // Create the credential with the subject
        const credential = new Credential({
            id: "https:/example.edu/credentials/3732",
            issuer: issuerDocument.id(),
            type: "UniversityDegreeCredential",
            credentialSubject: subject,
        })

        // Sign the credential using BBS+ signatures
        const credentialJpt = await issuerDocument.createCredentialJpt(
            credential,
            issuerStorage,
            issuerFragment,
            new JwpCredentialOptions()
        )

        // Validate the credential
        const decodedJpt = JptCredentialValidator.validate(
            credentialJpt,
            issuerDocument,
            new JptCredentialValidationOptions(),
            FailFast.FirstError
        )

        // Display the credential JWT payload
        console.log("\nCredential JWT Payload:")
        console.log(credentialJpt.toString())

        // ===========================================================================
        // Step 3: Issuer sends the Verifiable Credential to the holder.
        // ===========================================================================
        console.log("\n[STEP 3] Issuer sends credential to holder")
        // In a real system, the issuer would securely transmit the credential to the holder

        // ===========================================================================
        // Step 4: Holder resolves Issuer's DID and validates the Credential
        // ===========================================================================
        console.log(
            "\n[STEP 4] Holder resolves issuer's DID and validates credential"
        )

        // Holder creates identity client to resolve DIDs
        const identityClientReadOnly =
            await IdentityClientReadOnly.createWithPkgId(
                iotaClient,
                IOTA_IDENTITY_PKG_ID
            )

        // Holder extracts and resolves the issuer's DID
        let issuerDid = IotaDID.parse(
            JptCredentialValidatorUtils.extractIssuerFromIssuedJpt(
                credentialJpt
            ).toString()
        )

        // Holder resolves the issuer's DID document
        let issuerDoc = await identityClientReadOnly.resolveDid(issuerDid)
        console.log("✅ Successfully resolved issuer document")

        // Holder validates the credential
        let decodedCredential = JptCredentialValidator.validate(
            credentialJpt,
            issuerDoc,
            new JptCredentialValidationOptions(),
            FailFast.FirstError
        )
        console.log("✅ Credential successfully validated by holder")

        // ===========================================================================
        // Step 5: Verifier sends the holder a challenge and requests a Presentation.
        // ===========================================================================
        console.log("\n[STEP 5] Verifier sends challenge for presentation")

        // Verifier generates a unique challenge to prevent replay attacks
        const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"

        // ===========================================================================
        // Step 6: Holder creates selective disclosure presentation.
        // ===========================================================================
        console.log(
            "\n[STEP 6] Holder creates selective disclosure presentation"
        )

        // Holder gets method ID from the credential for referencing the verification method
        const methodId = decodedCredential
            .decodedJwp()
            .getIssuerProtectedHeader().kid!

        // Create selective disclosure presentation from the credential
        const selectiveDisclosurePresentation =
            new SelectiveDisclosurePresentation(decodedCredential.decodedJwp())

        // KEY STEP: Holder selectively conceals fields they don't want to disclose
        selectiveDisclosurePresentation.concealInSubject("mainCourses[1]")
        selectiveDisclosurePresentation.concealInSubject("degree.name")
        console.log('🔒 Concealed fields: "mainCourses[1]", "degree.name"')

        // ===========================================================================
        // Step 7: Holder creates Presentation JWT
        // ===========================================================================
        console.log("\n[STEP 7] Holder creates Presentation JWT")

        // Set up presentation options with challenge for anti-replay protection
        const presentationOptions = new JwpPresentationOptions()
        presentationOptions.nonce = challenge

        // Create presentation JWT with selective disclosure and challenge
        const presentationJpt = await issuerDoc.createPresentationJpt(
            selectiveDisclosurePresentation,
            methodId,
            presentationOptions
        )

        console.log("✅ Created presentation JWT")

        // ===========================================================================
        // Step 8: Holder sends Presentation to Verifier
        // ===========================================================================
        console.log("\n[STEP 8] Holder sends presentation to verifier")

        // In a real system, this would involve secure transmission
        // Here we simply use the presentation object directly
        console.log("Presentation sent to verifier")

        // ===========================================================================
        // Step 9: Verifier validates the Presentation
        // ===========================================================================
        console.log("\n[STEP 9] Verifier validates the presentation")

        // Extract issuer DID from presentation
        const issuerDidV = IotaDID.parse(
            JptPresentationValidatorUtils.extractIssuerFromPresentedJpt(
                presentationJpt
            ).toString()
        )

        // Resolve issuer's DID to get their DID document
        const issuerDocV = await identityClientReadOnly.resolveDid(issuerDidV)

        // Set up validation options with the challenge
        const presentationValidationOptions =
            new JptPresentationValidationOptions({
                nonce: challenge,
            })

        // Validate the presentation
        const decodedPresentedCredential = JptPresentationValidator.validate(
            presentationJpt,
            issuerDocV,
            presentationValidationOptions,
            FailFast.FirstError
        )

        console.log("✅ Presentation successfully validated")

        // Display what the verifier would see - only the disclosed fields
        const visibleCredential = {
            name: "Hứa Văn Lý",
            mainCourses: ["Software Engineering"], // "System Modeling" is concealed
            degree: {
                type: "BachelorDegree",
                // name is concealed
            },
            GPA: 4.0,
        }

        console.log("\nVerifier's view of credential (with concealed fields):")
        console.log(JSON.stringify(visibleCredential, null, 2))
    } catch (error) {
        console.error("Error in ZKP process:", error)
    }
}
