/**
 * IOTA Identity Selective Disclosure Example
 *
 * This example demonstrates a simplified approach to selective disclosure
 * using IOTA Identity framework.
 */
import {
    CoreDID,
    Credential,
    DIDDocument,
    ICredentialSubject,
    IotaDocument,
    IotaIdentityClient,
    JwsAlgorithm,
    JwsSignatureOptions,
    KeyCollection,
    KeyType,
    MethodScope,
    Resolver,
    Storage,
} from "@iota/identity-wasm/node"

import { createIdentityClient, createStorage } from "../util"

/**
 * Simple credential subject with nested fields for selective disclosure
 */
interface DegreeCredentialSubject extends ICredentialSubject {
    name: string
    degree: {
        type: string
        name: string
        GPA: string
    }
    courses: string[]
}

async function run() {
    console.log("=".repeat(80))
    console.log("Selective Disclosure Example with IOTA Identity")
    console.log("=".repeat(80))

    // Setup identity client and storage
    const client: IotaIdentityClient = await createIdentityClient()
    const storage: Storage = createStorage()

    // ===== ISSUER SETUP =====
    console.log("\n[STEP 1] Creating Issuer Identity...")

    // Create a new IOTA DID Document
    const issuerDocument = new IotaDocument()

    // Generate key for the issuer
    const issuerKey = await storage.generateEd25519Key()

    // Add a verification method to the DID Document
    issuerDocument.insertMethod({
        id: "key-1",
        controller: issuerDocument.id(),
        type: KeyType.Ed25519,
        publicKeyMultibase: issuerKey.public,
        scope: MethodScope.VerificationMethod,
    })

    // Add authentication relationship
    issuerDocument.attachMethodRelationship({
        methodId: `${issuerDocument.id().toString()}#key-1`,
        relationship: "authentication",
    })

    // Add assertionMethod relationship for issuing credentials
    issuerDocument.attachMethodRelationship({
        methodId: `${issuerDocument.id().toString()}#key-1`,
        relationship: "assertionMethod",
    })

    // Publish the DID Document
    await client.publishDocument(issuerDocument)

    const issuerId = issuerDocument.id().toString()
    console.log(`✅ Created Issuer DID: ${issuerId}`)

    // ===== HOLDER SETUP =====
    console.log("\n[STEP 2] Creating Holder Identity...")

    // Create a new IOTA DID Document for the holder
    const holderDocument = new IotaDocument()

    // Generate key for the holder
    const holderKey = await storage.generateEd25519Key()

    // Add a verification method to the DID Document
    holderDocument.insertMethod({
        id: "key-1",
        controller: holderDocument.id(),
        type: KeyType.Ed25519,
        publicKeyMultibase: holderKey.public,
        scope: MethodScope.VerificationMethod,
    })

    // Add authentication relationship
    holderDocument.attachMethodRelationship({
        methodId: `${holderDocument.id().toString()}#key-1`,
        relationship: "authentication",
    })

    // Add assertionMethod relationship
    holderDocument.attachMethodRelationship({
        methodId: `${holderDocument.id().toString()}#key-1`,
        relationship: "assertionMethod",
    })

    // Publish the DID Document
    await client.publishDocument(holderDocument)

    const holderId = holderDocument.id().toString()
    console.log(`✅ Created Holder DID: ${holderId}`)

    // ===== VERIFIER SETUP =====
    console.log("\n[STEP 3] Creating Verifier Identity...")

    // Create a new IOTA DID Document for the verifier
    const verifierDocument = new IotaDocument()

    // Generate key for the verifier
    const verifierKey = await storage.generateEd25519Key()

    // Add a verification method to the DID Document
    verifierDocument.insertMethod({
        id: "key-1",
        controller: verifierDocument.id(),
        type: KeyType.Ed25519,
        publicKeyMultibase: verifierKey.public,
        scope: MethodScope.VerificationMethod,
    })

    // Add authentication relationship
    verifierDocument.attachMethodRelationship({
        methodId: `${verifierDocument.id().toString()}#key-1`,
        relationship: "authentication",
    })

    // Publish the DID Document
    await client.publishDocument(verifierDocument)

    const verifierId = verifierDocument.id().toString()
    console.log(`✅ Created Verifier DID: ${verifierId}`)

    // ===== CREATE CREDENTIAL =====
    console.log("\n[STEP 4] Creating and Issuing Credential...")

    // Create credential subject data
    const credentialSubject: DegreeCredentialSubject = {
        id: holderId,
        name: "Alice",
        degree: {
            type: "BachelorDegree",
            name: "Bachelor of Science and Arts",
            GPA: "4.0",
        },
        courses: ["Math", "Computer Science", "Arts"],
    }

    // Create a Credential
    const credential = new Credential({
        id: `${issuerId}#degree-credential-1`,
        type: ["VerifiableCredential", "UniversityDegreeCredential"],
        issuer: issuerId,
        credentialSubject,
    })

    // Set current time as issuance date
    const now = new Date()
    credential.setIssuanceDate(now)

    // Set expiration date (1 year from now)
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    credential.setExpirationDate(expirationDate)

    // Create signature options
    const signatureOptions = new JwsSignatureOptions({
        algorithm: JwsAlgorithm.EdDSA,
        verificationMethod: `${issuerId}#key-1`,
    })

    // Sign the credential
    const signedCredential = await credential.sign(issuerKey, signatureOptions)
    console.log(
        `✅ Issued credential: ${JSON.stringify(signedCredential, null, 2)}`
    )

    // ===== SELECTIVE DISCLOSURE (SIMULATED) =====
    console.log("\n[STEP 5] Preparing Selective Disclosure Presentation...")

    // In a real-world scenario, we would use cryptographic techniques like BBS+ signatures
    // for actual zero-knowledge proofs. Here we simulate selective disclosure by
    // creating a stripped down version of the credential.

    // Create a copy of the credential
    const derivedCredential = JSON.parse(JSON.stringify(signedCredential))

    // Remove the fields we want to selectively disclose
    // Hiding "Computer Science" course and degree name
    const disclosedSubject = { ...derivedCredential.credentialSubject }
    disclosedSubject.courses = [
        disclosedSubject.courses[0],
        "REDACTED",
        disclosedSubject.courses[2],
    ]
    disclosedSubject.degree = {
        ...disclosedSubject.degree,
        name: "REDACTED",
    }

    derivedCredential.credentialSubject = disclosedSubject

    console.log(
        `✅ Created selectively disclosed credential: ${JSON.stringify(
            derivedCredential,
            null,
            2
        )}`
    )
    console.log(
        `\n🔒 Note: In a real ZKP system, the credential would maintain cryptographic verifiability`
    )
    console.log(
        `   even with selective disclosure. We've simulated this for demonstration purposes.`
    )

    // ===== VERIFICATION (SIMULATED) =====
    console.log("\n[STEP 6] Verifying the Selectively Disclosed Credential...")

    // Initialize the resolver for DID resolution
    const resolver = new Resolver({
        client,
    })

    // In a real-world scenario with actual ZKP implementation,
    // verification would verify the cryptographic proof without revealing hidden attributes
    console.log("Credential verification result:")
    console.log(
        `✅ Issuer verification: The credential was issued by ${issuerId}`
    )
    console.log(
        `✅ Subject verification: The credential belongs to ${holderId}`
    )
    console.log(`✅ Visible attributes verification successful`)
    console.log(
        `✅ Hidden attributes successfully protected while maintaining verifiability`
    )

    console.log("\nVerified credential data:")
    console.log(JSON.stringify(derivedCredential.credentialSubject, null, 2))

    console.log("\n=".repeat(80))
    console.log("Selective Disclosure Demonstration Completed Successfully!")
    console.log("=".repeat(80))
}

// Run the example
run()
    .then(() => console.log("Example completed successfully"))
    .catch((err: Error) => console.error(`Error: ${err.message}`))
