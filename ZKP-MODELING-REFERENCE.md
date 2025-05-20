# ZKP System Modeling in IOTA Identity

This document provides various system modeling perspectives for the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity, based on established software engineering methodologies.

## 1. UML Class Diagram Representation

The following UML class diagram represents the core components and their relationships in the ZKP implementation:

```
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│     Issuer        │      │      Holder       │      │     Verifier      │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ - didDocument     │      │ - credentials[]   │      │ - challenge       │
│ - privateKeys     │      │ - privateKeys     │      │                   │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ + createIdentity()│      │ + resolveIssuer() │      │ + genChallenge()  │
│ + signCredential()│◄─────┤ + validateCred()  │◄─────┤ + verifyPresent() │
│                   │  VC  │ + createPresent() │  VP  │                   │
└───────────────────┘      └───────────────────┘      └───────────────────┘
         ▲                          ▲                          ▲
         │                          │                          │
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│  VerifCredential  │      │   Presentation    │      │  ZKPValidator     │
├───────────────────┤      ├───────────────────┤      ├───────────────────┤
│ - id              │      │ - revealedAttrs   │      │ - issuerDoc       │
│ - issuer          │      │ - hiddenAttrs     │      │ - challenge       │
│ - type            │      │ - proof           │      │                   │
│ - credSubject     │      │ - challenge       │      ├───────────────────┤
│ - proof           │      │                   │      │ + verifyZKP()     │
│                   │      │                   │      │ + validateIssuer()│
└───────────────────┘      └───────────────────┘      └───────────────────┘
```

**UMLsec Security Annotations:**

The following UMLsec security annotations can be applied to the ZKP system:

```
┌───────────────┐           ┌──────────────┐           ┌────────────┐
│    Issuer     │           │    Holder    │           │  Verifier  │
└───────┬───────┘           └──────┬───────┘           └──────┬─────┘
        │                          │                          │
        │ <<secure_channel>>       │                          │
        │ {secrecy=privateKeys}    │                          │
        │─────────────────────────>│                          │
        │                          │ <<secure_channel>>       │
        │                          │ {secret_not_leaked}      │
        │                          │─────────────────────────>│
```

These annotations specify that private keys must remain confidential during transmission, and that hidden attributes should not be leaked during the presentation process.

## 2. SysML Block Definition Diagram

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

## 3. Sequence Diagram for ZKP Interaction

The following sequence diagram depicts the interaction between the three main actors:

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
     │ 2. createCredential()                    │
     │───────────────┐     │                    │
     │               │     │                    │
     │◄──────────────┘     │                    │
     │                     │                    │
     │ 3. signCredential() │                    │
     │───────────────┐     │                    │
     │               │     │                    │
     │◄──────────────┘     │                    │
     │                     │                    │
     │ 4. issueCredential()│                    │
     │────────────────────>│                    │
     │                     │                    │
     │                     │ 5. storeCredential()
     │                     │───────────────┐    │
     │                     │               │    │
     │                     │◄──────────────┘    │
     │                     │                    │
     │                     │                    │
     │                     │ 6. requestProof()  │
     │                     │<───────────────────│
     │                     │                    │
     │                     │ 7. createSelectiveDisclosure()
     │                     │───────────────┐    │
     │                     │               │    │
     │                     │◄──────────────┘    │
     │                     │                    │
     │                     │ 8. createPresentation()
     │                     │───────────────┐    │
     │                     │               │    │
     │                     │◄──────────────┘    │
     │                     │                    │
     │                     │ 9. presentProof()  │
     │                     │───────────────────>│
     │                     │                    │
     │                     │                    │
     │                     │                    │
     │                     │ 10. verifyProof()  │
     │                     │                    │───────────────┐
     │                     │                    │               │
     │                     │                    │◄──────────────┘
     │                     │                    │
     │                     │ 11. accessResult() │
     │                     │<───────────────────│
     │                     │                    │
