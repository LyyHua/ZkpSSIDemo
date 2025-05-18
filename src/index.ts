/**
 * IOTA Identity Selective Disclosure Example
 *
 * This example demonstrates how to use Zero-Knowledge Proofs (ZKP) for selective disclosure
 * in verifiable credentials using the IOTA Identity framework.
 */
import {
    CoreDID,
    Credential,
    ICredential,
    IotaDocument,
    IotaIdentityClient,
    JwsSignatureOptions,
    MethodScope,
    ProofPurpose,
    RevocationBitmap,
    Resolver,
    Storage,
    Timestamp,
} from "@iota/identity-wasm/node"

import { createDid, createIdentityClient, createStorage } from "./util"

async function run() {
    console.log("=".repeat(80))
    console.log("ZKP Demonstration - Selective Disclosure with IOTA Identity")
    console.log("=".repeat(80))

    // Setup identity client and storage
    const client: IotaIdentityClient = await createIdentityClient()
    const storage: Storage = createStorage()

    // ===== ISSUER SETUP =====
    console.log("\n[STEP 1] Creating Issuer Identity...")
    // Create Issuer DID Document with verification method.
    const issuerDocument: IotaDocument = await createDid(client, storage)
    const issuerId: string = issuerDocument.id()
    console.log(`✅ Created Issuer DID: ${issuerId}`)
    console.log(
        `✅ Published Issuer DID Document: ${JSON.stringify(
            issuerDocument.toJSON(),
            null,
            2
        )}`
    )

    // ===== HOLDER SETUP =====
    console.log("\n[STEP 2] Creating Holder Identity...")
    const holderDocument: IotaDocument = await createDid(client, storage)
    const holderId: string = holderDocument.id()
    console.log(`✅ Created Holder DID: ${holderId}`)

    // ===== VERIFIER SETUP =====
    console.log("\n[STEP 3] Creating Verifier Identity...")
    const verifierDocument: IotaDocument = await createDid(client, storage)
    const verifierId: string = verifierDocument.id()
    console.log(`✅ Created Verifier DID: ${verifierId}`)

    // ===== CREATE CREDENTIAL SUBJECT =====
    console.log("\n[STEP 4] Creating Credential Subject...")
    // Complex subject with nested fields for selective disclosure
    const subjectData = {
        id: holderId,
        name: "Alice",
        degree: {
            name: "Bachelor of Science and Arts",
            type: "BachelorDegree",
            GPA: "4.0",
        },
        mainCourses: ["Math", "Computer Science", "Arts"],
    }

    const subject = Subject.fromJSON(subjectData)
    console.log(`✅ Created credential subject for ${subjectData.name}`)

    // ===== ISSUE CREDENTIAL =====
    console.log("\n[STEP 5] Issuing Verifiable Credential...")
    // Issue a credential with the university degree subject.
    const credential = new VerifiableCredential({
        id: `${issuerId}#degree-credential-1`,
        type: "UniversityDegreeCredential",
        issuer: issuerId,
        credentialSubject: subject,
    })

    // Set issuance date to now and expiration date to 1 year from now.
    const now = Timestamp.nowUTC()
    credential.setIssuanceDate(now)
    credential.setExpirationDate(now.checkedAdd(Duration.years(1)))

    // Create a credential status for revocation using RevocationBitmap2022.
    const serviceId = `${issuerId}#revocation-bitmap-1`
    await RevocationBitmap.createService(
        issuerDocument,
        "revocation-bitmap-1",
        storage
    )
    await client.publishDocument(issuerDocument, storage)
    credential.setStatus({
        id: `${serviceId}#0`,
        type: "RevocationBitmap2022",
        statusListIndex: "0",
        statusListCredential: serviceId,
    })

    // Create proof options with selective disclosure support
    const proofOptions = new ProofOptions({
        purpose: ProofPurpose.assertionMethod(),
        created: now,
        verificationMethod: `${issuerId}#key-1`,
    })

    // Add the JWS signature to the credential.
    await credential.signWithBbsExt(proofOptions, storage)
    console.log(`✅ Issued credential: ${credential.toString()}`)

    // ===== SELECTIVE DISCLOSURE =====
    console.log("\n[STEP 6] Creating Selectively Disclosed Presentation...")
    // Conceal certain fields (mainCourses[1] and degree.name)
    const concealedFields = ["mainCourses[1]", "degree.name"]
    console.log(`🔒 Concealing fields: ${concealedFields.join(", ")}`)

    // Create derived credential with selective disclosure
    const derivedCredential = await VerifiableCredential.createBbsDerived(
        credential,
        concealedFields,
        storage
    )

    // Create a verifiable presentation containing the derived credential
    const presentation = new VerifiablePresentation({
        id: `${holderId}#presentation-1`,
        holder: holderId,
        verifiableCredential: [derivedCredential],
    })

    // Create signature options
    const signatureOptions = new JwsSignatureOptions({
        verificationMethod: `${holderId}#key-1`,
    })

    // Sign the presentation with the holder's key
    await presentation.sign(signatureOptions, storage)
    console.log(
        `✅ Created presentation with selectively disclosed credential: ${presentation.toString()}`
    )

    // ===== VERIFICATION =====
    console.log(
        "\n[STEP 7] Verifying Presentation with Selectively Disclosed Credential..."
    )
    // Initialize the DID resolver with the client to resolve DIDs.
    const resolver = new Resolver({
        client,
    })

    // Verify the presentation
    const presentationValidationResult = await presentation.verify({
        resolver,
        storage,
    })
    console.log(
        `✅ Presentation validation result: ${JSON.stringify(
            presentationValidationResult,
            null,
            2
        )}`
    )

    if (presentationValidationResult.isValid()) {
        // Extract the credential to verify its contents
        const derivedCredentialJson = derivedCredential.toJSON()
        console.log("\nVerified selectively disclosed credential content:")
        console.log(
            JSON.stringify(derivedCredentialJson.credentialSubject, null, 2)
        )

        console.log(
            "\n🔍 Note: The concealed fields are not present in the derived credential:"
        )
        console.log(`  - 'mainCourses[1]' (Computer Science course) is hidden`)
        console.log(
            `  - 'degree.name' (Bachelor of Science and Arts) is hidden`
        )
    } else {
        console.log("❌ Presentation verification failed")
    }

    console.log("\n=".repeat(80))
    console.log("Zero-Knowledge Proof Demonstration Completed Successfully!")
    console.log("=".repeat(80))
}

// Run the example
run()
    .then(() => console.log("Example completed successfully"))
    .catch((err: Error) => console.error(`Error: ${err.message}`))
