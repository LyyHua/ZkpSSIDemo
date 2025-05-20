# IOTA Identity ZKP Implementation

This project demonstrates Zero-Knowledge Proof (ZKP) implementation using the IOTA Identity WASM library for Self-Sovereign Identity (SSI), specifically focusing on selective disclosure with BBS+ signatures.

## Getting Started

### Prerequisites

-   Node.js 16+
-   npm or yarn

### Important: IOTA Network Setup

**For the network-based implementation (`zkp.ts`), you need an IOTA Identity Package ID.**

You have two options:

1. **Use the Local/Offline Implementation**: Simply run `npm run start:local` which requires no network setup
2. **Set up a Local IOTA Network**:
    - Follow the [IOTA Identity Local Network Setup Guide](https://wiki.iota.org/identity.rs/getting-started/installation)
    - Get your Package ID from the setup
    - Update `src/util.ts` with your Package ID in the `IOTA_IDENTITY_PKG_ID` constant

### Installation

```bash
# Install dependencies
npm install

# Build the TypeScript code
npx tsc
```

### Running the Examples

For quick testing without network setup:

```bash
# Run the offline implementation (no network required)
npm run start:local
```

If you've set up the IOTA network and updated the Package ID:

```bash
# Run the standard implementation
npm run start
```

## Project Overview

Self-Sovereign Identity (SSI) allows individuals to control their digital identities without relying on central authorities. Zero-Knowledge Proofs with Selective Disclosure enable users to prove possession of credentials while revealing only specific attributes.

This project provides two implementations:

1. **Standard Implementation** (`zkp.ts`) - Uses the IOTA Identity WASM library with network connectivity
2. **Offline Implementation** (`zkp-local.ts`) - Works without network connectivity, ideal for learning

## Documentation

-   **[ZKP-FLOW.md](ZKP-FLOW.md)** - Detailed explanation of the ZKP flow in the SSI ecosystem
-   **[IMPLEMENTATION-GUIDE.md](IMPLEMENTATION-GUIDE.md)** - Technical architecture details
-   **[ZKP-SYSTEM-MODELING.md](ZKP-SYSTEM-MODELING.md)** - System modeling diagrams
-   **[ZKP-MODELING-REFERENCE-COMPLETE.md](ZKP-MODELING-REFERENCE-COMPLETE.md)** - Comprehensive model reference

## Key Features

-   **BBS+ Signatures**: Multi-message signing and selective disclosure
-   **Zero-Knowledge Proofs**: Reveal only selected attributes
-   **Selective Disclosure**: Fine-grained control over which credential attributes to disclose
-   **Challenge-Response Protocol**: Anti-replay protection with verifier challenges

## Project Structure

-   `src/main.ts` - Entry point for running examples
-   `src/zkp.ts` - Network-connected implementation using IOTA Identity WASM
-   `src/zkp-local.ts` - Offline implementation of ZKP features
-   `src/util.ts` - Utility functions for network operations

## License

This project is licensed under the ISC License.

## Network Implementation

The network implementation in `zkp.ts` demonstrates a sophisticated approach with:

```bash
npm run start
```

**Key Features:**

-   **Network Connectivity**: Connects to the IOTA network to publish and resolve DIDs
-   **BBS+ Signatures**: Uses BBS+ signatures for ZKP capabilities
-   **Complex Selective Disclosure**: Advanced patterns for hiding specific fields
-   **Challenge-Response**: Challenge-based anti-replay protection
-   **DID Resolution**: Network-based issuer resolution

## Offline Implementation

The offline implementation provides a complete ZKP solution without requiring network connectivity:

```bash
npm run start:local
```

This implementation focuses on the core ZKP operations with a single credential, making it perfect for learning and testing purposes.

## BBS+ Signatures and Zero-Knowledge Proofs

BBS+ signatures are a cryptographic mechanism that allows for selective disclosure. Key features:

-   **Multiple messages**: Can sign multiple attributes at once
-   **Selective disclosure**: Can reveal only specific attributes while keeping others hidden
-   **Unlinkability**: Multiple showings of the same credential cannot be linked
-   **Zero-knowledge**: Proves knowledge of hidden values without revealing them

## Project Structure

-   `src/main.ts` - Entry point for running examples
-   `src/zkp.ts` - Network-connected implementation using IOTA Identity WASM
-   `src/zkp-local.ts` - Offline implementation of ZKP features
-   `src/zkp-simple.ts` - Simplified simulation approach
-   `src/util.ts` - Utility functions for network operations
-   `src/util-simple.ts` - Utility functions for offline operations
-   `ZKP-FLOW.md` - Detailed documentation of the ZKP process
-   `ZKP-SYSTEM-MODELING.md` - System modeling of ZKP architecture

## License

This project is licensed under the ISC License.
