# Zero-Knowledge Proof System Modeling Reference

This document provides comprehensive system modeling perspectives for the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity and BBS+ signatures. It uses various established software engineering modeling methodologies to describe the system architecture, interactions, and security properties.

## Table of Contents

1. [UML Representations](#1-uml-representations)
    - [Class Diagram](#11-class-diagram)
    - [Sequence Diagram](#12-sequence-diagram)
    - [Security UML Extensions](#13-security-uml-extensions)
    - [Activity Diagram](#14-activity-diagram)
2. [SysML Perspectives](#2-sysml-perspectives)
    - [Block Definition Diagram](#21-block-definition-diagram)
    - [Requirements Diagram](#22-requirements-diagram)
    - [Parametric Diagram](#23-parametric-diagram)
3. [AADL Architecture Description](#3-aadl-architecture-description)
4. [Formal Methods Specifications](#4-formal-methods-specifications)
    - [Z Notation](#41-z-notation)
    - [Process Algebra (CSP)](#42-process-algebra-csp)
5. [Security Architecture Frameworks](#5-security-architecture-frameworks)
    - [SABSA Matrix](#51-sabsa-matrix)
    - [Threat Modeling](#52-threat-modeling)
6. [Cryptographic Protocol Notation](#6-cryptographic-protocol-notation)

## 1. UML Representations

### 1.1 Class Diagram

The following UML class diagram represents the core components and their relationships in the ZKP implementation:

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│     Issuer        │      │      Holder       │      │     Verifier      │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ - didDocument     │      │ - credentials[]   │      │ - challenge       │
│ - privateKeys     │      │ - privateKeys     │      │ - trustedIssuers[]│
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ + createIdentity()│      │ + resolveIssuer() │      │ + genChallenge()  │
│ + signCredential()│◄─────┤ + validateCred()  │◄─────┤ + verifyPresent() │
│ + revokeCredent() │  VC  │ + createPresent() │  VP  │ + checkStatus()   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
         ▲                          ▲                          ▲
         │                          │                          │
         │                          │                          │
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│  VerifCredential  │      │   Presentation    │      │  ZKPValidator     │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ - id              │      │ - revealedAttrs   │      │ - issuerDoc       │
│ - issuer          │      │ - hiddenAttrs     │      │ - challenge       │
│ - type            │      │ - proof           │      │ - timestamp       │
│ - credSubject     │      │ - challenge       │      ├───────────────────┤
│ - proof           │      │ - timestamp       │      │ + verifyZKP()     │
│ - issuanceDate    │      │ - version         │      │ + validateIssuer()│
│ - expirationDate  │      │                   │      │ + checkChallenge()│
└───────────────────┘      └───────────────────┘      └───────────────────┘
         ▲                          ▲                          │
         │                          │                          │
         │                          │                          ▼
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│  BbsSignature     │      │ SelectiveDisclos  │      │ CryptographicProof│
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ - publicKey       │      │ - concealedFields │      │ - proofValue      │
│ - secretKey       │      │ - disclosedFields │      │ - type            │
│ - signature       │      │ - proofOptions    │      │ - verificationMeth│
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ + sign()          │      │ + concealField()  │      │ + verify()        │
│ + verify()        │      │ + createProof()   │      │ + validateFormat()│
└───────────────────┘      └───────────────────┘      └───────────────────┘
```

**Class Descriptions:**

-   **Issuer**: Creates and signs verifiable credentials

    -   Implements BBS+ signatures for Zero-Knowledge capabilities
    -   Manages its DID document and verification methods
    -   Can revoke credentials it has issued

-   **Holder**: Manages credentials and creates presentations

    -   Controls selective disclosure of credential attributes
    -   Stores credentials securely while preserving cryptographic properties
    -   Creates presentations in response to verifier challenges

-   **Verifier**: Validates presentations

    -   Generates unique challenges for anti-replay protection
    -   Maintains list of trusted issuers
    -   Validates presentations cryptographically without requiring issuer participation

-   **VerifiableCredential**: Container for claims about the holder

    -   Includes issuer's cryptographic signature
    -   Contains structured data that can be selectively disclosed

-   **Presentation**: Selectively disclosed credential information

    -   Contains revealed attributes in plaintext
    -   Contains cryptographic proof of concealed attributes
    -   Includes response to verifier's challenge

-   **ZKPValidator**: Specialized validator for ZKP presentations

    -   Validates BBS+ proofs
    -   Verifies integrity of credential while respecting selective disclosure
    -   Confirms challenge response validity

-   **BbsSignature**: Implementation of BBS+ signature scheme

    -   Provides multi-message signing capability
    -   Enables selective disclosure proofs
    -   Key component for zero-knowledge capabilities

-   **SelectiveDisclosure**: Handles selective disclosure operations

    -   Manages field concealment
    -   Creates zero-knowledge proofs for concealed data
    -   Preserves cryptographic properties across disclosed/concealed boundary

-   **CryptographicProof**: Represents cryptographic proofs in the system
    -   Links to verification methods
    -   Contains values needed for verification

### 1.2 Sequence Diagram

The following sequence diagram depicts the complete ZKP interaction flow between the three main actors:

```
┌─────────┐           ┌─────────┐          ┌─────────┐
│ Issuer  │           │ Holder  │          │Verifier │
└────┬────┘           └────┬────┘          └────┬────┘
     │                     │                    │
     │ 1. createDID()      │                    │
     │───────────────┐     │                    │
     │               │     │                    │
     │◄──────────────┘     │                    │
     │                     │                    │
     │ 2. createCredential(subject)             │
     │───────────────┐     │                    │
     │               │     │                    │
     │◄──────────────┘     │                    │
     │                     │                    │
     │ 3. signCredential(BBS+)                  │
     │───────────────┐     │                    │
     │               │     │                    │
     │◄──────────────┘     │                    │
     │                     │                    │
     │ 4. issueCredential(credentialJPT)        │
     │─────────────────────>                    │
     │                     │                    │
     │                     │ 5. validateCredential()
     │                     │──────────┐         │
     │                     │          │         │
     │                     │◄─────────┘         │
     │                     │                    │
     │                     │                    │ 6. requestPresentation(challenge)
     │                     │                    │────────────┐
     │                     │                    │            │
     │                     │                    │◄───────────┘
     │                     │                    │
     │                     │                    │
     │                     │<───────────────────│
     │                     │                    │
     │                     │ 7. selectiveDisclose()
     │                     │──────────┐         │
     │                     │          │         │
     │                     │◄─────────┘         │
     │                     │                    │
     │                     │ 8. createPresentation(challenge)
     │                     │──────────┐         │
     │                     │          │         │
     │                     │◄─────────┘         │
     │                     │                    │
     │                     │ 9. presentCredential(presentationJPT)
     │                     │───────────────────>│
     │                     │                    │
     │                     │                    │ 10. validatePresentation()
     │                     │                    │────────────┐
     │                     │                    │            │
     │                     │                    │◄───────────┘
     │                     │                    │
     │                     │                    │ 11. verifyIssuer()
     │                     │                    │────────────┐
     │                     │                    │            │
     │                     │                    │◄───────────┘
     │                     │                    │
     │                     │                    │ 12. verifyChallenge()
     │                     │                    │────────────┐
     │                     │                    │            │
     │                     │                    │◄───────────┘
     │                     │                    │
     │                     │                    │ 13. processRevealedAttributes()
     │                     │                    │────────────┐
     │                     │                    │            │
     │                     │                    │◄───────────┘
```

### 1.3 Security UML Extensions

Using UMLsec annotations for security properties:

```
┌───────────────┐           ┌──────────────┐           ┌────────────┐
│    Issuer     │           │    Holder    │           │  Verifier  │
└───────┬───────┘           └──────┬───────┘           └──────┬─────┘
        │                          │                          │
        │ <<secure_channel>>       │                          │
        │ {secrecy=privateKeys}    │                          │
        │─────────────────────────>│                          │
        │                          │ <<secure_channel>>       │
        │                          │ {hidden_attrs_protected} │
        │                          │─────────────────────────>│
        │                          │                          │
        │        <<critical>>      │      <<critical>>        │
        │      {high_integrity}    │    {replay_protected}    │
        │<─────────────────────────┼─────────────────────────>│
```

Key security annotations:

-   **{secrecy=privateKeys}**: Indicates that private keys must remain confidential
-   **{hidden_attrs_protected}**: Concealed attributes must remain protected
-   **{high_integrity}**: Credential integrity must be preserved
-   **{replay_protected}**: Presentations must include anti-replay protection

### 1.4 Activity Diagram

This activity diagram shows the flow of the ZKP process:

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────┐         ┌─────────┐         ┌─────────────────┐         │
│  │ Create  │         │ Sign    │         │ Publish Issuer  │         │
│  │ Issuer  ├────────►│ with BLS├────────►│ DID Document    │         │
│  │ Identity│         │ Key     │         │ to Network      │         │
│  └─────────┘         └─────────┘         └─────────────────┘         │
│                                                   │                  │
│                                                   ▼                  │
│                                          ┌─────────────────┐         │
│                                          │ Create and Sign │         │
│                                          │ Credential with │         │
│                                          │ BBS+ Signatures │         │
│                                          └────────┬────────┘         │
│                                                   │                  │
│            ┌─────────────────────────────────────►│                  │
│            │                                      ▼                  │
│            │                             ┌─────────────────┐         │
│            │                             │  Transmit VC    │         │
│            │                             │  to Holder      │         │
│            │                             └────────┬────────┘         │
│            │                                      │                  │
│  ┌─────────┴─────────┐                            ▼                  │
│  │ Verifier Resolves │                  ┌─────────────────┐          │
│  │ Issuer DID        │                  │  Holder Stores  │          │
│  │                   │                  │  Credential     │          │
│  └─────────┬─────────┘                  └─────────┬───────┘          │
│            │                                      │                  │
│            │                                      ▼                  │
│            │                            ┌─────────────────────────┐  │
│            │                            │Holder creates Selective  │  │
│            │                            │Disclosure Presentation   │  │
│            ▼                            └─────────────┬───────────┘  │
│   ┌──────────────────┐                                │              │
│   │Verifier Validates│                                │              │
│   │   Presentation   │◄───────────────────────────────┘              │
│   │                  │                                               │
│   └────────┬─────────┘                                               │
│            │                                                         │
│            ▼                                                         │
│   ┌──────────────────┐                                               │
│   │Process Disclosed │                                               │
│   │   Attributes     │                                               │
│   │                  │                                               │
│   └──────────────────┘                                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## 2. SysML Perspectives

### 2.1 Block Definition Diagram

This SysML Block Definition Diagram shows the system components and their relationships:

```
┌─────────────────────────────────┐
│           <<system>>            │
│      Zero-Knowledge System      │
├─────────────────────────────────┤
│                                 │
│  ┌──────────┐   ┌─────────────┐ │
│  │ <<block>>│   │  <<block>>  │ │
│  │  Issuer  │   │   Holder    │ │
│  └────┬─────┘   └──────┬──────┘ │
│       │                │        │
│       │                │        │
│       ▼                ▼        │
│  ┌─────────┐   ┌─────────────┐  │
│  │<<block>>│   │  <<block>>  │  │
│  │  BBS+   │   │ Presentation│  │
│  │Signature│   │  Generator  │  │
│  └─────────┘   └─────────────┘  │
│                                 │
│       ┌───────────────┐         │
│       │   <<block>>   │         │
│       │   Verifier    │         │
│       └───────┬───────┘         │
│               │                 │
│               ▼                 │
│       ┌───────────────┐         │
│       │   <<block>>   │         │
│       │ ZKP Validator │         │
│       └───────────────┘         │
└─────────────────────────────────┘
```

### 2.2 Requirements Diagram

This SysML Requirements Diagram captures the primary requirements for the ZKP system:

```
┌───────────────────────┐
│    <<requirement>>    │
│    ZKP System         │
│                       │
│ ID: "ZKP-SYS-001"     │
│ Text: "The system     │
│ shall enable selective│
│ disclosure of         │
│ credential attributes.│
└───────────┬───────────┘
            │
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌─────────────┐  ┌─────────────┐
│<<requirement│  │<<requirement│
│  Security   │  │  Privacy    │
│             │  │             │
│ID:"ZKP-SEC" │  │ID:"ZKP-PRV" │
│Text:"Ensure │  │Text:"Allow  │
│credential   │  │selective    │
│integrity"   │  │disclosure"  │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│<<requirement│  │<<requirement│
│Anti-replay  │  │ Zero-       │
│Protection   │  │ Knowledge   │
│             │  │             │
│ID:"ZKP-SEC-2│  │ID:"ZKP-PRV-1│
│Text:"Prevent│  │Text:"Hidden │
│replay       │  │attrs not    │
│attacks"     │  │revealed"    │
└─────────────┘  └─────────────┘
```

### 2.3 Parametric Diagram

This parametric diagram shows the key cryptographic relationships in the ZKP system:

```
┌───────────────────────────────────────────────────┐
│ <<parametric>>                                    │
│ ZKP Security Parameters                           │
│                                                   │
│  ┌───────────┐     ┌────────────┐   ┌──────────┐  │
│  │           │     │            │   │          │  │
│  │ Entropy   ├────►│ Key Length ├──►│ Security │  │
│  │ Source    │     │            │   │ Level    │  │
│  └───────────┘     └────────────┘   └──────────┘  │
│                          │                        │
│                          │                        │
│                          ▼                        │
│  ┌───────────┐     ┌────────────┐   ┌──────────┐  │
│  │           │     │            │   │          │  │
│  │ BBS+      ├────►│ Zero-      ├──►│Disclosure│  │
│  │ Algorithm │     │ Knowledge   │   │Control   │  │
│  └───────────┘     │ Properties  │   │         │  │
│                    └────────────┘   └──────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘
```

## 3. AADL Architecture Description

The following is an AADL-like pseudocode for describing the ZKP system architecture:

```aadl
system ZKP_System
    features
        credential_issuance: in out data port;
        presentation_submission: in out data port;
        verification_result: out data port;
end ZKP_System;

system implementation ZKP_System.impl
    subcomponents
        issuer: process Issuer_Process;
        holder: process Holder_Process;
        verifier: process Verifier_Process;
        crypto_service: process Crypto_Service;

    connections
        conn1: port issuer.credential_out -> holder.credential_in;
        conn2: port holder.presentation_out -> verifier.presentation_in;
        conn3: port verifier.result_out -> ZKP_System.verification_result;
        conn4: port issuer.crypto_request -> crypto_service.request_in;
        conn5: port holder.crypto_request -> crypto_service.request_in;
        conn6: port verifier.crypto_request -> crypto_service.request_in;

    properties
        Security_Properties::Confidentiality => high applies to conn1;
        Security_Properties::Integrity => high applies to conn2;
        Security_Properties::Data_Origin_Authentication => high applies to conn2;
end ZKP_System.impl;

process Issuer_Process
    features
        credential_out: out data port;
        crypto_request: out event data port;
end Issuer_Process;

process Holder_Process
    features
        credential_in: in data port;
        presentation_out: out data port;
        crypto_request: out event data port;
end Holder_Process;

process Verifier_Process
    features
        presentation_in: in data port;
        result_out: out data port;
        crypto_request: out event data port;
end Verifier_Process;

process Crypto_Service
    features
        request_in: in event data port;
        result_out: out event data port;

    flows
        bbs_signature: flow path request_in -> result_out;
        selective_disclosure: flow path request_in -> result_out;
        zkp_verification: flow path request_in -> result_out;

    properties
        Security_Properties::Side_Channel_Protection => true;
end Crypto_Service;
```

## 4. Formal Methods Specifications

### 4.1 Z Notation

The following Z notation describes the key components and operations in the ZKP system:

```
// Type definitions
[ATTRIBUTE, DID, SIGNATURE, PROOF, CHALLENGE]

// Credential Schema
Schema Credential {
  id: DID
  issuer: DID
  subject: P ATTRIBUTE
  proof: SIGNATURE

  // Invariants
  issuer.hasKey(proof.keyId)
  proof.validates(subject)
}

// Presentation Schema
Schema Presentation {
  credential: Credential
  revealed: P ATTRIBUTE
  concealed: P ATTRIBUTE
  challenge: CHALLENGE
  proof: PROOF

  // Invariants
  revealed ∪ concealed = credential.subject
  revealed ∩ concealed = ∅
  proof.validates(revealed, concealed, challenge)
  proof.derivesFrom(credential.proof)
}

// Verification Operation
Operation Verify(p: Presentation, c: CHALLENGE) {
  pre:
    p.challenge = c

  post:
    result = true ⇔
      issuer.resolves() ∧
      p.proof.validates(p.revealed, p.concealed, c) ∧
      p.proof.verifyDerivation(issuer.getKey(p.proof.keyId))
}

// Selective Disclosure Operation
Operation ConcealAttribute(cred: Credential, attr: ATTRIBUTE) {
  pre:
    attr ∈ cred.subject

  post:
    result.credential = cred ∧
    result.concealed = {attr} ∧
    result.revealed = cred.subject \ {attr} ∧
    result.proof.validates(result.revealed, result.concealed, _)
}
```

### 4.2 Process Algebra (CSP)

The following CSP notation models the communication between the three main actors:

```
// Channel definitions
channel issue, store, request_presentation, create_presentation, validate
channel success, failure

// Process definitions
ISSUER = issue.credential -> ISSUER

HOLDER = issue.credential?cred -> store.cred ->
         request_presentation?challenge ->
         create_presentation.(cred, challenge) -> HOLDER

VERIFIER = request_presentation!challenge ->
           create_presentation?presentation ->
           (validate.presentation -> success -> VERIFIER
           □
           validate.presentation -> failure -> VERIFIER)

// System definition
SYSTEM = ISSUER |[issue]| HOLDER |[create_presentation]| VERIFIER
```

## 5. Security Architecture Frameworks

### 5.1 SABSA Matrix

The SABSA matrix for the ZKP system:

| Layer           | What                           | Why                        | How                         | Who              | Where                | When                      |
| --------------- | ------------------------------ | -------------------------- | --------------------------- | ---------------- | -------------------- | ------------------------- |
| **Contextual**  | Secure credential sharing      | Privacy protection         | ZKP protocols               | Identity owners  | Digital interactions | During verification needs |
| **Conceptual**  | Selective data disclosure      | Minimize data exposure     | BBS+ signatures             | SSI participants | SSI ecosystem        | Credential presentation   |
| **Logical**     | ZKP integration                | Cryptographic verification | IOTA Identity framework     | Developers       | Application layer    | Design & implementation   |
| **Physical**    | BBS+ implementation            | Cryptographic assurance    | IOTA Identity WASM          | Implementers     | Distributed ledger   | Runtime                   |
| **Component**   | Selective disclosure functions | Fine-grained control       | concealInSubject()          | Programmers      | Code base            | Development phase         |
| **Operational** | Credential verification        | Trustless operation        | Challenge-response protocol | End users        | Client applications  | User interaction          |

### 5.2 Threat Modeling

STRIDE threat modeling for ZKP system:

| Threat Type            | Threat                                   | Countermeasure                                    |
| ---------------------- | ---------------------------------------- | ------------------------------------------------- |
| Spoofing               | Impersonation of legitimate issuer       | Cryptographic verification of issuer signature    |
| Tampering              | Modification of credential attributes    | BBS+ signatures ensure integrity                  |
| Repudiation            | Denial of presentation creation          | Challenges are signed as part of presentation     |
| Information Disclosure | Revealing hidden attributes              | Zero-knowledge proofs mathematically protect data |
| Denial of Service      | Overload verifier with invalid proofs    | Rate limiting, proof complexity validation        |
| Elevation of Privilege | Accessing data beyond what was disclosed | Strict enforcement of selective disclosure scope  |

## 6. Cryptographic Protocol Notation

The following notation describes the ZKP protocol in cryptographic terms:

```
// Setup
Issuer generates (sk_I, pk_I) where sk_I is secret key, pk_I is public key
Issuer publishes pk_I in DID document

// Credential Issuance
Let m = (m₁, m₂, ..., mₙ) be the attributes of the credential
Issuer computes σ = BBS.Sign(sk_I, m)
Issuer sends (m, σ) to Holder
Holder verifies BBS.Verify(pk_I, m, σ) = true

// Presentation Creation
Verifier sends challenge c to Holder
Holder selects subset D ⊆ {1, 2, ..., n} for disclosure
Let I = {1, 2, ..., n} \ D be indices of hidden attributes
Holder computes π = BBS.ProveSubset(pk_I, m, σ, D, c)
Holder sends (D, {m_i | i ∈ D}, π) to Verifier

// Presentation Verification
Verifier retrieves pk_I from Issuer's DID document
Verifier checks BBS.VerifySubset(pk_I, {m_i | i ∈ D}, D, π, c) = true
```

This comprehensive system modeling document provides multiple technical perspectives on the ZKP implementation in IOTA Identity, using established modeling techniques in software and systems engineering.
