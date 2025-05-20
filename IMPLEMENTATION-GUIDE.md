# IOTA Identity Zero-Knowledge Proof Technical Architecture

This document explains the technical architecture of each implementation approach. For setup and running instructions, refer to the README.md.

## Implementation Types

1. **Network-Connected Implementation** (`zkp.ts`)

    - Requires IOTA network connection and Package ID
    - Creates actual DIDs on the IOTA Tangle

2. **Local/Offline Implementation** (`zkp-local.ts`)
    - No network required
    - Simulates the entire ZKP process locally

## Technical Architecture Details

### Network-Connected Implementation

**Key Components**:

-   `IotaClient` - Connects to the IOTA network
-   `IdentityClientReadOnly` - Resolves DIDs from the network
-   `getFundedClient` - Provides a funded client for creating identities

**Main Features**:

-   Creates real DID documents on the IOTA Tangle
-   Uses actual DID resolution
-   Full implementation of BBS+ signatures for ZKP

### Local/Offline Implementation

**Key Components**:

-   `Storage` with `JwkMemStore` and `KeyIdMemStore` - Local storage for keys
-   Simulated network identifier - Uses "smr" as a placeholder

**Main Features**:

-   Uses in-memory storage only
-   Simulates DID creation and resolution
-   Ideal for learning and testing without network setup

## Technical Details of BBS+ Signatures

BBS+ signatures enable Zero-Knowledge Proofs with these properties:

-   **Multi-message signing** - Signs each credential attribute individually
-   **Selective disclosure** - Reveals only specific attributes
-   **Zero-knowledge proof** - Proves knowledge without revealing values
-   **Unlinkability** - Prevents correlation between presentations

The mathematical foundation relies on:

-   BLS12-381 Elliptic Curve
-   Bilinear pairings
-   Commitment schemes

## Troubleshooting Network Implementation

If you encounter issues with network implementations:

1. Make sure you have the correct Package ID in `src/util.ts`
2. Check your internet connection
3. Verify the IOTA node is accessible

For persistent issues, use the offline implementation (`npm run start:local`) which doesn't require network connectivity.

## Setting Up a Local IOTA Network

If you want to use the network implementations but don't have access to a deployed network:

1. Follow the [IOTA Identity Local Network Setup Guide](https://wiki.iota.org/identity.rs/getting-started/installation)
2. Get your Package ID during the setup process
3. Update `src/util.ts` with your Package ID in the `IOTA_IDENTITY_PKG_ID` constant

This provides a controlled environment for testing without requiring tokens or external network connectivity.

-   Configurable logging levels
-   Combined functionality from all implementations

## Implementation Differences

| Feature             | Network-Connected | Local/Offline       | Unified      |
| ------------------- | ----------------- | ------------------- | ------------ |
| Network Requirement | Yes               | No                  | Yes          |
| DID Creation        | On Tangle         | In-memory           | On Tangle    |
| DID Resolution      | From network      | Simulated           | From network |
| Logging Level       | Basic             | Basic               | Configurable |
| Use Case            | Production        | Development/Testing | Both         |

## Technical Details

### BBS+ Signatures

All implementations use BBS+ signatures for ZKP capabilities:

-   Multi-message signing - Signs each credential attribute individually
-   Selective disclosure - Reveals only specific attributes
-   Zero-knowledge proof - Proves knowledge without revealing values
-   Unlinkability - Prevents correlation between presentations

### Key Components in the ZKP Flow

1. **Issuer**: Creates and signs verifiable credentials

    - Generates BLS12381 key pairs for BBS+ signatures
    - Signs credentials with all attributes

2. **Holder**: Receives credentials and creates presentations

    - Validates received credentials
    - Selectively conceals attributes
    - Creates presentations with hidden attributes

3. **Verifier**: Validates presentations
    - Validates issuer's signature
    - Verifies credential hasn't been tampered with
    - Confirms the challenge was properly incorporated
    - Processes only the revealed attributes

### Cryptographic Mechanisms

-   **BLS12-381 Elliptic Curve**: Provides the mathematical foundation for BBS+ signatures
-   **BBS+ Signatures**: Enables multi-message signing and selective disclosure
-   **Challenge-Response**: Prevents replay attacks by requiring a fresh challenge
-   **Concealment**: Mathematical transformation that hides values while preserving verifiability

## Troubleshooting

### Network-Connected Implementation Issues

If you encounter issues with the network-connected implementation:

1. Check your internet connection
2. Verify the IOTA node is accessible
3. Try using the local implementation instead

### Common Errors

-   **Connection errors**: Occur when IOTA network is unreachable
-   **Funding errors**: Happen when the client can't be funded
-   **Resolution errors**: DID resolution fails due to network issues

For persistent issues, try the offline implementation which doesn't require network connectivity.

## Further Reading

-   [ZKP-FLOW.md](./ZKP-FLOW.md) - Detailed explanation of ZKP flow
-   [ZKP-SYSTEM-MODELING.md](./ZKP-SYSTEM-MODELING.md) - System modeling diagrams
-   [ZKP-MODELING-REFERENCE-COMPLETE.md](./ZKP-MODELING-REFERENCE-COMPLETE.md) - Comprehensive model reference
