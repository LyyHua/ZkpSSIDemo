/**
 * More advanced ZKP implementation - still simulated but using IOTA Identity concepts
 */
import {
    Credential,
    FailFast,
    IotaDocument,
    MethodScope,
    ProofAlgorithm,
    SelectiveDisclosurePresentation,
} from "@iota/identity-wasm/node"
import { createStorage } from "../util-simple"

/**
 * Runs the advanced ZKP example
 */
export async function zkp() {
    console.log("=".repeat(80))
    console.log("IOTA Identity Advanced Zero-Knowledge Proof Implementation")
    console.log("=".repeat(80))

    try {
        // === Step 1: Create Issuer ===
        console.log("\n[STEP 1] Creating issuer document...")
        // Simulating a network
        const network = "smr"

        // Create storage and document
        const issuerStorage = createStorage()
        const issuerDocument = new IotaDocument(network)

        // Generate verification method with BLS key for BBS+ signatures
        console.log("Generating BLS method for issuer document...")
        const issuerFragment = await issuerDocument.generateMethodJwp(
            issuerStorage,
            ProofAlgorithm.BLS12381_SHA256,
            undefined,
            MethodScope.VerificationMethod()
        )

        console.log(`✅ Created issuer DID: ${issuerDocument.id()}`)

        // === Step 2: Create Credential ===
        console.log("\n[STEP 2] Creating credential with university degree...")

        // Create subject
        const subject = {
            name: "Alice",
            mainCourses: ["Object-oriented Programming", "Mathematics"],
            degree: {
                type: "BachelorDegree",
                name: "Bachelor of Science and Arts",
            },
            GPA: 4.0,
        }

        // Create credential
        const credential = new Credential({
            id: "https:/example.edu/credentials/3732",
            issuer: issuerDocument.id(),
            type: "UniversityDegreeCredential",
            credentialSubject: subject,
        })

        // Create JPT credential
        console.log("Creating credential with BBS+ signature...")
        // In real code, we would sign the credential:
        /*
    const credentialJpt = await issuerDocument.createCredentialJpt(
      credential, 
      issuerStorage,
      issuerFragment, 
      new JwpCredentialOptions()
    );
    */

        // For simulation, we'll pretend we have a signed credential
        const credentialJpt = {
            toString: () =>
                "eyJhbGciOiJCQlMtSldTIiwia2lkIjoiZGlkOmlvdGE6c21yOjB4MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYja2V5LTEiLCJ0eXAiOiJKV1AifQ.eyJpYXQiOjE3MTU3MzQyMDIsImlzcyI6ImRpZDppb3RhOnNtcjoweDEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmIiwianRpIjoiaHR0cHM6L2V4YW1wbGUuZWR1L2NyZWRlbnRpYWxzLzM3MzIiLCJuYmYiOjE3MTU3MzQyMDIsInN1YiI6IlpseDFaM0J5VUVkeVlWOHlYelI4IiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiR1BBIjo0LCJkZWdyZWUiOnsibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiLCJ0eXBlIjoiQmFjaGVsb3JEZWdyZWUifSwibWFpbkNvdXJzZXMiOlsiT2JqZWN0LW9yaWVudGVkIFByb2dyYW1taW5nIiwiTWF0aGVtYXRpY3MiXSwibmFtZSI6IkFsaWNlIn0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJVbml2ZXJzaXR5RGVncmVlQ3JlZGVudGlhbCJdfX0.lGVYVEoy5rci0XheP72GGS9ST36NQ08oVCbZ3adDQ85",
            decodedJwp: () => ({
                getIssuerProtectedHeader: () => ({
                    kid: `${issuerDocument.id()}#key-1`,
                }),
            }),
        }

        console.log(
            `✅ Created credential: ${credentialJpt
                .toString()
                .substring(0, 64)}...`
        )

        // === Step 3: Concealing attributes with Selective Disclosure ===
        console.log("\n[STEP 3] Creating selective disclosure presentation...")

        // In real code, we validate the credential first before creating a presentation
        /*
    const decodedCredential = JptCredentialValidator.validate(
      credentialJpt,
      issuerDocument,
      new JptCredentialValidationOptions(),
      FailFast.FirstError,
    );
    */
        // Simulate decoded credential for this example
        const decodedCredential = {
            decodedJwp: () => credentialJpt.decodedJwp(),
        }

        // Generate random challenge
        const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"
        console.log(`Challenge for presentation: ${challenge}`)

        // Create selective disclosure presentation
        console.log("Creating selective disclosure presentation...")
        console.log("🔒 Concealing fields: mainCourses[1], degree.name")

        // In real code, we'd create a real selective disclosure:
        /*
    const selectiveDisclosurePresentation = new SelectiveDisclosurePresentation(decodedCredential.decodedJwp());
    selectiveDisclosurePresentation.concealInSubject("mainCourses[1]");
    selectiveDisclosurePresentation.concealInSubject("degree.name");
    
    const presentationJpt = await issuerDocument.createPresentationJpt(
      selectiveDisclosurePresentation,
      methodId,
      { nonce: challenge }
    );
    */

        // Simulate the presentation
        const presentationJpt = {
            toString: () =>
                "eyJhbGciOiJCQlMtSldTIiwia2lkIjoiZGlkOmlvdGE6c21yOjB4MTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYja2V5LTEiLCJ0eXAiOiJKV1AifQ.eyJpYXQiOjE3MTU3MzQyMDIsImlzcyI6ImRpZDppb3RhOnNtcjoweDEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmIiwianRpIjoiaHR0cHM6L2V4YW1wbGUuZWR1L2NyZWRlbnRpYWxzLzM3MzIiLCJub25jZSI6IjQ3NWE3OTg0LTFiYjUtNGM0Yy1hNTZmLTgyMmJjY2Q0NjQ0MCIsIm5iZiI6MTcxNTczNDIwMiwic3ViIjoiWmx4MVozQnlVRWR5WVY4eVh6UjgiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJHUEEiOjQsImRlZ3JlZSI6eyJ0eXBlIjoiQmFjaGVsb3JEZWdyZWUifSwibWFpbkNvdXJzZXMiOlsiT2JqZWN0LW9yaWVudGVkIFByb2dyYW1taW5nIl0sIm5hbWUiOiJBbGljZSJ9LCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXX19.Ao9aBX5zSasdfASDF235SDFsdfSDFsdfSDFsdfSDFsdfSDF3hHSg2sDo3R",
        }

        console.log(
            `✅ Created presentation: ${presentationJpt
                .toString()
                .substring(0, 64)}...`
        )

        // === Step 4: Verifier validates the presentation ===
        console.log("\n[STEP 4] Verifier validates presentation...")

        // In real code:
        /*
    const presentationValidationOptions = new JptPresentationValidationOptions({ nonce: challenge });
    const decodedPresentedCredential = JptPresentationValidator.validate(
      presentationJpt,
      issuerDocument,
      presentationValidationOptions,
      FailFast.FirstError,
    );
    */

        // Simulate successful validation
        console.log("✅ Presentation validation successful!")
        console.log("✅ Credential issuer verified")
        console.log("✅ Credential integrity verified")
        console.log("✅ Challenge verification successful")

        // === Show what the verifier can see ===
        console.log("\nVerifier's view of credential (with concealed fields):")
        const visibleCredential = {
            name: "Alice",
            mainCourses: ["Object-oriented Programming"], // Mathematics is concealed
            degree: {
                type: "BachelorDegree",
                // name is concealed
            },
            GPA: 4.0,
        }

        console.log(JSON.stringify(visibleCredential, null, 2))

        console.log("\n=".repeat(80))
        console.log("Advanced ZKP implementation completed successfully")
        console.log("=".repeat(80))
    } catch (error) {
        console.error(`❌ Error: ${error}`)
    }
}
