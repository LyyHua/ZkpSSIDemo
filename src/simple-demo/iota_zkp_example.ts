/**
 * Simple Zero-Knowledge Proof (ZKP) demo using IOTA Identity
 *
 * This example demonstrates how to:
 * 1. Create an identity for an issuer
 * 2. Create an identity for a holder
 * 3. Issue a verifiable credential from the issuer to the holder
 * 4. Create a selective disclosure presentation from the credential
 * 5. Verify the presentation (as a verifier) without revealing all credential data
 */

import {
    CredentialValidator,
    Credential,
    Document,
    IotaDID,
    IotaDocument,
    IotaIdentityClient,
    JwkMemStore,
    JwsAlgorithm,
    KeyIdMemStore,
    MethodScope,
    ProofOptions,
    Storage,
    VerificationMethod,
    SelectiveDisclosurePresentation,
    Resolver,
    RevocationBitmap,
    FailFast,
    PresentationValidator,
} from "@iota/identity-wasm/node"

// Helper function to create a new identity with a verification method
async function createIdentity(
    client: IotaIdentityClient,
    storage: Storage,
    alias: string
): Promise<IotaDocument> {
    // Create a new DID and DID document
    const builder = new IotaDocument.builder()
    const document = await client.createDid(null, builder)

    // Generate a new key pair and add it as a verification method to the DID document
    const jwkStorage = new JwkMemStore()
    const keyIdStorage = new KeyIdMemStore()

    const keyId = await storage.generateEd25519Key()

    // Add verification method with the generated key
    const method = await storage.createVerificationMethod(
        document.id(),
        keyId,
        VerificationMethod.PURPOSE_AUTHENTICATION
    )

    document.insertMethod(
        method,
        MethodScope.VERIFICATION_METHOD_SCOPE_AUTHENTICATION
    )

    // Update the document in the Tangle
    await client.publishDocument(document)

    console.log(`Created identity for ${alias}: ${document.id()}`)

    return document
}

// Main function to demonstrate the ZKP workflow
async function main() {
    try {
        console.log("Starting IOTA Identity ZKP demo...")

        // Setup storage for cryptographic keys
        const storage = new Storage(new JwkMemStore(), new KeyIdMemStore())

        // Create a client to interact with the IOTA ledger
        // In a real implementation, you would connect to an actual node
        // For this demo, we'll create a mock client
        const client = new IotaIdentityClient()

        // =========================================================================
        // 1 & 2. Create identities for the issuer and holder
        // =========================================================================
        console.log("\n=== Creating Identities ===")
        const issuerDocument = await createIdentity(client, storage, "Issuer")
        const holderDocument = await createIdentity(client, storage, "Holder")

        // =========================================================================
        // 3. Issue a verifiable credential
        // =========================================================================
        console.log("\n=== Issuing Credential ===")

        // For revocation, create a RevocationBitmap
        const revocationBitmap = new RevocationBitmap()
        const revocationMethod = revocationBitmap.toVerificationMethod(
            issuerDocument.id(),
            "#revocation"
        )
        issuerDocument.insertMethod(
            revocationMethod,
            MethodScope.VERIFICATION_METHOD_SCOPE_ASSERTION
        )

        // Update issuer document with the revocation method
        await client.publishDocument(issuerDocument)

        // Create the credential subject with the holder's DID as the id
        const subject = {
            id: holderDocument.id().toString(),
            name: "Alice Smith",
            age: 25,
            dateOfBirth: "1998-05-15",
            ssn: "123-45-6789", // sensitive data we may want to hide
            address: {
                street: "123 Privacy Lane",
                city: "Secretville",
                country: "Cryptonia",
            },
        }

        // Create the credential
        const credential = new Credential.builder()
            .id("https://example.edu/credentials/3732")
            .issuer(issuerDocument.id().toString())
            .type("PersonalDataCredential")
            .subject(subject)
            .build()

        // Sign the credential with the issuer's key
        const signedCredential = await storage.signCredential(
            issuerDocument,
            credential,
            new ProofOptions.builder()
                .method("#authentication")
                .created(new Date())
                .build()
        )

        console.log(
            "Credential issued:",
            JSON.stringify(signedCredential.toJSON(), null, 2)
        )

        // =========================================================================
        // 4. Create a selective disclosure presentation
        // =========================================================================
        console.log("\n=== Creating Selective Disclosure Presentation ===")

        // Define fields to disclose (everything except the SSN and detailed address)
        const disclosureFields = ["id", "name", "age", "dateOfBirth"]

        // Create a selective disclosure presentation
        const presentation =
            await SelectiveDisclosurePresentation.createPresentation(
                signedCredential,
                disclosureFields
            )

        // Sign the presentation with the holder's key
        const signedPresentation = await storage.signPresentation(
            holderDocument,
            presentation,
            new ProofOptions.builder()
                .method("#authentication")
                .challenge("1234567890")
                .domain("example.org")
                .created(new Date())
                .build()
        )

        console.log(
            "Selective Disclosure Presentation created:",
            JSON.stringify(signedPresentation.toJSON(), null, 2)
        )

        // =========================================================================
        // 5. Verify the presentation
        // =========================================================================
        console.log("\n=== Verifying Presentation ===")

        // Create a resolver to verify the DIDs
        const resolver = new Resolver()

        // Create validators
        const credentialValidator = new CredentialValidator({
            resolver,
            standardRevocation: [RevocationBitmap.standard()],
        })

        const presentationValidator = new PresentationValidator({
            resolver,
            credentialValidator,
        })

        // Verify the presentation
        const result = await presentationValidator.verify(
            signedPresentation,
            {
                challenge: "1234567890",
                domain: "example.org",
            },
            FailFast.FirstError
        )

        if (result.isValid()) {
            console.log("✅ Presentation verified successfully!")
            console.log(
                "The presentation only revealed the following fields:",
                disclosureFields
            )
            console.log("The SSN and detailed address remained hidden!")
        } else {
            console.error(
                "❌ Presentation verification failed:",
                result.error()
            )
        }
    } catch (error) {
        console.error("Error in ZKP demo:", error)
    }
}

// Run the demo
main().catch(console.error)
