# Zero-Knowledge Proof System Modeling Reference

This document provides comprehensive system modeling perspectives for the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity and BBS+ signatures. It focuses on enterprise architecture views, system positioning, and formal modeling methodologies to describe the ZKP system within an SSI ecosystem.

## Table of Contents

1. [Enterprise Architecture Views](#1-enterprise-architecture-views)
    - [Layered Architecture View](#11-layered-architecture-view)
    - [SABSA Security Architecture Model](#12-sabsa-security-architecture-model)
    - [ZKP Positioning in Enterprise Architecture](#13-zkp-positioning-in-enterprise-architecture)
    - [Real-world Deployment Architecture](#14-real-world-deployment-architecture)
2. [UML System Modeling](#2-uml-system-modeling)
    - [Class Diagram](#21-class-diagram)
    - [Sequence Diagrams](#22-sequence-diagrams)
    - [Activity Diagram](#23-activity-diagram)
    - [Security Annotations (UMLsec)](#24-security-annotations-umlsec)
3. [SysML Perspectives](#3-sysml-perspectives)
    - [Block Definition Diagram](#31-block-definition-diagram)
    - [Requirements Diagram](#32-requirements-diagram)
    - [Parametric Diagram](#33-parametric-diagram)
4. [AADL Architecture Description](#4-aadl-architecture-description)
    - [Component View](#41-component-view)
    - [Deployment View](#42-deployment-view)
5. [Formal Methods Specifications](#5-formal-methods-specifications)
    - [Z Notation](#51-z-notation)
    - [Process Algebra (CSP)](#52-process-algebra-csp)
6. [Cryptographic Protocol Notation](#6-cryptographic-protocol-notation)
    - [Protocol Flow](#61-protocol-flow)
    - [Security Properties](#62-security-properties)

## 1. Enterprise Architecture Views

### 1.1 Layered Architecture View

The layered architecture view shows how ZKP fits within the enterprise SSI system from a business perspective down to implementation:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                      ENTERPRISE LAYERED ARCHITECTURE                          │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        BUSINESS LAYER                                   │  │
│  │  • Identity Verification Requirements                                   │  │
│  │  • Privacy Compliance (GDPR, CCPA)                                      │  │
│  │  • Trust Framework Policies                                             │  │
│  │  • Customer Experience Goals                                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      APPLICATION LAYER                                  │  │
│  │  • SSI Wallet Applications                                              │  │
│  │  • Verifier Portals                                                     │  │
│  │  • Issuer Management Systems                                            │  │
│  │  • DID Resolver Services                                                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      INTEGRATION LAYER                                  │  │
│  │  • API Gateways                                                         │  │
│  │  • Service Orchestration                                                │  │
│  │  • Message Queues                                                       │  │
│  │  • Event Streaming                                                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         ZKP LAYER                                       │  │
│  │  • Zero-Knowledge Proof Generation                                      │  │
│  │  • Selective Disclosure Logic                                           │  │
│  │  • BBS+ Signature Operations                                            │  │
│  │  • Cryptographic Verification                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      PROTOCOL LAYER                                     │  │
│  │  • IOTA Identity Framework                                              │  │
│  │  • DID Resolution                                                       │  │
│  │  • Verifiable Credentials                                               │  │
│  │  • W3C Standards Implementation                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    INFRASTRUCTURE LAYER                                 │  │
│  │  • IOTA Tangle Network                                                  │  │
│  │  • Cloud Services (AWS, Azure, GCP)                                     │  │
│  │  • Container Orchestration (Kubernetes)                                 │  │
│  │  • Database Systems                                                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 SABSA Security Architecture Model

The SABSA (Sherwood Applied Business Security Architecture) model for ZKP system security:

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                       SABSA SECURITY ARCHITECTURE                                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │   BUSINESS  │  │ ARCHITECT   │  │  DESIGNER   │  │   BUILDER   │  │ TRADESMAN  │  │
│  │ (Contextual)│  │(Conceptual) │  │  (Logical)  │  │ (Physical)  │  │(Component) │  │
│  │             │  │             │  │             │  │             │  │            │  │
│  │ • Identity  │  │ • Trust     │  │ • ZKP       │  │ • IOTA      │  │ • BLS12381 │  │
│  │   Needs     │  │   Models    │  │   Protocols │  │   Tangle    │  │   Curves   │  │
│  │ • Privacy   │  │ • Security  │  │ • BBS+      │  │ • Node.js   │  │ • WASM     │  │
│  │   Laws      │  │   Policies  │  │   Schemes   │  │   Runtime   │  │   Bindings │  │
│  │ • Compliance│  │ • Access    │  │ • Selective │  │ • Database  │  │ • IOTA     │  │
│  │   Rules     │  │   Control   │  │   Disclosure│  │   Systems   │  │   Identity │  │
│  │             │  │             │  │             │  │             │  │   SDK      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │           SECURITY SERVICE MANAGEMENT SYSTEM                                   │  │
│  │                                                                                │  │
│  │  • Security Monitoring & Alerting                                              │  │
│  │  • Key Management & Rotation                                                   │  │
│  │  • Incident Response & Recovery                                                │  │
│  │  • Compliance Auditing & Reporting                                             │  │
│  │  • Risk Assessment & Management                                                │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 ZKP Positioning in Enterprise Architecture

The positioning of ZKP technology within the broader enterprise SSI system:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    ZKP POSITIONING IN SSI ENTERPRISE                          │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Enterprise Level: IDENTITY GOVERNANCE                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Identity Lifecycle Management                                         │  │
│  │ • Trust Framework Administration                                        │  │
│  │ • Privacy Policy Enforcement                                            │  │
│  │ • Regulatory Compliance Management                                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  System Level: SSI ECOSYSTEM                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐       │  │
│  │  │  ISSUER   │    │  HOLDER   │    │ VERIFIER  │    │   DID     │       │  │
│  │  │  SYSTEM   │    │  WALLET   │    │  PORTAL   │    │ REGISTRY  │       │  │
│  │  └───────────┘    └───────────┘    └───────────┘    └───────────┘       │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  Component Level: ZKP INTEGRATION                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │              ┌─────────────────────────────────┐                        │  │
│  │              │         ZKP ENGINE              │                        │  │
│  │              │                                 │                        │  │
│  │  Proof       │  • Selective Disclosure Logic   │      Verification      │  │
│  │  Generation  │  • BBS+ Signature Operations    │      Engine            │  │
│  │  ────────────│  • Zero-Knowledge Protocols     │──────────────────────► │  │
│  │              │  • Privacy Preservation         │                        │  │
│  │              └─────────────────────────────────┘                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  Technical Level: CRYPTOGRAPHIC FOUNDATION                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • IOTA Identity Framework                                               │  │
│  │ • BLS12-381 Elliptic Curve Cryptography                                 │  │
│  │ • Pairing-based Cryptographic Operations                                │  │
│  │ • IOTA Tangle Distributed Ledger                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 Real-world Deployment Architecture

Where ZKP technology sits in actual enterprise deployment scenarios:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                        REAL-WORLD DEPLOYMENT                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  EXTERNAL STAKEHOLDERS                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  Citizens/Users    │   Businesses    │   Government    │   Partners     │  │
│  │  (Holders)         │   (Verifiers)   │   (Issuers)     │   (Validators) │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ENTERPRISE PERIMETER                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        DMZ (Demilitarized Zone)                         │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐              │  │
│  │  │   API Gateway │  │  Load Balancer│  │  Web Application│              │  │
│  │  │   (Rate Limit)│  │  (High Avail.)│  │  Firewall       │              │  │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘              │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  APPLICATION TIER                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │  │
│  │  │   DID         │  │  BBS+ Selective│  │   Credential  │                │  │
│  │  │   Resolution  │  │  Disclosure    │  │   Management  │                │  │
│  │  │   Service     │  │  Engine        │  │   System      │                │  │
│  │  │               │  │               │  │               │                │  │
│  │  │ • DID Docs    │  │ • Proof Gen   │  │ • Issuance    │                │  │
│  │  │ • Key Mgmt    │  │ • Verification│  │ • Revocation  │                │  │
│  │  │ • Schema      │  │ • Holder-side │  │ • Status      │                │  │
│  │  │   Resolution  │  │   Privacy     │  │   Tracking    │                │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  DATA TIER                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │  │
│  │  │   Database    │  │  Cache Layer  │  │  IOTA Tangle  │                │  │
│  │  │   Cluster     │  │  (Redis)      │  │  Network      │                │  │
│  │  │               │  │               │  │               │                │  │
│  │  │ • Metadata    │  │ • Session     │  │ • DID Docs    │                │  │
│  │  │ • Audit Logs  │  │ • Temp Data   │  │ • Public Keys │                │  │
│  │  │ • Analytics   │  │ • Performance │  │ • Revocation  │                │  │
│  │  │               │  │   Optimization│  │   Registry    │                │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  **BBS+ Selective Disclosure sits primarily in APPLICATION TIER**             │
│  **IOTA Identity SDK provides the cryptographic foundation**                   │
│  **Connected to IOTA Tangle for immutable DID anchoring**                     │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Key Technologies:**

-   **TypeScript/WASM** for cross-platform development
-   **IOTA Identity SDK** for DID and verifiable credential operations
-   **BBS+ signatures** for selective disclosure capabilities
-   **IOTA Tangle** for decentralized DID registry

### 1.3 Technology Stack Details

#### Core ZKP Technologies

#### Deployment Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT ARCHITECTURE                     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  CLIENT TIER                            │  │
│  │  Browser (React/Vue + IOTA WASM) + Mobile Apps          │  │
│  └─────────────────┬───────────────────────────────────────┘  │
│                    │ HTTPS/WSS                                │
│  ┌─────────────────▼───────────────────────────────────────┐  │
│  │                APPLICATION TIER                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │   API       │  │   ZKP       │  │   Identity      │  │  │
│  │  │   Gateway   │  │   Service   │  │   Provider      │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └─────────────────┬───────────────────────────────────────┘  │
│                    │ Internal Network                         │
│  ┌─────────────────▼───────────────────────────────────────┐  │
│  │                    DATA TIER                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │  │
│  │  │  MongoDB/   │  │    Redis    │  │   IOTA Tangle   │  │  │
│  │  │ PostgreSQL  │  │   Cache     │  │   (DLT Layer)   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 1.4 ZKP Technology Positioning

#### Within the Technology Stack

The ZKP implementation is strategically positioned across multiple layers:

```
┌─────────────────────────────────────────────────────────────┐
│                ZKP TECHNOLOGY POSITIONING                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: USER INTERFACE                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • ZKP Proof Generation (Client-side)                  │  │
│  │ • Selective Disclosure UI                             │  │
│  │ • Privacy-preserving Authentication                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│  Layer 2: APPLICATION LOGIC                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • ZKP Verification Logic                              │  │
│  │ • Credential Issuance with BBS+                       │  │
│  │ • Privacy Policy Enforcement                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│  Layer 3: CRYPTOGRAPHIC FOUNDATION                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • IOTA Identity Core (BBS+ Signatures)                │  │
│  │ • Zero-Knowledge Proof Primitives                     │  │
│  │ • Cryptographic Key Management                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│  Layer 4: INFRASTRUCTURE                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • IOTA Tangle (Immutable Storage)                     │  │
│  │ • DID Registry and Resolution                         │  │
│  │ • Revocation and Status Management                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Key Positioning Benefits:**

1. **Client-side Privacy**: ZKP generation happens in the browser, ensuring sensitive data never leaves the user's device
2. **Scalable Verification**: Server-side verification is computationally efficient
3. **Flexible Disclosure**: Users can selectively reveal only required attributes
4. **Immutable Audit Trail**: IOTA Tangle provides transparent, tamper-proof records

## 2. UML System Modeling

### 2.1 Class Diagram

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
│ - credSubject     │      │                   │      │ + verifyZKP()     │
│ - proof           │      │                   │      │ + validateIssuer()│
│                   │      │                   │      │                   │
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

### 2.2 Sequence Diagrams

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

### 2.3 Activity Diagram

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
│  │ Verifier Resolves │                  ┌──────────────────┐         │
│  │ Issuer DID        │                  │  Holder Stores  │          │
│  │                   │                  │  Credential     │          │
│  └─────────┬─────────┘                  └─────────┬───────┘          │
│            │                                      │                  │
│            │                                      ▼                  │
│  ┌─────────┴─────────┐                  ┌─────────────────┐          │
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

### 2.4 Security Annotations (UMLsec)

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

## 3. SysML Perspectives

### 3.1 Block Definition Diagram

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

### 3.2 Requirements Diagram (Report only since i don't understand shit or this diagram doesn't even make any sense)

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

### 3.3 Parametric Diagram (Report only since i don't understand shit)

```
┌─────────────────────────────────────────────────────────────┐
│                   ZKP Performance Parameters                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Proof Generation│    │ Proof           │                │
│  │ Time            │    │ Verification    │                │
│  │                 │    │ Time            │                │
│  │ T_gen = f(       │    │ T_ver = g(      │                │
│  │   attributes,   │    │   proof_size,   │                │
│  │   complexity,   │    │   public_keys,  │                │
│  │   device_power) │    │   algorithm)    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  Constraints:                                               │
│  • T_gen ≤ 5 seconds (mobile devices)                      │
│  • T_ver ≤ 500ms (server verification)                     │
│  • Privacy_level ≥ 99.9% (information leakage)            │
│  • Proof_size ≤ 2KB (network efficiency)                  │
└─────────────────────────────────────────────────────────────┘
```

## 4. AADL Architecture Description

### 4.1 Component View

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
│  │                │          │  ZKP Validator  │◄────────────┐   │
│  │  Credential    │          │                 │             │   │
│  │  Issuer        │          │                 │             │   │
│  │                │          └─────────────────┘             │   │
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

### 4.2 Deployment View

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

## 5. Formal Methods Specifications

### 5.1 Z Notation

```
ZKPCredential
  id: CREDENTIAL_ID
  issuer: DID
  subject: DID
  claims: ATTRIBUTE_NAME ↦ ATTRIBUTE_VALUE
  signature: BBS_SIGNATURE

ZKPPresentation
  revealed_claims: ATTRIBUTE_NAME ↦ ATTRIBUTE_VALUE
  proof: ZK_PROOF
  challenge: CHALLENGE

verify_presentation: ZKPPresentation × DID × CHALLENGE → BOOLEAN

∀ p: ZKPPresentation; issuer: DID; c: CHALLENGE •
  verify_presentation(p, issuer, c) = TRUE ⇔
    (p.challenge = c) ∧
    (∃ cred: ZKPCredential •
      cred.issuer = issuer ∧
      verify_proof(p.proof, cred, p.revealed_claims))
```

### 5.2 Process Algebra (CSP)

```
ISSUER = issue_credential → publish_did → ISSUER

HOLDER = receive_credential → store_credential →
         (present_proof → HOLDER | revoke_consent → HOLDER)

VERIFIER = request_proof → verify_proof →
          (grant_access → VERIFIER | deny_access → VERIFIER)

SYSTEM = ISSUER ||| HOLDER ||| VERIFIER
```

## 6. Cryptographic Protocol Notation

### 6.1 Protocol Flow

```
1. Setup:
   Issuer → Gen(1^λ) → (pk_I, sk_I)
   Holder → Gen(1^λ) → (pk_H, sk_H)

2. Credential Issuance:
   Issuer: σ ← Sign(sk_I, (attr₁, attr₂, ..., attrₙ))
   Issuer → Holder: (σ, attr₁, attr₂, ..., attrₙ)

3. Proof Generation:
   Holder: Choose revealed set R ⊆ {1, 2, ..., n}
   Holder: π ← ZKProof(σ, {attrᵢ : i ∈ R}, {attrⱼ : j ∉ R})
   Holder → Verifier: (π, {attrᵢ : i ∈ R})

4. Verification:
   Verifier: b ← Verify(pk_I, π, {attrᵢ : i ∈ R})
   If b = 1: Accept; Else: Reject
```

### 6.2 Security Properties

```
Zero-Knowledge Property:
∀ adversary A, ∃ simulator S such that
  View_A(Real_Experiment) ≈ᶜ View_A(Simulated_Experiment)

Soundness Property:
Pr[Verify(pk, π, claims) = 1 ∧ ¬Valid(pk, π, claims)] ≤ negl(λ)

Unlinkability Property:
∀ proofs π₁, π₂ from same credential:
  Advantage_A(Link(π₁, π₂)) ≤ negl(λ)
```
