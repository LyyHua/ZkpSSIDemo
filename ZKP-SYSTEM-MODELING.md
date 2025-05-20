# Zero-Knowledge Proof with IOTA Identity - System Modeling

This document provides system modeling perspectives for the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity for selective disclosure of verifiable credentials. It uses various software engineering modeling methods to represent the ZKP system architecture and interactions.

## Table of Contents

1. [Unified Modeling Language (UML) Representations](#unified-modeling-language-uml-representations)
    - [Class Diagram](#class-diagram)
    - [Sequence Diagram](#sequence-diagram)
    - [Activity Diagram](#activity-diagram)
    - [Security Annotations (UMLsec)](#security-annotations-umlsec)
2. [Systems Modeling Language (SysML) Perspectives](#systems-modeling-language-sysml-perspectives)
    - [Block Definition Diagram](#block-definition-diagram)
    - [Requirement Diagram](#requirement-diagram)
3. [Architecture Description](#architecture-description)
    - [Component View](#component-view)
    - [Deployment View](#deployment-view)
4. [Formal Specification Aspects](#formal-specification-aspects)
5. [Enterprise Architecture Perspective](#enterprise-architecture-perspective)

## Unified Modeling Language (UML) Representations

### Class Diagram

The class diagram represents the key objects in the ZKP system and their relationships:

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

**Class Descriptions:**

-   **Issuer**: Entity that creates and signs verifiable credentials

    -   **Relationships**: Creates VerifiableCredential, interacts with Holder
    -   **Security aspects**: Must protect private keys

-   **Holder**: Entity that receives credentials and creates presentations

    -   **Relationships**: Receives VerifiableCredential, creates Presentation, interacts with Verifier
    -   **Privacy aspects**: Controls selective disclosure

-   **Verifier**: Entity that validates presentations

    -   **Relationships**: Receives Presentation, uses ZKPValidator
    -   **Security aspects**: Generates challenge to prevent replay attacks

-   **VerifiableCredential**: Contains claims about the Holder

    -   **Relationships**: Created by Issuer, stored by Holder
    -   **Security aspects**: Has cryptographic proof of authenticity

-   **Presentation**: Contains selectively disclosed credential information

    -   **Relationships**: Created by Holder, verified by Verifier
    -   **Privacy aspects**: Contains both revealed and concealed attributes

-   **ZKPValidator**: Validates ZKP presentations
    -   **Relationships**: Used by Verifier
    -   **Security aspects**: Verifies cryptographic proofs without seeing hidden data

### Sequence Diagram

The sequence diagram shows the temporal interactions between system components:

```
┌─────────┐          ┌─────────┐          ┌─────────┐
│ Issuer  │          │ Holder  │          │Verifier │
└────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │
     │ 1. Create Identity │                    │
     ├───────────────────►│                    │
     │                    │                    │
     │ 2. Issue Credential│                    │
     ├───────────────────►│                    │
     │                    │                    │
     │                    │                    │
     │                    │  3. Request Proof  │
     │                    │◄───────────────────┤
     │                    │                    │
     │                    │ 4. Create          │
     │                    ├─┐ Selective        │
     │                    │ │ Disclosure       │
     │                    │ │ Presentation     │
     │                    │◄┘                  │
     │                    │                    │
     │                    │ 5. Present ZKP     │
     │                    ├───────────────────►│
     │                    │                    │
     │                    │                    │ 6. Verify
     │                    │                    ├─┐ ZKP without
     │                    │                    │ │ seeing hidden
     │                    │                    │ │ attributes
     │                    │                    │◄┘
     │                    │                    │
     │                    │ 7. Access granted  │
     │                    │◄───────────────────┤
     │                    │                    │
```

**Security and Privacy Annotations:**

-   Between steps 1-2: {secrecy=privateKeys}
-   Between steps 2-3: {integrity=credential}
-   Between steps 4-5: {selective_disclosure=true}
-   At step 6: {zero_knowledge_property=true}

### Activity Diagram

The activity diagram shows the flow of the ZKP process:

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
│  ┌─────────┴─────────┐                  ┌──────────────────┐         │
│  │  Verifier         │                  │ Verifier Requests│         │
│  │  Validates        │◄─────────────────┤ Proof with       │         │
│  │  Presentation     │                  │ Challenge        │         │
│  └─────────┬─────────┘                  └─────────┬────────┘         │
│            │                                      │                  │
│            │                                      ▼                  │
│            │                             ┌─────────────────┐         │
│            │                             │ Holder Selectively        │
│            │                             │ Conceals Fields │         │
│            │                             └────────┬────────┘         │
│            │                                      │                  │
│            │                                      ▼                  │
│            │                             ┌─────────────────┐         │
│            │                             │ Holder Creates  │         │
│            │                             │ ZKP Presentation│         │
│            └────────────────────────────►└────────┬────────┘         │
│                                                   │                  │
│                                                   ▼                  │
│                                          ┌─────────────────┐         │
│                                          │   End           │         │
│                                          └─────────────────┘         │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Security Annotations (UMLsec)

Following the UMLsec extension for secure systems:

```
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│      Issuer       │         │      Holder       │         │     Verifier      │
└─────────┬─────────┘         └─────────┬─────────┘         └─────────┬─────────┘
          │                             │                             │
          │  <<secure_channel>>         │                             │
          ├────────────────────────────►│                             │
          │                             │                             │
          │                             │  <<secure_channel>>         │
          │                             ├────────────────────────────►│
          │                             │                             │
                    ┌───────────────────┴───────────────────┐
                    │           <<critical>>                │
                    │     {secrecy=privateKeys}             │
                    │     {selective_disclosure=true}       │
                    │     {zero_knowledge_property=true}    │
                    └───────────────────────────────────────┘
```

## Systems Modeling Language (SysML) Perspectives

### Block Definition Diagram

The BDD shows the structural composition of the ZKP system:

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ZKP-SSI System                             │
├─────────────────────────────────────────────────────────────────────┤
│ parts:                                                              │
│  issuerSubsystem: IssuerSubsystem                                   │
│  holderSubsystem: HolderSubsystem                                   │
│  verifierSubsystem: VerifierSubsystem                               │
│  distributedLedger: IOTA Tangle                                     │
└─────────────────────────────────────────────────────────────────────┘
           ┌─────────┐         ┌─────────┐         ┌─────────┐
           │         │         │         │         │         │
           ▼         │         ▼         │         ▼         │
┌─────────────────┐  │┌─────────────────┐│┌─────────────────┐│
│IssuerSubsystem  │  ││HolderSubsystem  │││VerifierSubsystem││
├─────────────────┤  │├─────────────────┤│├─────────────────┤│
│parts:           │  ││parts:           │││parts:           ││
│ keyManager      │  ││ credentialStore │││ zkpValidator    ││
│ didPublisher    │  ││ zkpGenerator    │││ challengeGen    ││
│ credentialIssuer│  ││ presentationGen │││ presentationVal ││
└─────────────────┘  │└─────────────────┘│└─────────────────┘│
                     │                   │                   │
                     │  ┌──────────────┐ │                   │
                     └─►│  IOTA Tangle │◄┘                   │
                        │  (DLT)       │◄────────────────────┘
                        └──────────────┘
```

### Requirement Diagram

```
┌───────────────────────────────────────────┐
│<<requirement>>                            │
│           ZKP System Requirements         │
├───────────────────────────────────────────┤
│id="REQ-ZKP-1"                             │
│text="The system shall support selective   │
│     disclosure of credential attributes   │
│     without revealing hidden attributes"  │
└─────────────────┬─────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼───────────┐ ┌─────▼───────────────┐
│<<requirement>>    │ │<<requirement>>      │
│  Privacy          │ │  Verifiability      │
├───────────────────┤ ├─────────────────────┤
│id="REQ-ZKP-1.1"   │ │id="REQ-ZKP-1.2"     │
│text="Hidden       │ │text="Verifier must  │
│  attributes shall │ │  be able to verify  │
│  not be revealed" │ │  credential validity│
│                   │ │  without seeing all │
│                   │ │  attributes"        │
└───────────────────┘ └─────────────────────┘
```

## Architecture Description

### Component View

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────┐          ┌─────────────────┐                 │
│  │                │          │                 │                 │
│  │   Issuer       │          │  Holder         │                 │
│  │   Component    │          │  Component      │                 │
│  │                │          │                 │                 │
│  └───────┬────────┘          └────────┬────────┘                 │
│          │                            │                          │
│          │                            │                          │
│          │                            │                          │
│          ▼                            ▼                          │
│  ┌────────────────┐          ┌─────────────────┐                 │
│  │                │          │                 │                 │
│  │  DID Registry  │◄─────────┤ ZKP Generator   │                 │
│  │  (IOTA Tangle) │          │                 │                 │
│  │                │          │                 │                 │
│  └───────┬────────┘          └────────┬────────┘                 │
│          │                            │                          │
│          │                            │                          │
│          │                            │                          │
│          ▼                            ▼                          │
│  ┌────────────────┐          ┌─────────────────┐                 │
│  │                │          │                 │                 │
│  │  Credential    │          │  ZKP Validator  │◄────────────┐   │
│  │  Issuer        │          │                 │             │   │
│  │                ├─────────►│                 │             │   │
│  └────────────────┘          └─────────────────┘             │   │
│                                                              │   │
│                              ┌─────────────────┐             │   │
│                              │                 │             │   │
│                              │  Verifier       ├─────────────┘   │
│                              │  Component      │                 │
│                              │                 │                 │
│                              └─────────────────┘                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Deployment View

```
┌────────────────────┐        ┌────────────────────┐
│                    │        │                    │
│ Issuer Server      │        │  Holder Device     │
│                    │        │                    │
│ ┌────────────────┐ │        │ ┌────────────────┐ │
│ │                │ │        │ │                │ │
│ │ Key Management │ │        │ │ Credential     │ │
│ │ System         │ │        │ │ Wallet         │ │
│ │                │ │        │ │                │ │
│ └────────────────┘ │        │ └────────────────┘ │
│                    │        │                    │
│ ┌────────────────┐ │        │ ┌────────────────┐ │
│ │                │ │        │ │                │ │
│ │ Credential     │ │        │ │ ZKP Generator  │ │
│ │ Issuer         │ │        │ │                │ │
│ │                │ │        │ │                │ │
│ └────────────────┘ │        │ └────────────────┘ │
└────────────────────┘        └────────────────────┘
         │                              │
         │                              │
         │                              │
         ▼                              ▼
┌────────────────────┐        ┌────────────────────┐
│                    │        │                    │
│ IOTA Tangle        │        │ Verifier Server    │
│ (Distributed       │        │                    │
│  Ledger)           │        │ ┌────────────────┐ │
│                    │        │ │                │ │
│ ┌────────────────┐ │        │ │ Challenge      │ │
│ │                │ │        │ │ Generator      │ │
│ │ DID Registry   │ │        │ │                │ │
│ │                │ │        │ └────────────────┘ │
│ └────────────────┘ │        │                    │
│                    │        │ ┌────────────────┐ │
│                    │        │ │                │ │
│                    │        │ │ ZKP Validator  │ │
│                    │        │ │                │ │
│                    │        │ │                │ │
│                    │        │ └────────────────┘ │
└────────────────────┘        └────────────────────┘
```

## Formal Specification Aspects

Key formal properties that can be verified:

1. **Zero-knowledge property**: Verifier learns nothing about hidden attributes
2. **Soundness**: Invalid credentials cannot be verified
3. **Completeness**: Valid credentials will always verify
4. **Unlinkability**: Multiple presentations from the same credential cannot be linked

## Enterprise Architecture Perspective

From a TOGAF/SABSA perspective, the ZKP system can be understood through:

1. **Contextual Layer (Why)**: Privacy-preserving credentials for regulatory compliance
2. **Conceptual Layer (What)**: ZKP-enabled self-sovereign identity system
3. **Logical Layer (How)**: BBS+ signatures with selective disclosure
4. **Physical Layer (With what)**: IOTA Identity implementation with specific libraries and protocols
5. **Component Layer (Detail)**: Specific code implementations for ZKP operations
6. **Operational Layer (Runtime)**: Processes for credential issuance, storage, and verification
