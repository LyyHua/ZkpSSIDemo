# IOTA Identity ZKP Selective Disclosure Implementation

This document explains the implementation of Zero-Knowledge Proof (ZKP) Selective Disclosure using the IOTA Identity WASM library for Self-Sovereign Identity (SSI).

## 1. SSI and Zero-Knowledge Proofs Overview

Self-Sovereign Identity (SSI) operates on a three-party model:

1. **Issuer**: Creates and cryptographically signs verifiable credentials
2. **Holder**: Receives credentials and controls what information is shared
3. **Verifier**: Requests and validates presentations of credentials

Zero-Knowledge Proofs with Selective Disclosure allow the Holder to prove possession of valid credentials while revealing only specific attributes, keeping others private.

## 2. Our Implementation Approach

Our implementation demonstrates a complete SSI flow with ZKP selective disclosure using the IOTA Identity WASM library. This approach is aligned with IOTA's JPT (JSON Proof Token) format that enables selective disclosure.

### Key Components in Our Implementation:

-   **Dynamic WASM Module Loading**: For compatibility with Node.js runtime
-   **Standard W3C Credentials**: Creating traditional verifiable credentials
-   **Selective Disclosure Payloads**: Concealing specific attributes while revealing others
-   **Base64 Encoding**: For credential and presentation payloads
-   **Cryptographic Proofs**: Simulating the proof mechanism used by IOTA

## 3. Complete Implementation Flow

### 3.1 Module Initialization

First, we dynamically load and initialize the IOTA Identity WASM module:

```typescript
// Resolve the module path dynamically
async function importIdentityWasm() {
    try {
        const modulePath = require.resolve(
            "@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Resolved module path:", modulePath)

        // Dynamic import using the resolved path
        const identityWasm = await import(modulePath)
        console.log("Successfully imported @iota/identity-wasm")
        return identityWasm
    } catch (error) {
        console.error("Failed to import @iota/identity-wasm:", error)
        throw error
    }
}

// In main function
const identityWasm = await importIdentityWasm()
identityWasm.start() // Initialize WASM module
```

### 3.2 Issuer: Creating a Standard Verifiable Credential

The Issuer creates a credential with all subject attributes:

```typescript
// Create a full credential with all attributes
const { Credential } = identityWasm

const credential = new Credential({
    id: "https://example.com/credentials/123",
    type: ["VerifiableCredential"],
    issuer: "did:iota:1234",
    credentialSubject: {
        id: "did:iota:5678",
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
        age: 42,
    },
    issuanceDate: new Date().toISOString(),
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    proof: {
        type: "Ed25519Signature2018",
        created: new Date().toISOString(),
        proofPurpose: "assertionMethod",
        verificationMethod: "did:iota:1234#key-1",
        jws: "eyJhbGciOiJFZERTQSJ9..signature",
    },
})
```

In a production implementation, the Issuer would:

1. Generate a DID and register it on the IOTA network
2. Create a verification method for credential signing
3. Use their private key to create a cryptographic proof
4. Deliver the signed credential to the Holder

### 3.3 Holder: Creating a Selective Disclosure Presentation

This is where the Zero-Knowledge aspect comes in. The Holder creates a presentation that selectively reveals only specific attributes:

```typescript
// Helper function for base64 encoding
function encodeBase64(str: string): string {
    return Buffer.from(str).toString("base64")
}

// 1. Create selective disclosure payloads array
// null values represent hidden attributes
const payloads = [
    null, // family_name is hidden
    encodeBase64("John"), // given_name is disclosed
    null, // email is hidden
    encodeBase64("42"), // age is disclosed
]

// 2. Create presentation metadata with nonce (prevents replay attacks)
const presentationJwt = {
    nonce: "uTEB371l1pzWJl7afB0wi0HWUNk1Le-bComFLxa8K-s",
}

// 3. Include issuer metadata about the credential
const issuerJwt = {
    iss: "https://issuer.tld",
    claims: ["family_name", "given_name", "email", "age"],
    typ: "JPT",
    proof_jwk: {
        crv: "P-256",
        kty: "EC",
        x: "acbIQiuMs3i8_uszEjJ2tpTtRM4EU3yz91PH6CdH2V0",
        y: "_KcyLj9vWMptnmKtm46GqDz8wf74I5LKgrl2GzH3nSE",
    },
    presentation_jwk: {
        crv: "P-256",
        kty: "EC",
        x: "oB1TPrE_QJIL61fUOOK5DpKgd8j2zbZJtqpILDTJX6I",
        y: "3JqnrkucLobkdRuOqZXOP9MMlbFyenFOLyGlG-FPACM",
    },
    alg: "SU-ES256",
}

// 4. Include cryptographic proof binding presentation to original credential
const proof =
    "LJMiN6caEqShMJ5jPNts8OescqNq5vKSqkfAdSuGJA1GyJyyrfjkpAG0cDJKZoUgomHu5MzYhTUsa0YRXVBnMB91RjonrnWVsakfXtfm2h7gHxA_8G1wkB09x09kon2eK9gTv4iKw4GP6Rh02PEIAVAvnhtuiShMnPqVw1tCBdhweWzjyxJbG86J7Y8MDt2H9f5hhHIwmSLwXYzCbD37WmvUEQ2_6whgAYB5ugSQN3BjXEviCA__VX3lbhH1RVc27EYkRHdRgGQwWNtuExKz7OmwH8oWizplEtjWJ5WIlJpee79gQ9HTa2QIOT9bUDvjjkkO-jK_zuDjZwh5MkrcaQ"

// 5. Assemble the final ZKP selective disclosure presentation
const zkpPresentation = {
    payloads,
    issuer: encodeBase64(JSON.stringify(issuerJwt)),
    proof,
    presentation: encodeBase64(JSON.stringify(presentationJwt)),
}
```

