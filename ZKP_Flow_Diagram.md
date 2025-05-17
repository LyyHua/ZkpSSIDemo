# IOTA Identity ZKP Flow Diagram

## Basic Selective Disclosure Flow

```
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│    ISSUER   │            │    HOLDER   │            │   VERIFIER  │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
       │  1. Create DID           │                          │
       │     and Keys             │                          │
       │                          │                          │
       │  2. Create and Sign      │                          │
       │     Credential           │                          │
       │                          │                          │
       │  3. Deliver Credential   │                          │
       │─────────────────────────>│                          │
       │                          │                          │
       │                          │  4. Receive Credential   │
       │                          │                          │
       │                          │  5. Decide which         │
       │                          │     attributes to        │
       │                          │     selectively disclose │
       │                          │                          │
       │                          │                    6. Present
       │                          │                       Challenge Nonce
       │                          │<─────────────────────────────────│
       │                          │                          │
       │                          │  7. Create ZKP           │
       │                          │     Presentation         │
       │                          │     with selective       │
       │                          │     disclosure           │
       │                          │                          │
       │                          │  8. Send Presentation    │
       │                          │─────────────────────────>│
       │                          │                          │
       │                          │                          │  9. Verify Proof
       │                          │                          │     & Nonce
       │                          │                          │
       │                          │                          │ 10. Extract only
       │                          │                          │     disclosed
       │                          │                          │     attributes
       │                          │                          │
       │                          │                          │ 11. Make access
       │                          │                          │     decision
       │                          │                          │
```

## Advanced ZKP Flow with BBS+ Signatures

```
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│    ISSUER   │            │    HOLDER   │            │   VERIFIER  │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
       │ 1. Create DID &          │                          │
       │    BBS+ Key Pair         │                          │
       │                          │                          │
       │ 2. Create Health         │                          │
       │    Credential            │                          │
       │                          │                          │
       │ 3. Sign with             │                          │
       │    BBS+ signature        │                          │
       │                          │                          │
       │ 4. Deliver Credential    │                          │
       │─────────────────────────>│                          │
       │                          │                          │
       │                          │ 5. Store in              │
       │                          │    digital wallet        │
       │                          │                          │
       │                          │                          │ 6. Request proof
       │                          │                          │    of vaccination
       │                          │                          │    & blood type
       │                          │<─────────────────────────│
       │                          │                          │
       │                          │ 7. Generate selective    │
       │                          │    disclosure proof      │
       │                          │    (derive from BBS+)    │
       │                          │                          │
       │                          │ 8. Hide other health     │
       │                          │    data (allergies,      │
       │                          │    weight, height, etc.) │
       │                          │                          │
       │                          │ 9. Send ZKP              │
       │                          │    presentation          │
       │                          │─────────────────────────>│
       │                          │                          │
       │                          │                          │ 10. Verify BBS+
       │                          │                          │     proof
       │                          │                          │
       │                          │                          │ 11. Confirm only
       │                          │                          │     requested
       │                          │                          │     attributes
       │                          │                          │     are disclosed
       │                          │                          │
       │                          │                          │ 12. Grant access
       │                          │                          │     based on
       │                          │                          │     vaccination
       │                          │                          │     status
```

## Credential and Presentation Format

### Standard W3C Verifiable Credential

```json
{
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "id": "https://example.com/credentials/123",
    "type": ["VerifiableCredential"],
    "credentialSubject": {
        "id": "did:iota:holder:abc123",
        "given_name": "John",
        "family_name": "Doe",
        "email": "john.doe@example.com",
        "age": 42
    },
    "issuer": "did:iota:issuer:def456",
    "issuanceDate": "2025-05-18T12:34:56Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "created": "2025-05-18T12:34:56Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:iota:issuer:def456#key-1",
        "jws": "eyJhbGciOiJFZERTQSJ9..signature"
    }
}
```

### ZKP Selective Disclosure Presentation

```json
{
    "payloads": [
        null, // family_name hidden
        "Sm9obg==", // given_name: "John" (base64)
        null, // email hidden
        "NDI=" // age: 42 (base64)
    ],
    "issuer": "eyJpc3MiOiJkaWQ6aW90YT...", // Base64 encoded issuer metadata
    "proof": "LJMiN6caEqShMJ5jPNts8O...", // Cryptographic proof
    "presentation": "eyJub25jZSI6InVU..." // Base64 encoded presentation with nonce
}
```
