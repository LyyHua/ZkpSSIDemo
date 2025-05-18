# IOTA Identity ZKP Demo

This is a simple demonstration of Zero-Knowledge Proofs (ZKP) using the IOTA Identity WASM library. The demo focuses on selective disclosure, which is a form of ZKP that allows a holder to reveal only specific attributes from a credential while keeping others private.

## Overview

The demo showcases a complete workflow:

1. **Identity Creation**: Creating DIDs for both an issuer and a holder
2. **Credential Issuance**: The issuer creates and signs a verifiable credential for the holder
3. **Selective Disclosure**: The holder creates a presentation that reveals only specific attributes
4. **Verification**: A verifier checks the presentation's authenticity without seeing all credential data

## Implementation Details

The implementation uses the actual IOTA Identity SDK's `SelectiveDisclosurePresentation` class to demonstrate how to selectively reveal information, which is a practical application of Zero-Knowledge Proofs.

### Key Components

-   **IotaDocument**: Represents a DID document stored on the IOTA ledger
-   **Credential**: A verifiable credential containing claims about a subject
-   **SelectiveDisclosurePresentation**: Enables revealing only specific attributes from a credential
-   **Storage**: Manages cryptographic keys for signing operations

## Running the Demo

```bash
# Build and run the demo
npm run zkp:demo
```

## Understanding the Code

The main file `src/simple-demo/iota_zkp_example.ts` is heavily commented to explain each step of the process:

-   The `createIdentity` function demonstrates how to create a new DID with verification methods
-   The `main` function walks through the complete ZKP workflow from issuing credentials to verification
-   We specifically highlight how selective disclosure works by choosing which credential fields to reveal

## Key ZKP Concepts Demonstrated

1. **Selective Disclosure**: Revealing only specific attributes while keeping others private
2. **Cryptographic Verification**: Ensuring the integrity of the disclosed information
3. **Holder Control**: The holder decides which information to share with verifiers

## Why This Matters

Zero-Knowledge Proofs enable privacy-preserving verification, allowing:

-   **Minimal Disclosure**: Share only what's necessary
-   **Data Protection**: Keep sensitive information private
-   **Verifiable Trust**: Maintain cryptographic verification without full data exposure

This implementation shows how these concepts work in practice using the IOTA Identity framework.
