# Self-Sovereign Identity and ZKP Glossary

A comprehensive guide to the terminology used in Self-Sovereign Identity (SSI) and Zero-Knowledge Proofs (ZKP).

## Core SSI Concepts

### DID (Decentralized Identifier)

A globally unique identifier that doesn't require a centralized registration authority. DIDs are typically recorded on distributed ledgers like IOTA Tangle.

**Example**: `did:iota:abc123def456`

### Verifiable Credential (VC)

A cryptographically secure, tamper-evident digital credential containing claims about a subject, issued by an authoritative entity.

### Verifiable Presentation (VP)

A tamper-evident presentation of one or more verifiable credentials, optimized for sharing with specific parties.

### Holder

The entity that possesses verifiable credentials and creates presentations. Typically the subject of the credentials (e.g., a person).

### Issuer

The entity that creates and signs verifiable credentials (e.g., a government, university, or employer).

### Verifier

The entity that receives and verifies presentations of credentials (e.g., a service provider).

### Trust Registry

A system that lists trusted issuers and credential types, enabling verifiers to determine which credentials to accept.

## Zero-Knowledge Proof Concepts

### Zero-Knowledge Proof (ZKP)

A cryptographic method where one party can prove to another that a statement is true without revealing any information beyond the validity of the statement itself.

### Selective Disclosure

The ability to reveal specific attributes from a credential while keeping others hidden.

### BBS+ Signatures

A cryptographic signature scheme that supports selective disclosure and zero-knowledge proofs, ideal for privacy-preserving verifiable credentials.

### Nonce

A random number used once in a cryptographic communication to prevent replay attacks in ZKP systems.

### Challenge-Response Protocol

A security protocol where the verifier sends a challenge (like a nonce) that the holder must incorporate into their proof response to demonstrate freshness.

## IOTA-Specific Terminology

### IOTA Tangle

A distributed ledger technology used to record DIDs and other identity-related data in a secure, immutable manner.

### JSON Proof Token (JPT)

IOTA's extension of the JWT format that supports selective disclosure for privacy-preserving credential presentations.

### IOTA Identity WASM

WebAssembly bindings for the IOTA Identity framework that enable browser and Node.js applications to work with DIDs and verifiable credentials.

### Selective Disclosure Presentation

In IOTA Identity, a specialized presentation format that enables selective disclosure of credential attributes.

## Technical Implementation Terms

### JWT (JSON Web Token)

A compact, URL-safe means of representing claims to be transferred between two parties, commonly used in authentication systems.

### JWS (JSON Web Signature)

A method for representing signed content using JSON data structures, used in the proof section of verifiable credentials.

### Base64 Encoding

A binary-to-text encoding scheme used to represent binary data in an ASCII string format, commonly used in JWT and credential payloads.

### Cryptographic Proof

Mathematical evidence that demonstrates the authenticity and integrity of a credential or presentation.

### Signature Scheme

A cryptographic method used to validate the authenticity and integrity of a message, such as Ed25519 or BBS+.

## Regulatory & Conceptual Terms

### Data Minimization

The principle of collecting and sharing only the minimum amount of personal data necessary for a specific purpose.

### Privacy by Design

A framework that incorporates privacy into the design and operation of systems, rather than adding it later.

### Self-Sovereign Identity (SSI)

A model where individuals or organizations have ownership of their digital identities and control how their personal data is shared and used.

### W3C Standards

World Wide Web Consortium standards that define the formats and protocols for verifiable credentials and decentralized identifiers.

## Implementation Components

### Credential Schema

A document that defines the structure and data types of a verifiable credential.

### Proof Options

Parameters used when creating or verifying cryptographic proofs in verifiable credentials or presentations.

### Resolver

A system that takes a DID as input and returns a DID Document containing associated public keys and service endpoints.

### Verification Method

Information required to verify a proof, such as a public key or verification key material, specified in a DID Document.
