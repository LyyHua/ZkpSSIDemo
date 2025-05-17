# IOTA Identity ZKP Demonstration

This project demonstrates Zero-Knowledge Proof (ZKP) selective disclosure using the IOTA Identity WASM library for Self-Sovereign Identity (SSI).

## Overview

Self-Sovereign Identity (SSI) is a model where individuals control their digital identities without relying on a central authority. Zero-Knowledge Proofs with Selective Disclosure enable users to prove possession of credentials while revealing only specific attributes, preserving privacy.

This project implements both:

1. **Basic ZKP Demonstration**: Simple selective disclosure of credential attributes
2. **Advanced ZKP Demonstration**: BBS+ signature-based selective disclosure for more complex credentials

## Features

- **Complete SSI Flow**: Issuer → Holder → Verifier implementation
- **Dynamic WASM Loading**: Compatible with Node.js runtime
- **Selective Disclosure**: Reveal only specific attributes while hiding others
- **Cryptographic Verification**: Simulated proof validation
- **Nonce Protection**: Prevents replay attacks
- **DID Support**: Uses IOTA Decentralized Identifiers

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository 
git clone https://github.com/yourusername/iota-zkp-demo.git
cd iota-zkp-demo

# Install dependencies
npm install
```

### Running the Demos

```bash
# Build the project
npm run build

# Run the basic ZKP demo
npm run start:basic

# Run the advanced ZKP demo with BBS+ signatures
npm run start:advanced

# Run both demos
npm run start:all
```

## Project Structure

```
├── @types/                      # Custom type definitions
│   └── iota-identity-wasm/      # Type definitions for IOTA Identity WASM
├── src/
│   ├── advanced_zkp.ts          # Advanced ZKP demo with BBS+ signatures
│   ├── index.ts                 # Main entry point
│   ├── shared/                  # Shared utilities
│   │   └── iota_identity_client.ts # IOTA Identity client utilities
│   ├── verifier.ts              # Verifier implementation
│   └── zkp.ts                   # Basic ZKP implementation
├── IOTA_ZKP_Selective_Disclosure.md  # Detailed documentation
└── Verification_Process.md      # Verification process documentation
```

## Documentation

### Process Flow

1. **Issuer**: Creates and signs verifiable credentials
   - Generates a DID (Decentralized Identifier)
   - Signs credential with all subject attributes
   - Delivers the credential to the holder

2. **Holder**: Controls disclosure of credential data
   - Receives credential from the issuer
   - Creates selective disclosure presentation
   - Reveals only specific attributes (e.g., age, vaccination status)
   - Sends presentation to verifier with cryptographic proof

3. **Verifier**: Validates the presentation
   - Verifies the cryptographic proof
   - Processes only the disclosed attributes
   - Confirms authenticity without seeing hidden attributes

### ZKP Implementation 

The implementation uses:

- **JSON Proof Tokens (JPT)**: Extended JWT format with selective disclosure capabilities
- **BBS+ Signatures**: For advanced cryptographic proofs (simulated in this implementation)
- **Base64 Encoding**: For credential and presentation payloads

## Advanced Implementation

For detailed information on:

- The full implementation details: See [IOTA_ZKP_Selective_Disclosure.md](./IOTA_ZKP_Selective_Disclosure.md)
- The verification process: See [Verification_Process.md](./Verification_Process.md)

## Dependencies

- `@iota/identity-wasm`: IOTA Identity WASM bindings
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution environment

## License

This project is licensed under the ISC License.
