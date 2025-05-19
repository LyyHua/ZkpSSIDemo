# Zero-Knowledge Proof with IOTA Identity - Implementation Flow

This document explains the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity for selective disclosure of verifiable credentials. It covers the entire flow from identity creation to credential verification, with code examples from our implementation.

## Table of Contents

1. [Overview of the SSI Ecosystem](#overview-of-the-ssi-ecosystem)
2. [Step 1: Creating Issuer Identity](#step-1-creating-issuer-identity)
3. [Step 2: Creating and Signing Credentials](#step-2-creating-and-signing-credentials)
4. [Step 3: Issuer Sends Credential to Holder](#step-3-issuer-sends-credential-to-holder)
5. [Step 4: Holder Resolves Issuer's DID and Validates Credential](#step-4-holder-resolves-issuers-did-and-validates-credential)
6. [Step 5: Verifier Sends Challenge for Presentation](#step-5-verifier-sends-challenge-for-presentation)
7. [Step 6: Holder Creates Selective Disclosure Presentation](#step-6-holder-creates-selective-disclosure-presentation)
8. [Step 7: Holder Creates Presentation JWT](#step-7-holder-creates-presentation-jwt)
9. [Step 8: Holder Sends Presentation to Verifier](#step-8-holder-sends-presentation-to-verifier)
10. [Step 9: Verifier Validates the Presentation](#step-9-verifier-validates-the-presentation)
11. [Understanding JWT/JPT Payloads](#understanding-jwtjpt-payloads)

## Overview of the SSI Ecosystem

Self-Sovereign Identity (SSI) involves three key actors:

1. **Issuer**: Creates and signs verifiable credentials (e.g., universities, governments)
2. **Holder**: Receives credentials from issuers and creates presentations for verifiers
3. **Verifier**: Validates presentations from holders to verify claims

Each entity has its own Decentralized Identifier (DID) and DID Document containing public keys. Private keys are stored securely and used for signing operations.

```
┌─────────┐          ┌─────────┐          ┌─────────┐
│  Issuer │          │  Holder │          │ Verifier│
└────┬────┘          └────┬────┘          └────┬────┘
     │    1. Issue        │                    │
     │    Credential      │                    │
     │ ─────────────────> │                    │
     │                    │  2. Present        │
     │                    │  Selective Data    │
     │                    │ ─────────────────> │
     │                    │                    │
     │                    │  3. Verify & Trust │
     │                    │ <─ ─ ─ ─ ─ ─ ─ ─ ─ │
     ▼                    ▼                    ▼
```

## Step 1: Creating Issuer Identity

The issuer creates an identity with a verification method capable of BBS+ signatures, which enable selective disclosure.

```typescript
// Create client to connect to IOTA network
const iotaClient = new IotaClient({ url: NETWORK_URL })
const network = await iotaClient.getChainIdentifier()

// Create storage for issuer's keys
const issuerStorage = getMemstorage()

// Get funded client
const issuerClient = await getFundedClient(issuerStorage)

// Create unpublished issuer document
const unpublishedIssuerDocument = new IotaDocument(network)

// Generate verification method with BLS for BBS+ signatures
const issuerFragment = await unpublishedIssuerDocument.generateMethodJwp(
    issuerStorage,
    ProofAlgorithm.BLS12381_SHA256,
    undefined,
    MethodScope.VerificationMethod()
)

// Publish issuer identity to the network
const { output: issuerIdentity } = await issuerClient
    .createIdentity(unpublishedIssuerDocument)
    .finish()
    .buildAndExecute(issuerClient)
const issuerDocument = issuerIdentity.didDocument()
```

## Step 2: Creating and Signing Credentials

The issuer creates a credential with subject data and signs it using BBS+ signatures.

```typescript
// Create credential subject
const subject = {
    name: "Alice",
    mainCourses: ["Object-oriented Programming", "Mathematics"],
    degree: {
        type: "BachelorDegree",
        name: "Bachelor of Science and Arts",
    },
    GPA: 4.0,
}

// Build credential using the subject and issuer
const credential = new Credential({
    id: "https:/example.edu/credentials/3732",
    issuer: issuerDocument.id(),
    type: "UniversityDegreeCredential",
    credentialSubject: subject,
})

// Create JPT credential with BBS+ signature
const credentialJpt = await issuerDocument.createCredentialJpt(
    credential,
    issuerStorage,
    issuerFragment,
    new JwpCredentialOptions()
)

// Validate the credential's proof
const decodedJpt = JptCredentialValidator.validate(
    credentialJpt,
    issuerDocument,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

The credential JWT (JPT) is a structured token with three parts:

-   Header: Contains algorithm info and claims metadata
-   Payload: Contains the actual credential data
-   Signature: Cryptographic proof of the credential's authenticity

## Step 3: Issuer Sends Credential to Holder

In a real system, the issuer would securely transmit the credential to the holder:

```typescript
// In a real system, this would involve secure transmission
// Here we simply pass the credential JWT string
const credentialJptString = credentialJpt.toString()
// Transmit credentialJptString to holder...
```

The JWT payload looks like:

```
eyJ0eXAiOiJKUFQiLCJhbGciOiJCQlMtQkxTMTIzODEtU0hBMjU2Iiwia2lkIjoiZGlkOmlvdGE6...
```

## Step 4: Holder Resolves Issuer's DID and Validates Credential

The holder needs to resolve the issuer's DID to obtain their public key for validation:

```typescript
// Create identity client to resolve DIDs
const identityClientReadOnly = await IdentityClientReadOnly.createWithPkgId(
    iotaClient,
    IOTA_IDENTITY_PKG_ID
)

// Extract issuer DID from credential
let issuerDid = IotaDID.parse(
    JptCredentialValidatorUtils.extractIssuerFromIssuedJpt(
        credentialJpt
    ).toString()
)

// Resolve issuer's DID to get their DID document
let issuerDoc = await identityClientReadOnly.resolveDid(issuerDid)

// Validate the credential
let decodedCredential = JptCredentialValidator.validate(
    credentialJpt,
    issuerDoc,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

## Step 5: Verifier Sends Challenge for Presentation

The verifier generates a random challenge to prevent replay attacks:

```typescript
// Generate a random challenge
const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"
```

## Step 6: Holder Creates Selective Disclosure Presentation

The holder decides which fields to conceal and which to reveal:

```typescript
// Get method ID from credential for referencing verification method
const methodId = decodedCredential.decodedJwp().getIssuerProtectedHeader().kid!

// Create selective disclosure presentation from credential
const selectiveDisclosurePresentation = new SelectiveDisclosurePresentation(
    decodedCredential.decodedJwp()
)

// Conceal specific fields - this is the core of ZKP!
selectiveDisclosurePresentation.concealInSubject("mainCourses[1]")
selectiveDisclosurePresentation.concealInSubject("degree.name")
```

## Step 7: Holder Creates Presentation JWT

The holder creates a presentation JWT with the selective disclosure and challenge:

```typescript
// Set up presentation options with the challenge
const presentationOptions = new JwpPresentationOptions()
presentationOptions.nonce = challenge

// Create presentation JWT
const presentationJpt = await issuerDoc.createPresentationJpt(
    selectiveDisclosurePresentation,
    methodId,
    presentationOptions
)
```

## Step 8: Holder Sends Presentation to Verifier

The holder sends the presentation to the verifier:

```typescript
// In a real system, this would involve secure transmission
// Here we simply pass the presentation JWT string
const presentationJptString = presentationJpt.toString()
// Transmit presentationJptString to verifier...
```

## Step 9: Verifier Validates the Presentation

The verifier resolves the issuer's DID and validates the presentation:

```typescript
// Extract issuer DID from presentation
const issuerDidV = IotaDID.parse(
    JptPresentationValidatorUtils.extractIssuerFromPresentedJpt(
        presentationJpt
    ).toString()
)

// Resolve issuer's DID to get their DID document
const issuerDocV = await identityClientReadOnly.resolveDid(issuerDidV)

// Set up validation options with the challenge
const presentationValidationOptions = new JptPresentationValidationOptions({
    nonce: challenge,
})

// Validate the presentation
const decodedPresentedCredential = JptPresentationValidator.validate(
    presentationJpt,
    issuerDocV,
    presentationValidationOptions,
    FailFast.FirstError
)
```

After validation, the verifier can see only the disclosed fields:

```json
{
    "name": "Alice",
    "mainCourses": ["Object-oriented Programming"],
    "degree": {
        "type": "BachelorDegree"
    },
    "GPA": 4
}
```

## Understanding JWT/JPT Payloads

The JWT payloads used in this implementation have a specific structure:

1. **Credential JWT**:

    - Header: Contains information about the algorithm, issuer, and claims
    - Payload: Contains the credential data with tilde-separated fields
    - Signature: Cryptographic signature ensuring integrity

2. **Presentation JWT**:
    - Similar structure to credential JWT
    - Contains additional presentation header with challenge
    - Payload has null values for concealed fields

When decoded, a presentation JWT payload might look like:

```json
{
    "payloads": [
        "ImRpZDppb3RhOmNiY2Y4ZDM1OjB4Yzc0MTAzNjIzN2JiYWZhM2VmYjcwMGJmNmJkZDQ5OTBhOGRlMzZjNWVkNDdkNTFhYTVhNzQwYmMwMDFkNGRlZiI",
        null,
        null,
        "Imh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIg",
        "IlZlcmlmaWFibGVDcmVkZW50aWFsIg",
        "IlVuaXZlcnNpdHlEZWdyZWVDcmVkZW50aWFsIg",
        "NA",
        "IkJhY2hlbG9yRGVncmVlIg",
        null,
        "Ik9iamVjdC1vcmllbnRlZCBQcm9ncmFtbWluZyI",
        null,
        "IkFsaWNlIg"
    ],
    "issuer": "eyJ0eXAiOiJKUFQiLCJhbGci...",
    "proof": "eyJhbGciOiJCQlMtQkxTMTIzOD...",
    "presentation": "eyJub25jZSI6IjQ3NWE3OTg..."
}
```

Note how concealed fields are represented by `null` values, while disclosed fields contain their base64-encoded values.

---

The beauty of ZKP is that the verifier can cryptographically verify that:

1. The entire credential was properly signed by the issuer
2. No tampering has occurred with any fields
3. The challenge was properly incorporated (preventing replay attacks)

All this while seeing only the fields the holder chose to disclose!
