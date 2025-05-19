# IOTA Identity ZKP Implementation

This project demonstrates real Zero-Knowledge Proof (ZKP) implementation using the IOTA Identity WASM library for Self-Sovereign Identity (SSI), specifically focusing on selective disclosure with BBS+ signatures.

## Overview

Self-Sovereign Identity (SSI) is a model where individuals control their digital identities without relying on a central authority. Zero-Knowledge Proofs with Selective Disclosure enable users to prove possession of credentials while revealing only specific attributes, preserving privacy.

This project provides three implementations:

1. **Real Implementation** (`zkp-implementation.ts`) - Uses the actual IOTA Identity WASM library for ZKP with BBS+ signatures without requiring network connectivity
2. **Advanced Network Implementation** (`zkp-advanced.ts`) - Enhanced implementation with simulated network connectivity and advanced features
3. **Simple Simulation** (`zkp-simple.ts`) - A simplified approach for concept demonstration

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

# Run the real implementation
npm run start:real

# Run the advanced network implementation
npm run start:advanced

# Run the simple simulation
npm run start:simulation
```

## Advanced Network Implementation

The advanced implementation in `zkp-advanced.ts` demonstrates a sophisticated approach with:

```bash
npm run start:advanced
```

**Key Features:**

-   **Network Connectivity Simulation**: Simulates connecting to the Shimmer testnet with retry logic
-   **Multiple Credentials**: Creates and manages three different credential types (University Degree, ID Card, Employment)
-   **Complex Selective Disclosure**: Advanced patterns for hiding specific fields
-   **Secure Transmission Simulation**: Demonstrates how credentials would be transmitted in a real system
-   **Cross-credential Verification**: Verifies information across multiple credentials
-   **Enhanced Security Features**:
    -   Challenge-based anti-replay protection
    -   Network-based issuer resolution
    -   Revocation simulation
    -   Service endpoints
    -   Error handling

This implementation accurately represents how a real-world ZKP solution would function with:

```typescript
// Network configuration
const NETWORK_URL = "https://api.testnet.shimmer.network" // Your target network URL
const IOTA_IDENTITY_PKG_ID = 2 // Identity package ID for your network
```

## Basic Implementation

The standard implementation demonstrates a complete ZKP solution without network connectivity:

```bash
npm run start:real
```

This implementation focuses on the core ZKP operations with a single credential.

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
-   `src/example/zkp-implementation.ts` - Real implementation using IOTA Identity WASM
-   `src/example/zkp-advanced.ts` - Advanced implementation with network features and multiple credentials
-   `src/example/zkp-simple.ts` - Simplified simulation approach
-   `src/util-simple.ts` - Utility functions

## License

This project is licensed under the ISC License.