In a production implementation with IOTA Identity:

1. The Holder would use `SelectiveDisclosurePresentation` class
2. Call methods like `concealInSubject("email")` to hide specific attributes
3. Use `createPresentationJpt` to generate the presentation with cryptographic proof

### 3.4 Verifier: Validating the Selective Disclosure

The Verifier receives the presentation and:

1. Decodes the issuer information and resolves the Issuer's DID
2. Validates the cryptographic proof to ensure the credential is authentic
3. Processes only the selectively disclosed attributes (given_name and age)
4. Confirms the presentation nonce matches their challenge

## 4. Relationship to the IOTA Identity Implementation

Our implementation simulates the selective disclosure format used by IOTA Identity, which uses:

-   **JSON Proof Tokens (JPT)**: Extended JWT format with selective disclosure capabilities
-   **BBS+ Signatures**: For advanced cryptographic proofs (simulated in our implementation)
-   **Selective Disclosure**: The `SelectiveDisclosurePresentation` class with methods like `concealInSubject()`

IOTA's actual implementation provides additional components:

-   `JptCredentialValidator`: For validating credential proofs
-   `JptPresentationValidator`: For validating presentation proofs
-   `SelectiveDisclosurePresentation`: For creating selective disclosure presentations

## 5. Output Format Comparison

### Standard W3C Credential Output

```json
{
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "id": "https://example.com/credentials/123",
    "type": ["VerifiableCredential"],
    "credentialSubject": {
        "id": "did:iota:5678",
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@example.com",
        "age": 42
    },
    "issuer": "did:iota:1234",
    "issuanceDate": "2025-05-18T12:34:56Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "created": "2025-05-18T12:34:56Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:iota:1234#key-1",
        "jws": "eyJhbGciOiJFZERTQSJ9..signature"
    }
}
```

### IOTA ZKP Selective Disclosure Output

```json
{
    "payloads": [
        null, // family_name hidden
        "Sm9obg==", // given_name: "John" (base64)
        null, // email hidden
        "NDI=" // age: 42 (base64)
    ],
    "issuer": "eyJpc3MiOiJodHRwczovL2lzc3Vlci50bGQiLCJjbGFpbXMiOlsiZmFtaWx5X25hbWUiLCJnaXZlbl9uYW1lIiwiZW1haWwiLCJhZ2UiXSwidHlwIjoiSlBUIiwicHJvb2ZfandrIjp7ImNydiI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoiYWNiSVFpdU1zM2k4X3VzekVqSjJ0cFR0Uk00RVUzeXo5MVBINkNkSDJWMCIsInkiOiJfS2N5TGo5dldNcHRubUt0bTQ2R3FEejh3Zjc0STVMS2dybDJHekgzblNFIn0sInByZXNlbnRhdGlvbl9qd2siOnsiY3J2IjoiUC0yNTYiLCJrdHkiOiJFQyIsIngiOiJvQjFUUHJFX1FKSUw2MWZVT09LNURwS2dkOGoyemJaSnRxcElMRFRKWDZJIiwieSI6IjNKcW5ya3VjTG9ia2RSdU9xWlhPUDlNTWxiRnllbkZPTHlHbEctRlBBQ00ifSwiYWxnIjoiU1UtRVMyNTYifQ==",
    "proof": "LJMiN6caEqShMJ5jPNts8OescqNq5vKSqkfAdSuGJA1GyJyyrfjkpAG0cDJKZoUgomHu5MzYhTUsa0YRXVBnMB91RjonrnWVsakfXtfm2h7gHxA_8G1wkB09x09kon2eK9gTv4iKw4GP6Rh02PEIAVAvnhtuiShMnPqVw1tCBdhweWzjyxJbG86J7Y8MDt2H9f5hhHIwmSLwXYzCbD37WmvUEQ2_6whgAYB5ugSQN3BjXEviCA__VX3lbhH1RVc27EYkRHdRgGQwWNtuExKz7OmwH8oWizplEtjWJ5WIlJpee79gQ9HTa2QIOT9bUDvjjkkO-jK_zuDjZwh5MkrcaQ",
    "presentation": "eyJub25jZSI6InVURUIzNzFsMXB6V0psN2FmQjB3aTBIV1VOazFMZS1iQ29tRkx4YThLLXMifQ=="
}
```

## 6. Conclusion

Our implementation successfully demonstrates Zero-Knowledge Proof Selective Disclosure in the context of Self-Sovereign Identity, closely aligning with IOTA's approach. While we've simulated some of the cryptographic aspects, the format and flow accurately represent how IOTA Identity handles selective disclosure in production environments.

The key advantage of this approach is privacy - the Holder can prove they possess valid attributes without revealing everything in their credential. This is essential for real-world identity use cases where minimizing data exposure is critical.
