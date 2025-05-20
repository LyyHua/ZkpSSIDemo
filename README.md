# IOTA Identity ZKP Implementation

This project demonstrates real Zero-Knowledge Proof (ZKP) implementation using the IOTA Identity WASM library for Self-Sovereign Identity (SSI), specifically focusing on selective disclosure with BBS+ signatures.

## Overview

Self-Sovereign Identity (SSI) is a model where individuals control their digital identities without relying on a central authority. Zero-Knowledge Proofs with Selective Disclosure enable users to prove possession of credentials while revealing only specific attributes, preserving privacy.

This project provides three implementations:

1. **Real Implementation** (`zkp.ts`) - Uses the actual IOTA Identity WASM library for ZKP with BBS+ signatures with network connectivity
2. **Offline Implementation** (`zkp-local.ts`) - A complete implementation that works without network connectivity
3. **Simple Simulation** (`zkp-simple.ts`) - A simplified approach for concept demonstration

## Documentation

The project includes comprehensive documentation:

-   **[ZKP-FLOW.md](ZKP-FLOW.md)** - Detailed explanation of the ZKP flow and where it fits in the SSI ecosystem
-   **[ZKP-SYSTEM-MODELING.md](ZKP-SYSTEM-MODELING.md)** - System modeling perspectives using UML, SysML, and architectural descriptions

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

# Run the real implementation (requires network)
npm run start

# Run the offline implementation
npm run start:local

# Run the simple simulation
npm run start:simulation
```

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

## Simple Simulation

A very basic implementation for demonstration purposes that shows the concept without using actual IOTA Identity APIs:

```bash
npm run start:simulation
```

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
