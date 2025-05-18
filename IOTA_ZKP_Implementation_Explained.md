# Understanding IOTA Identity ZKP Implementation vs. Simulation

This document explains the key differences between the simulated Zero-Knowledge Proof (ZKP) implementation and the actual IOTA Identity ZKP implementation in this project.

## Simulated ZKP vs. Actual ZKP

### Simulated ZKP Approach (Original Implementation)

The original implementation in `src/zkp.ts` **simulates** ZKP behavior:

1. **Manual Payload Creation**: Creates an array of payloads where `null` represents hidden attributes
2. **No Cryptographic Binding**: The "proof" is simulated without actual cryptographic operations
3. **Manual Verification**: The verifier just checks if values are null or not
4. **No Actual ZKP**: While it demonstrates the concept, it doesn't provide true zero-knowledge proofs

```typescript
// Simulated approach - manually creating arrays with null values
const payloads = [
    null, // family_name is hidden
    encodeBase64("John"), // given_name is disclosed
    null, // email is hidden
    encodeBase64("42"), // age is disclosed
]
```

### Actual IOTA Identity ZKP Implementation

The IOTA Identity WASM library provides actual ZKP capabilities through:

1. **BLS12-381 Signatures**: Uses BLS signatures which enable selective disclosure
2. **`SelectiveDisclosurePresentation` Class**: Handles proper ZKP presentations
3. **`concealInSubject()` Method**: Cryptographically conceals attributes
4. **`JptPresentationValidator`**: Validates presentations with cryptographic integrity

```typescript
// Actual IOTA Identity approach
const selectiveDisclosure = new SelectiveDisclosurePresentation({
    holder: holderDid,
    verifier: verifierDid,
})

// Cryptographically conceals attributes
selectiveDisclosure.concealInSubject("family_name")
selectiveDisclosure.concealInSubject("email")

// Creates a cryptographically secured presentation
const presentationJpt = selectiveDisclosure.createPresentationJpt({
    challenge,
    domain: verifierDid,
})
```

## Key Technical Differences

| Feature              | Simulated ZKP                | Actual IOTA Identity ZKP                                      |
| -------------------- | ---------------------------- | ------------------------------------------------------------- |
| **Hiding Mechanism** | Simple null values in arrays | Cryptographic concealment                                     |
| **Proof Type**       | Arbitrary string             | BLS12-381 signature scheme                                    |
| **Integrity**        | No cryptographic integrity   | Math-based cryptographic integrity                            |
| **Security**         | Illustrative only            | Cryptographically secure                                      |
| **Classes Used**     | Custom arrays and objects    | `SelectiveDisclosurePresentation`, `JptPresentationValidator` |
| **Verification**     | Manual attribute checking    | Cryptographic proof validation                                |

## How IOTA Identity ZKP Actually Works

1. **Credential Creation**: The issuer creates a credential with a BLS12-381 signature
2. **Selective Disclosure**: The holder uses `concealInSubject()` to hide specific attributes
3. **Presentation Creation**: The `createPresentationJpt()` method creates a JWT with selective disclosure
4. **Cryptographic Verification**: The verifier can validate the JWT without seeing hidden attributes

## IOTA Identity ZKP Technical Foundation

IOTA Identity implements ZKP-enabled selective disclosure using:

1. **BBS+ Signatures**: Based on BLS12-381 pairing-friendly curves
2. **JSON Presentation Tokens (JPT)**: Format for ZKP-enabled presentations
3. **Bilinear Pairings**: Mathematical structure enabling attribute-level selective disclosure
4. **Zero-Knowledge Property**: Proves possession of attributes without revealing them

## Benefits of Using Actual IOTA Identity ZKP

1. **Cryptographic Security**: True mathematical proof rather than simulated behavior
2. **Standard Compliance**: Follows W3C Verifiable Credentials standards
3. **Integrity Guarantees**: Prevents tampering with both revealed and concealed data
4. **Interoperability**: Works with other systems supporting BBS+ signatures
5. **Efficiency**: Optimized implementation using WASM for performance

## Implementation Files

-   **Simulated ZKP**: `src/zkp.ts`
-   **Actual IOTA ZKP**: `src/actual_iota_zkp.ts`
-   **Age Verification Example**: `src/examples/iota_age_verification.ts`

## Additional Resources

-   [IOTA Identity GitHub Repository](https://github.com/iotaledger/identity.rs)
-   [IOTA Identity Documentation](https://wiki.iota.org/identity.rs/welcome)
-   [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
-   [BBS+ Signatures Draft Specification](https://mattrglobal.github.io/bbs-signature-spec/)
