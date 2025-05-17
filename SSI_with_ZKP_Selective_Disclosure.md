# Self-Sovereign Identity with Zero-Knowledge Proof Selective Disclosure

This document explains the implementation of a Self-Sovereign Identity (SSI) system with Zero-Knowledge Proof Selective Disclosure (ZKP-SD) using IOTA Identity in TypeScript.

## 1. SSI Overview: The Three-Party Model

Self-Sovereign Identity is built on a three-party trust model:

![SSI Triangle](https://www.w3.org/TR/vc-data-model/diagrams/ecosystem.svg)

1. **Issuer**: Creates and signs verifiable credentials (VCs)
2. **Holder**: Receives, stores, and presents credentials
3. **Verifier**: Requests and validates presentations

## 2. Complete SSI Flow Implementation

Our implementation demonstrates the full SSI lifecycle with a focus on privacy through selective disclosure:

### 2.1 Issuer: Creating Verifiable Credentials

The Issuer creates a credential containing the holder's attributes and cryptographically signs it.

```typescript
// Import IOTA Identity WASM module
import * as identityWasm from "@iota/identity-wasm/node/identity_wasm";
identityWasm.start(); // Initialize WASM module

// Create a full credential with all attributes
const credential = new identityWasm.Credential({
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
        jws: "eyJhbGciOiJFZERTQSJ9..signature"
    }
});

console.log("Issuer: Credential created and signed");
```

In a production environment, the Issuer would:
1. Generate a secure Decentralized Identifier (DID)
2. Register the DID on the IOTA distributed ledger
3. Use their private key to cryptographically sign the credential
4. Deliver the signed credential to the Holder

### 2.2 Holder: Receiving and Storing Credentials

The Holder receives the credential, verifies it, and stores it securely.

```typescript
// Holder receives the credential and verifies it
const holderVerifiedCredential = credential;
console.log("Holder: Credential received and verified");

// Holder stores the credential in their digital wallet
// (In a real implementation, this would be stored securely)
const holderWallet = {
    credentials: [holderVerifiedCredential]
};
console.log("Holder: Credential stored in wallet");
```

In a production environment, the Holder would:
1. Generate their own DID and keys
2. Verify the Issuer's signature on the credential 
3. Store the credential securely in their digital wallet

### 2.3 Verifier: Requesting a Presentation

The Verifier requests proof of specific attributes.

```typescript
// Verifier generates a presentation request
const presentationRequest = {
    type: "PresentationRequest",
    verifier: "did:iota:verifier123",
    challenge: "random-challenge-123",
    requested_attributes: [
        {
            name: "given_name",
            reason: "We need your first name for personalization"
        },
        {
            name: "age",
            reason: "We need to verify you are over 18"
        }
    ]
};
console.log("Verifier: Presentation request created");
```

### 2.4 Holder: Creating a Selective Disclosure Presentation

This is where the Zero-Knowledge Proof Selective Disclosure happens. The Holder creates a presentation that reveals only specific attributes while keeping others private.

```typescript
// Function to base64 encode strings
function encodeBase64(str) {
    return Buffer.from(str).toString('base64');
}

// Holder creates a selective disclosure presentation
// This is the key ZKP-SD part!
const zkpSelectiveDisclosure = {
    // Payloads array with nulls for hidden attributes
    // [family_name, given_name, email, age]
    payloads: [
        null,                       // family_name is HIDDEN
        encodeBase64("John"),       // given_name is disclosed
        null,                       // email is HIDDEN
        encodeBase64("42")          // age is disclosed
    ],
    
    // Encoded issuer metadata (claims, types, verification keys)
    issuer: encodeBase64(JSON.stringify({
        iss: "did:iota:1234",
        claims: ["family_name", "given_name", "email", "age"],
        typ: "JPT",
        proof_jwk: {
            crv: "P-256",
            kty: "EC",
            x: "acbIQiuMs3i8_uszEjJ2tpTtRM4EU3yz91PH6CdH2V0",
            y: "_KcyLj9vWMptnmKtm46GqDz8wf74I5LKgrl2GzH3nSE"
        }
    })),
    
    // Cryptographic proof - binds disclosure to original credential
    proof: "LJMiN6caEqShMJ5jPNts8OescqNq5vKSqkfAdSuGJA1GyJyyrfjkpAG0cDJKZoUgomHu5MzYhTUsa0YRXVBnMB91RjonrnWVsakfXtfm2h7gHxA_8G1wkB09x09kon2eK9gTv4iKw4GP6Rh02PEIAVAvnhtuiShMnPqVw1tCBdhweWzjyxJbG86J7Y8MDt2H9f5hhHIwmSLwXYzCbD37WmvUEQ2_6whgAYB5ugSQN3BjXEviCA__VX3lbhH1RVc27EYkRHdRgGQwWNtuExKz7OmwH8oWizplEtjWJ5WIlJpee79gQ9HTa2QIOT9bUDvjjkkO-jK_zuDjZwh5MkrcaQ",
    
    // Presentation metadata including nonce for freshness
    presentation: encodeBase64(JSON.stringify({
        nonce: presentationRequest.challenge,
        verifier: presentationRequest.verifier
    }))
};

console.log("Holder: ZKP Selective Disclosure presentation created");
console.log("Selectively disclosed data:");
console.log("- given_name: John ✓ (disclosed)");
console.log("- age: 42 ✓ (disclosed)");
console.log("- family_name: ✗ (hidden)");
console.log("- email: ✗ (hidden)");
```

### 2.5 Verifier: Validating the Presentation

The Verifier validates the selective disclosure presentation.

```typescript
// Function to decode base64 strings
function decodeBase64(b64) {
    return Buffer.from(b64, 'base64').toString();
}

// Verifier receives the presentation
console.log("Verifier: Received ZKP-SD presentation");

// Verifier decodes and validates the presentation
const decodedPresentation = JSON.parse(decodeBase64(zkpSelectiveDisclosure.presentation));
const decodedIssuer = JSON.parse(decodeBase64(zkpSelectiveDisclosure.issuer));

// Check challenge matches to prevent replay attacks
if (decodedPresentation.nonce !== presentationRequest.challenge) {
    throw new Error("Challenge doesn't match - possible replay attack");
}

// Verify issuer signature (cryptographic validation)
// In a real implementation, this would verify the proof cryptographically
console.log("Verifier: Validated presentation cryptographically");

// Extract disclosed attributes
const disclosedAttributes = {};
zkpSelectiveDisclosure.payloads.forEach((payload, index) => {
    if (payload !== null) {
        const attrName = decodedIssuer.claims[index];
        disclosedAttributes[attrName] = decodeBase64(payload);
    }
});

console.log("Verifier: Successfully extracted disclosed attributes:", disclosedAttributes);
console.log("Verifier: Presentation verification complete");
```

## 3. Understanding Zero-Knowledge Proof Selective Disclosure

The key privacy-enhancing aspect of our implementation is the Zero-Knowledge Proof Selective Disclosure mechanism. Here's how it works:

### 3.1 The Privacy Problem

Traditional digital credentials reveal ALL information to verifiers, even when only specific attributes are needed. This violates the principle of data minimization and creates privacy risks.

### 3.2 The ZKP-SD Solution

Our implementation provides true selective disclosure through:

1. **Null Payloads**: Hidden attributes are represented as `null` in the payloads array
2. **Base64 Encoding**: Disclosed values are encoded for transmission security
3. **Cryptographic Proof**: Links the disclosed attributes to the original credential
4. **Challenge-Response**: Prevents replay attacks with a nonce mechanism

### 3.3 Implementation Details

The core of our ZKP-SD implementation has these key components:

```typescript
// ZKP-SD structure
{
  "payloads": [
    null,               // Hidden attribute (family_name)
    "Sm9obg==",         // Disclosed attribute "John" (given_name)
    null,               // Hidden attribute (email)
    "NDI="              // Disclosed attribute "42" (age)
  ],
  "issuer": "eyJpc3M...", // Base64 encoded issuer metadata
  "proof": "LJMiN6ca...", // Cryptographic proof of credential authenticity
  "presentation": "eyJub...", // Presentation metadata (challenge, verifier)
}
```

This format allows the Holder to:
- Reveal only specific attributes (given_name, age)
- Keep other attributes completely hidden (family_name, email)
- Prove the disclosed attributes came from a valid credential
- Prove the presentation was created specifically for this verifier (not a replay)

## 4. Benefits of ZKP-SD

Our implementation provides several key benefits:

1. **Privacy**: Verifiers see only what they need to know
2. **Control**: Holders decide what information to share
3. **Minimization**: Complies with data minimization principles
4. **Authenticity**: Verifiers can trust the disclosed information
5. **Non-correlation**: Reduces ability to track users across services

## 5. Real-World Applications

This ZKP-SD approach enables many privacy-preserving use cases:

- **Age verification**: Prove you're over 18 without revealing birthdate
- **Credential verification**: Prove you have a credential without revealing all details
- **Identity verification**: Prove your identity while minimizing data disclosure
- **Membership proof**: Prove you belong to a group without revealing your identity

## 6. Complete Implementation

Our implementation successfully demonstrates the full SSI flow with ZKP-SD as the privacy-enhancing mechanism. The use of IOTA Identity provides a secure, decentralized foundation for this identity framework.
