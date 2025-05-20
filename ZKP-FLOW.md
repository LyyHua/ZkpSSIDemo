# Zero-Knowledge Proof with IOTA Identity - Implementation Flow

This document explains the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity for selective disclosure of verifiable credentials. It covers the entire flow from identity creation to credential verification, with code examples from our implementation.

## Table of Contents

1. [Overview of the SSI Ecosystem](#overview-of-the-ssi-ecosystem)
   - [The W3C Trust Triangle](#the-w3c-trust-triangle)
   - [Decentralized Identifiers (DIDs)](#decentralized-identifiers-dids)
   - [DID Documents](#did-documents)
   - [Public/Private Key Relationships](#publicprivate-key-relationships)
   - [Where ZKP Fits in the SSI Model](#where-zkp-fits-in-the-ssi-model)
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

Self-Sovereign Identity (SSI) is a model for digital identity management that gives individuals control over their identity information without relying on centralized authorities. The SSI ecosystem consists of three primary actors:

1. **Issuer**: Creates and signs verifiable credentials (e.g., universities, governments, employers)
2. **Holder**: Receives credentials from issuers and creates presentations for verifiers
3. **Verifier**: Validates presentations from holders to verify claims

### The W3C Trust Triangle

The W3C Trust Triangle represents the trust relationships between these three entities:

```
┌───────────────────┐
│      ISSUER       │
│                   │
│ - Creates and     │
│   signs VCs       │
│ - Publishes DID   │
│   Document        │
└─────────┬─────────┘
          │
     1. Issues
   Credential with
      signature
          │
          ▼
┌───────────────────┐         ┌───────────────────┐
│      HOLDER       │         │     VERIFIER      │
│                   │    2.   │                   │
│ - Stores VCs      │ Present │ - Validates       │
│ - Controls        │ Selective│  presentations    │
│   disclosure      │  Data   │ - Checks issuer   │
│ - Creates         │ ──────> │   signatures      │
│   presentations   │         │ - Trusts issuer   │
└───────────────────┘         └─────────┬─────────┘
          ▲                             │
          │                             │
          └─────────────────────────────┘
                3. Trust Relationship
                   (Optional direct)
```

Key aspects of this trust relationship:

1. **Issuer → Holder**: The issuer creates a credential containing claims about the holder and cryptographically signs it.
2. **Holder → Verifier**: The holder presents selective information from their credentials to the verifier.
3. **Verifier → Issuer**: The verifier trusts the issuer's attestations by validating their signature.

### Decentralized Identifiers (DIDs)

Decentralized Identifiers (DIDs) are a fundamental component of SSI. They are:

- **Globally unique identifiers** that don't require a centralized registry
- **Persistent** and don't change over time
- **Resolvable** to DID documents containing verification methods
- **Cryptographically verifiable** and controlled by the DID subject

A DID looks like this:
```
did:iota:0x123456789abcdef...
  ^    ^         ^
  |    |         |
Method Method-   Method-specific identifier
       specific  (unique ID string)
       identifier
       (blockchain/ledger)
```

In the IOTA Identity framework, DIDs are stored on the IOTA Tangle (distributed ledger), making them immutable and tamper-proof.

### DID Documents

A DID Document is a JSON-LD document that contains information associated with a DID, including:

- **Verification Methods**: Public keys used for authentication and authorization
- **Services**: Endpoints where the DID subject can be contacted or interacted with
- **Authentication Methods**: References to verification methods for authentication
- **Assertion Methods**: References to verification methods for making assertions

Example DID Document structure:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:iota:0x123456789abcdef...",
  "verificationMethod": [
    {
      "id": "did:iota:0x123456789abcdef...#key-1",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:iota:0x123456789abcdef...",
      "publicKeyMultibase": "z28Kp7P9...DQk"
    },
    {
      "id": "did:iota:0x123456789abcdef...#key-2",
      "type": "BLS12381G2Key2020",
      "controller": "did:iota:0x123456789abcdef...",
      "publicKeyMultibase": "zUC7LTaPw...JWN"
    }
  ],
  "authentication": [
    "did:iota:0x123456789abcdef...#key-1"
  ],
  "assertionMethod": [
    "did:iota:0x123456789abcdef...#key-2"
  ],
  "service": [
    {
      "id": "did:iota:0x123456789abcdef...#linked-domain",
      "type": "LinkedDomains",
      "serviceEndpoint": "https://example.com"
    }
  ]
}
```

### Public/Private Key Relationships

In the SSI model, cryptographic key pairs are essential:

1. **Private Keys**:
   - Stored securely by the entity (never shared)
   - Used to sign credentials, presentations, and DID operations
   - Controlled solely by the DID subject
   - Can be rotated and revoked if compromised

2. **Public Keys**:
   - Published in the DID Document
   - Used by others to verify signatures
   - Different types for different purposes (authentication, assertion, etc.)
   - Can be associated with different verification methods

Key types in our implementation:
- **Ed25519**: Fast, secure signing for general operations
- **BLS12381**: Enables advanced cryptographic operations needed for ZKPs and selective disclosure

The relationship looks like:
```
┌───────────────┐              ┌───────────────┐
│  Private Key  │              │  Public Key   │
│ (stored       │  derives     │ (published in │
│  securely)    │─────────────>│  DID Document)│
└───────────────┘              └───────────────┘
        │                              │
        │                              │
        ▼                              ▼
┌───────────────┐              ┌───────────────┐
│   Signing     │              │  Verification │
│  Operations   │              │  Operations   │
└───────────────┘              └───────────────┘
```

### Where ZKP Fits in the SSI Model

Zero-Knowledge Proofs (ZKPs) are a cryptographic method that enables a party to prove they know a value without revealing the value itself. In the Self-Sovereign Identity ecosystem, ZKPs enable **selective disclosure** - a critical privacy feature that allows holders to reveal only specific parts of their credentials while keeping other parts confidential.

#### The Problem ZKPs Solve in SSI

Traditional digital signatures have an "all-or-nothing" property - either you show the entire signed document or you can't verify the signature at all. This creates a privacy issue in SSI, where credentials often contain more information than necessary for a specific verification scenario.

For example, a university degree credential might include:
- Full name
- Date of birth
- Degree type
- Graduation date
- GPA
- Student ID
- Courses completed

For many verification scenarios, only a subset of this information is needed (e.g., just proving you have a degree without revealing your GPA).

#### How BBS+ Signatures Enable ZKPs

The IOTA Identity framework uses BBS+ signatures, which have these key properties:

1. **Multi-message signing**: Can sign multiple attributes independently within a single credential
2. **Selective disclosure**: Can create proofs that reveal only selected attributes
3. **Zero-knowledge**: Can prove knowledge about hidden attributes without revealing them
4. **Unlinkability**: Presentations derived from the same credential are unlinkable

The mathematical properties of BBS+ signatures rely on pairing-friendly elliptic curves (specifically BLS12-381) and involve:
- Commitment schemes
- Bilinear pairings
- Mathematical transformations that preserve verification properties

#### ZKP Integration Points in the SSI Flow

1. **During Credential Issuance**:
   - The issuer must use the BLS12381_SHA256 algorithm for creating verification methods
   - Credentials are structured as a set of discrete claims that can be individually revealed or concealed
   - Each attribute in the credential is encoded separately in the signing process
   - The signature binds all attributes together cryptographically

2. **During Credential Storage**:
   - The holder stores the complete credential with all attributes
   - The holder also stores the cryptographic material needed to create selective disclosures later
   - No special processing is needed at this stage

3. **Between Holder and Verifier**:
   - When the holder receives a presentation request from a verifier, they can:
     - Decide which claims to reveal and which to conceal using the `concealInSubject()` method
     - Create a selective disclosure presentation that contains:
       - Revealed attributes in plaintext
       - Hidden attributes as "null" values
       - Cryptographic proof that hidden attributes were part of the original signed credential
     - Include a response to the verifier's challenge to prevent replay attacks

4. **During Verification**:
   - The verifier can cryptographically verify that:
     - All claims (both revealed and concealed) were part of the original credential
     - The issuer's signature is valid over the entire credential
     - The holder has not tampered with any information
     - The challenge was correctly incorporated in the proof
     - All this without seeing the concealed claims!

#### ZKP Capabilities in IOTA Identity

The IOTA Identity framework's implementation of ZKP provides several advanced features:

1. **Fine-grained selective disclosure**:
   - Select specific fields in a credential (e.g., `"name"`)
   - Select nested properties (e.g., `"degree.type"`)
   - Select specific array elements (e.g., `"mainCourses[0]"`)

2. **Predicate proofs** (planned feature):
   - Prove statements about attributes without revealing them
   - Examples: "Age is over 21", "GPA is above 3.0", "Salary is within range X-Y"

3. **Cross-credential proofs** (planned feature):
   - Create proofs that span multiple credentials
   - Example: Prove you have a degree AND a driver's license without revealing all details

This diagram illustrates where ZKP fits in the SSI flow:

```
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│      ISSUER     │        │      HOLDER     │       │     VERIFIER    │
└────────┬────────┘        └────────┬────────┘       └────────┬────────┘
         │                          │                          │
         │ 1. Creates               │                          │
         │ credential with BBS+     │                          │
         │ signature (ZKP-ready)    │                          │
         │                          │                          │
         │ 2. Issues credential     │                          │
         │────────────────────────> │                          │
         │                          │                          │
         │                          │ 3. Stores credential     │
         │                          │                          │
         │                          │ <─────────────────────── │
         │                          │ 4. Requests proof with   │
         │                          │    challenge             │
         │                          │                          │
         │                          │ 5. Creates ZKP with      │
         │                          │    selective disclosure   │
         │                          │    (THIS IS WHERE ZKP    │
         │                          │     HAPPENS!)            │
         │                          │                          │
         │                          │ 6. Sends presentation    │
         │                          │    with ZKP              │
         │                          │ ─────────────────────────>
         │                          │                          │
         │                          │                          │ 7. Verifies ZKP
         │                          │                          │    proof without
         │                          │                          │    seeing hidden
         │                          │                          │    attributes
         │                          │                          │
```

#### Example Code for ZKP in IOTA Identity

Here's a code example showing how selective disclosure is implemented:

```typescript
// Create selective disclosure presentation from credential
const selectiveDisclosurePresentation = new SelectiveDisclosurePresentation(
    decodedCredential.decodedJwp()
)

// Conceal specific fields - this is the core of ZKP!
// Only reveal name, degree type, and first course
selectiveDisclosurePresentation.concealInSubject("mainCourses[1]") // Hide second course
selectiveDisclosurePresentation.concealInSubject("degree.name")    // Hide degree name
selectiveDisclosurePresentation.concealInSubject("GPA")           // Hide GPA

// Create presentation with cryptographic proof
const presentationJpt = await issuerDoc.createPresentationJpt(
    selectiveDisclosurePresentation,
    methodId,
    presentationOptions
)
```

The resulting presentation JWT will contain only the revealed information while still being cryptographically verifiable against the issuer's signature.

#### ZKP Benefits in the SSI Model

1. **Enhanced privacy**: Individuals share only what's necessary
2. **Reduced data exposure**: Minimizes risk of data leaks
3. **Compliance with regulations**: Supports data minimization principles (GDPR, etc.)
4. **Trust preservation**: Maintains the issuer's attestation without requiring their involvement
5. **Selective reputation**: Present different aspects of your credentials in different contexts

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
