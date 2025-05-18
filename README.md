# IOTA Identity ZKP Implementation

This project demonstrates real Zero-Knowledge Proof (ZKP) implementation using the IOTA Identity WASM library for Self-Sovereign Identity (SSI), specifically focusing on selective disclosure with BBS+ signatures.

## Overview

Self-Sovereign Identity (SSI) is a model where individuals control their digital identities without relying on a central authority. Zero-Knowledge Proofs with Selective Disclosure enable users to prove possession of credentials while revealing only specific attributes, preserving privacy.

This project provides three implementations:

1. **Real Implementation** - Uses the actual IOTA Identity WASM library for ZKP with BBS+ signatures (requires network connectivity)
2. **Advanced Implementation** - Uses IOTA Identity classes but simulates network interactions
3. **Simple Simulation** - A simplified approach for concept demonstration

## Getting Started

### Prerequisites

-   Node.js 16+
-   npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Examples

```bash
# Build the project
npm run build

# Run the real implementation (requires network connectivity)
npm run start:real

# Run the advanced implementation (uses IOTA Identity classes)
npm run start:advanced

# Run the simple simulation
npm run start:simulation
```

## Implementation Details

### Real ZKP Implementation

The real implementation uses the full IOTA Identity WASM library to:

1. Create a DID for an issuer
2. Generate BLS12-381 keys for BBS+ signatures
3. Issue a verifiable credential with a BBS+ signature as a JPT
4. Selectively disclose parts of the credential
5. Create a presentation with a challenge
6. Verify the presentation

This implementation requires actual network connectivity.

### Advanced ZKP Implementation

The advanced implementation uses actual IOTA Identity classes but simulates network interactions:

1. Uses IotaDocument, Credential, and other classes from the IOTA Identity library
2. Creates a real BLS verification method using ProofAlgorithm.BLS12381_SHA256
3. Demonstrates the selective disclosure flow with SelectiveDisclosurePresentation
4. Works without requiring network connectivity

### Simple Simulation

A very basic implementation for demonstration purposes that shows the concept without using actual IOTA Identity APIs.

## BBS+ Signatures and Zero-Knowledge Proofs

BBS+ signatures are a cryptographic mechanism that allows for selective disclosure. Key features:

-   **Multiple messages**: Can sign multiple attributes at once
-   **Selective disclosure**: Can reveal only specific attributes while keeping others hidden
-   **Unlinkability**: Multiple showings of the same credential cannot be linked
-   **Zero-knowledge**: Proves knowledge of hidden values without revealing them

## Project Structure

-   `src/main.ts` - Entry point for running examples
-   `src/example/zkp-implementation.ts` - Real implementation using IOTA Identity WASM
-   `src/example/zkp-advanced.ts` - Advanced implementation using IOTA Identity classes
-   `src/example/zkp-simple.ts` - Simplified simulation approach
-   `src/util-simple.ts` - Utility functions

## License

This project is licensed under the ISC License.
