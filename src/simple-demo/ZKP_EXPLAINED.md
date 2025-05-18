# Zero-Knowledge Proof in IOTA Identity - Explained

## What is a Zero-Knowledge Proof?

A Zero-Knowledge Proof (ZKP) is a cryptographic method where one party (the prover) can prove to another party (the verifier) that they know a specific piece of information, without revealing the information itself.

In our implementation, we're using a specific type of ZKP called **Selective Disclosure**, which allows revealing only certain parts of a credential while keeping other parts hidden.

## How It Works in Our Implementation

### 1. Credentials and Claims

A verifiable credential contains multiple claims (attributes) about a subject. For example:

```json
{
    "id": "did:iota:...",
    "name": "Alice Smith",
    "age": 25,
    "dateOfBirth": "1998-05-15",
    "ssn": "123-45-6789",
    "address": {
        "street": "123 Privacy Lane",
        "city": "Secretville",
        "country": "Cryptonia"
    }
}
```

### 2. Selective Disclosure

With selective disclosure, the holder can choose which attributes to reveal:

```typescript
const disclosureFields = ["id", "name", "age", "dateOfBirth"]

// Create a selective disclosure presentation
const presentation = await SelectiveDisclosurePresentation.createPresentation(
    signedCredential,
    disclosureFields
)
```

In this example, the holder reveals their ID, name, age, and date of birth, but hides their SSN and detailed address information.

### 3. Cryptographic Verification

The selective disclosure presentation is signed by the holder using their private key. When the verifier receives the presentation, they can:

1. Verify the holder's signature on the presentation
2. Verify that the revealed attributes come from a credential signed by the issuer
3. Verify the issuer's signature on the original credential

All of this happens without the verifier seeing the hidden attributes!

## The Technical Flow

1. **Issuer creates and signs a credential**:

    - The credential is cryptographically signed using the issuer's private key
    - The signature covers all attributes in the credential

2. **Holder creates a selective disclosure presentation**:

    - The holder selects which attributes to disclose
    - IOTA Identity uses cryptographic techniques to create a presentation that:
        - Reveals only the selected attributes
        - Preserves the cryptographic link to the original signed credential

3. **Verifier checks the presentation**:
    - Verifies the holder's signature on the presentation
    - Verifies the issuer's signature on the disclosed attributes
    - Confirms the credential wasn't revoked
    - All without seeing the undisclosed attributes!

## Why This is Actually Zero-Knowledge

In our example, the verifier can verify that:

-   The holder possesses a valid credential issued by a trusted issuer
-   The revealed attributes are authentic and unmodified
-   The credential hasn't been revoked

But the verifier learns absolutely nothing about the hidden attributes (like the SSN and detailed address). The verifier doesn't even know what other attributes might exist in the original credential.

This is the essence of Zero-Knowledge: proving something without revealing the underlying information.