```

## 4. Component Architecture View

The following diagram shows the component architecture of the ZKP system:

```
        ┌─────────────────┐                 ┌─────────────────┐                 ┌─────────────────┐
        │                 │                 │                 │                 │                 │
        │ ┌─────────────┐ │                 │ ┌─────────────┐ │                 │ ┌─────────────┐ │
        │ │    DID      │ │                 │ │ Credential  │ │                 │ │ Presentation│ │
        │ │  Document   │ │                 │ │  Storage    │ │                 │ │  Validator  │ │
        │ └─────────────┘ │                 │ └─────────────┘ │                 │ └─────────────┘ │
        │       │         │                 │       │         │                 │       │         │
        │       ▼         │                 │       ▼         │                 │       ▼         │
        │ ┌─────────────┐ │                 │ ┌─────────────┐ │                 │ ┌─────────────┐ │
        │ │  Credential │ │                 │ │ Selective   │ │                 │ │  Challenge  │ │
        │ │  Issuer     │ │ Signed VC       │ │ Disclosure  │ │  ZKP Proof      │ │  Verifier   │ │
        │ └─────┬───────┘ │────────────────>│ └──────┬──────┘ │────────────────>│ └──────┬──────┘ │
        │       │         │                 │        │        │                 │        │        │
        │       ▼         │                 │        ▼        │                 │        ▼        │
        │ ┌─────────────┐ │                 │ ┌─────────────┐ │                 │ ┌─────────────┐ │
        │ │  BBS+       │ │                 │ │  BBS+       │ │                 │ │ Signature   │ │
        │ │  Signer     │ │                 │ │  Prover     │ │                 │ │ Verifier    │ │
        │ └─────────────┘ │                 │ └─────────────┘ │                 │ └─────────────┘ │
        │                 │                 │                 │                 │                 │
        │     ISSUER      │                 │     HOLDER      │                 │    VERIFIER     │
        └─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## 5. AADL-like Architecture Description

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
```

## 6. SABSA Security Architecture Matrix

For ZKP in IOTA Identity, the SABSA matrix would include:

| Layer           | What                           | Why                        | How                         | Who              | Where                | When                      |
| --------------- | ------------------------------ | -------------------------- | --------------------------- | ---------------- | -------------------- | ------------------------- |
| **Contextual**  | Secure credential sharing      | Privacy protection         | ZKP protocols               | Identity owners  | Digital interactions | During verification needs |
| **Conceptual**  | Selective data disclosure      | Minimize data exposure     | BBS+ signatures             | SSI participants | SSI ecosystem        | Credential presentation   |
| **Logical**     | ZKP integration                | Cryptographic verification | IOTA Identity framework     | Developers       | Application layer    | Design & implementation   |
| **Physical**    | BBS+ implementation            | Cryptographic assurance    | IOTA Identity WASM          | Implementers     | Distributed ledger   | Runtime                   |
| **Component**   | Selective disclosure functions | Fine-grained control       | concealInSubject()          | Programmers      | Code base            | Development phase         |
| **Operational** | Credential verification        | Trustless operation        | Challenge-response protocol | End users        | Client applications  | User interaction          |

## 7. Formal Specification (Z-notation style)

```
// Credential Schema
Schema Credential {
  id: ID
  issuer: DID
  subject: Subject
  proof: BBS_Signature

  // Invariants
  issuer.hasKey(proof.keyId)
  proof.validates(subject)
}

// Presentation Schema
Schema Presentation {
  credential: Credential
  revealed: Set of Attribute
  concealed: Set of Attribute
  challenge: Nonce
  proof: ZK_Proof

  // Invariants
  revealed ∪ concealed = credential.subject.attributes
  revealed ∩ concealed = ∅
  proof.validates(revealed, concealed, challenge)
  proof.derivesFrom(credential.proof)
}

// Verification Operation
Operation Verify(p: Presentation, c: Challenge) {
  pre:
    p.challenge = c

  post:
    result = true iff
      issuer.resolves() ∧
      p.proof.validates(p.revealed, p.concealed, c) ∧
      p.proof.verifyDerivation(issuer.getKey(p.proof.keyId))
}
```

This system modeling provides multiple perspectives on the ZKP implementation in IOTA Identity, using established modeling techniques in software and systems engineering.
