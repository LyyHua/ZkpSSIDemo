# Privacy Preserving Identity Systems and Zero-Knowledge Proofs

This document provides a comprehensive overview of privacy-preserving identity systems, explains why Self-Sovereign Identity (SSI) is the optimal foundation for Zero-Knowledge Proof implementations, and demonstrates how these technologies integrate within enterprise architectures to deliver secure, private, and scalable identity solutions.

## Table of Contents

1. [Privacy Preserving Identity Systems (PPIDS)](#1-privacy-preserving-identity-systems-ppids)
    - [Evolution of Digital Identity](#evolution-of-digital-identity)
    - [Comparison of Identity Models](#comparison-of-identity-models)
    - [Why Traditional Systems Fail at Privacy](#why-traditional-systems-fail-at-privacy)
2. [Self-Sovereign Identity: The Foundation for ZKP](#2-self-sovereign-identity-the-foundation-for-zkp)
    - [SSI Principles and Architecture](#ssi-principles-and-architecture)
    - [Why Only SSI Enables True ZKP](#why-only-ssi-enables-true-zkp)
    - [The Cryptographic Foundation](#the-cryptographic-foundation)
3. [Enterprise Architecture for Privacy-Preserving Systems](#3-enterprise-architecture-for-privacy-preserving-systems)
    - [Layered Architecture View](#layered-architecture-view)
    - [Security Architecture Framework](#security-architecture-framework)
    - [ZKP Positioning in Enterprise Systems](#zkp-positioning-in-enterprise-systems)
    - [Real-world Deployment Patterns](#real-world-deployment-patterns)
4. [From Theory to Implementation](#4-from-theory-to-implementation)
    - [Technical Implementation Flow](#technical-implementation-flow)
    - [Integration Points](#integration-points)

---

## 1. Privacy Preserving Identity Systems (PPIDS)

### Evolution of Digital Identity

Digital identity management has undergone significant evolution, driven by increasing privacy concerns, regulatory requirements, and technological advances. Understanding this evolution is crucial for appreciating why Zero-Knowledge Proofs represent a fundamental breakthrough in privacy-preserving identity verification.

The journey from centralized identity systems to privacy-preserving architectures reflects broader shifts in how we conceptualize data ownership, user privacy, and trust relationships in digital systems.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVOLUTION OF DIGITAL IDENTITY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CENTRALIZED ERA (1990s-2000s)                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Single authority controls all identity data                          │ │
│  │ • Users have no control over their information                         │ │
│  │ • High risk of data breaches and misuse                                │ │
│  │ • Privacy is an afterthought                                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  FEDERATED ERA (2000s-2010s)                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Identity providers manage credentials for multiple services          │ │
│  │ • Reduced password fatigue but increased tracking                      │ │
│  │ • Privacy concerns with IdP surveillance                               │ │
│  │ • Still centralized trust models                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  SELF-SOVEREIGN ERA (2010s-Present)                                         │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Users control their own identity data                                │ │
│  │ • Decentralized trust through cryptography                             │ │
│  │ • Privacy by design with selective disclosure                          │ │
│  │ • Zero-Knowledge Proofs enable true privacy                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Comparison of Identity Models

Digital identity management has evolved from centralized systems through federated models to today's self-sovereign approach. Each model differs in how identity data is stored, who controls it, and how privacy is handled. The following table summarizes the key differences between centralized, federated, and self-sovereign identity systems:

| **Aspect**          | **Centralized Identity**                                                                                                                                                                                | **Federated Identity**                                                                                                                                                                                                                                                                                                | **Self-Sovereign Identity (SSI)**                                                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Control of Data** | Little user control: a central authority (e.g., a government agency or a company) maintains and controls the identity data. Users must trust this single entity.                                        | Shared control: identity providers (IdPs) like Google or Facebook manage user credentials, but users can access multiple services via the IdP. The IdP mediates trust between user and service providers.                                                                                                             | User-centric control: the user fully controls their identity data in personal wallets. No single authority can alter or revoke identity without user consent.                                                                                                                                                                                                 |
| **Data Storage**    | Stored in a centralized database or directory. Identity information is kept in one silo, creating a single point of failure.                                                                            | Stored by the identity provider and sometimes relayed to various service providers. Data may be replicated across multiple services (e.g., each service gets some of the user's data from the IdP).                                                                                                                   | Stored by the user (typically locally) as portable credentials. Public decentralized ledgers store only identifiers or public keys, not personal data.                                                                                                                                                                                                        |
| **Privacy**         | Low privacy: users often must disclose a lot of personal data to the central entity and each service. The central database can see and log all usage. Data can be repurposed beyond the user's control. | Moderate privacy: reduces repeated credential entries, but the IdP sees when and where a user logs in. Users often consent to broad data sharing with the IdP. Tracking across services by the IdP is possible. Personal data may still be shared widely with each service during login (e.g., your profile details). | High privacy: minimal disclosure by design. Users share only specific attributes as needed (e.g., proof of age, not full birthdate). Exchanges are often cryptographically blinded, so even the verifying parties learn only what is strictly necessary. No central log of all transactions exists.                                                           |
| **Security & Risk** | Central point of attack: a breach of the central repository can leak millions of identities. Users are vulnerable if the central authority is compromised or negligent.                                 | Federated risk: if the federated IdP is breached, it can expose access to many linked accounts. Also, if user credentials at IdP are stolen, multiple services are at risk. However, federated systems can reduce password reuse (improving security in that sense).                                                  | Decentralized security: no single point of failure. Compromise of one credential or one issuer does not expose all user data. Breaches are confined since data is not aggregated in one place. The use of encryption and ZKPs further protects against data leakage.                                                                                          |
| **Dependency**      | Fully dependent on the central provider. If that provider goes offline or shuts down, the identity may become unusable elsewhere. Users have no alternative way to prove identity.                      | High dependency on the identity provider. If the IdP service is down (or an account is blocked), the user might be locked out of multiple services. Users also must trust the IdP's policies.                                                                                                                         | No single dependency on a provider. Multiple issuers can provide credentials (e.g., government for ID, bank for financial attestations, university for diploma). Even if one issuer is unreachable, other credentials remain valid. Verification can often happen offline by checking digital signatures, without needing a live database query to an issuer. |
| **Examples**        | Company employee directories; a social network requiring its own account to access its services; government ID databases used strictly within government systems.                                       | Federated login systems like Facebook Connect or Google Sign-In (one login gives access to third-party sites); Corporate single sign-on in enterprises (e.g., using SAML or OAuth with an IdP like Okta).                                                                                                             | Decentralized identity frameworks like Sovrin/Hyperledger Indy network for credentials, Ethereum + DID solutions (e.g., uPort/Polygon ID), or Microsoft ION (DID network on Bitcoin). These allow credentials portable across domains.                                                                                                                        |

**Table 1: Comparison of Centralized, Federated, and Self-Sovereign Identity Models**

In SSI, the individual holds the "source of truth" of their identity (in the form of verifiable credentials) rather than relying on a provider to vouch for them each time. This model addresses many pain points of earlier systems. For instance, centralized identity can lead to "honeypot" data breaches, and federated identity, while more user-friendly, raises privacy issues with identity providers tracking user logins and sharing data beyond the user's control. By contrast, SSI's decentralized approach can eliminate central points of failure and minimize data trails, enhancing both security and privacy.

### Why Traditional Systems Fail at Privacy

One practical difference is seen in the authentication process. In a federated login (say, "Sign in with Google"), Google authenticates the user and then shares an assertion of the user's identity to the third-party application – but Google learns where the user is logging in and can potentially share or monetize that knowledge. In an SSI scenario, the user could instead present a verifiable credential (issued, for example, by a trusted KYC provider or government) directly to the application. Google (or any intermediary) is not involved, so no extra party learns of this transaction. The application can locally verify the credential's signature (optionally checking a decentralized registry for issuer public keys or credential revocation status), and the user's privacy is preserved.

This "trust triangle" of issuer-holder-verifier in SSI effectively replaces the one-to-many hub of federated IdP systems with a distributed model where trust is anchored in cryptography and often blockchain rather than in a single organization.

The fundamental privacy failures of traditional systems stem from their architectural assumptions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRIVACY FAILURES IN TRADITIONAL SYSTEMS                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CENTRALIZED SYSTEMS                                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          PRIVACY PROBLEMS                              │ │
│  │                                                                        │ │
│  │ • All-or-Nothing Disclosure: Users must share complete profiles        │ │
│  │ • Data Aggregation: Central systems build comprehensive user profiles  │ │
│  │ • Surveillance by Design: Every transaction is logged and monitored    │ │
│  │ • Vendor Lock-in: Users cannot move their identity to other systems    │ │
│  │ • Honeypot Effect: Centralized databases become attractive targets     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  FEDERATED SYSTEMS                                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          PRIVACY PROBLEMS                              │ │
│  │                                                                        │ │
│  │ • IdP Surveillance: Identity providers track all user activities       │ │
│  │ • Data Brokering: IdPs monetize user data through tracking             │ │
│  │ • Consent Fatigue: Users approve broad data sharing without review     │ │
│  │ • Correlation Attacks: IdPs can correlate user behavior across sites   │ │
│  │ • Single Point of Surveillance: One entity sees all user interactions  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Self-Sovereign Identity: The Foundation for ZKP

### SSI Principles and Architecture

Self-Sovereign Identity represents a paradigm shift that enables privacy-preserving identity systems by design. SSI is built on ten foundational principles that directly enable Zero-Knowledge Proof implementations:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SSI PRINCIPLES ENABLING ZKP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CORE PRIVACY PRINCIPLES                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. EXISTENCE: Users must have independent existence                    │ │
│  │ 2. CONTROL: Users must control their identities                        │ │
│  │ 3. ACCESS: Users must have access to their own data                    │ │
│  │ 4. TRANSPARENCY: Systems must be transparent to users                  │ │
│  │ 5. PERSISTENCE: Identities must be long-lived                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  ZKP-ENABLING PRINCIPLES                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 6. PORTABILITY: Identity must be portable across systems               │ │
│  │ 7. INTEROPERABILITY: Identities must work across platforms             │ │
│  │ 8. CONSENT: Users must agree to use of their identity                  │ │
│  │ 9. MINIMIZATION: Disclosure must be minimized                          │ │
│  │ 10. PROTECTION: User rights must be protected                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ➤ PRINCIPLES 8 & 9 DIRECTLY ENABLE ZERO-KNOWLEDGE PROOFS                  │
│  ➤ MINIMIZATION REQUIRES SELECTIVE DISCLOSURE CAPABILITIES                 │
│  ➤ CONSENT REQUIRES GRANULAR CONTROL OVER DATA REVELATION                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

The SSI architecture creates the necessary technical foundation for ZKP implementation through its decentralized trust model:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                    SSI TRUST ARCHITECTURE FOR ZKP                             │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐ │
│  │     ISSUER      │         │     HOLDER      │         │    VERIFIER      │ │
│  │                 │         │                 │         │                  │ │
│  │ • Creates VCs   │   VC    │ • Stores VCs    │   ZKP   │ • Verifies ZKPs  │ │
│  │ • Signs with    │──────►  │ • Controls      │──────►  │ • Validates      │ │
│  │   BBS+ sigs     │         │   disclosure    │         │   signatures     │ │
│  │ • Publishes DID │         │ • Generates     │         │ • Checks issuer  │ │
│  │   Document      │         │   ZK proofs     │         │   trustworthiness│ │
│  └─────────────────┘         └─────────────────┘         └──────────────────┘ │
│           │                           │                           │           │
│           │                           │                           │           │
│           └───────────────────────────┼───────────────────────────┘           │
│                                       │                                       │
│                    CRYPTOGRAPHIC TRUST ANCHORING                              │
│                                       │                                       │
│                       ┌───────────────▼───────────────┐                       │
│                       │      IOTA TANGLE NETWORK      │                       │
│                       │                               │                       │
│                       │ • Immutable DID storage       │                       │
│                       │ • Public key distribution     │                       │
│                       │ • Revocation registry         │                       │
│                       │ • No personal data stored     │                       │
│                       └───────────────────────────────┘                       │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Why Only SSI Enables True ZKP

Zero-Knowledge Proofs in identity systems require specific architectural prerequisites that only Self-Sovereign Identity can provide:

**1. Holder-Controlled Data Storage**

-   Traditional systems store identity data in central databases controlled by authorities
-   SSI stores credentials in user-controlled wallets, enabling client-side proof generation
-   Only the holder can decide what information to reveal or conceal

**2. Cryptographic Credential Format**

-   Traditional systems use database records or signed documents that don't support selective disclosure
-   SSI uses cryptographically structured verifiable credentials designed for ZKP operations
-   BBS+ signatures enable mathematical proof generation without revealing hidden attributes

**3. Decentralized Verification**

-   Traditional systems require real-time queries to central authorities for verification
-   SSI enables offline verification through cryptographic signature validation
-   Verifiers can validate proofs without contacting the issuer or revealing the verification event

**4. Trust Through Cryptography, Not Institutions**

-   Traditional systems require trust in central authorities or identity providers
-   SSI anchors trust in mathematical proofs and distributed ledger verification
-   Zero-knowledge properties are guaranteed by cryptographic protocols, not policy promises

### The Cryptographic Foundation

IOTA Identity enables Zero-Knowledge Proofs through BBS+ signatures:

**Key Properties:**

-   **Multi-message signing**: Can sign multiple attributes independently
-   **Selective disclosure**: Reveal only selected attributes
-   **Zero-knowledge**: Prove knowledge without revealing hidden data
-   **Unlinkability**: Presentations cannot be correlated

## 3. Enterprise Architecture for Privacy-Preserving Systems

### Layered Architecture View

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

### SABSA Security Architecture Model

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

### ZKP Positioning in Enterprise Architecture

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

### Real-world Deployment Patterns

In actual enterprise deployment scenarios, ZKP-enabled SSI systems must integrate with existing infrastructure while maintaining strict privacy guarantees:

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
│  │  │   DID         │  │ BBS+ Selective│  │   Credential  │                │  │
│  │  │   Resolution  │  │ Disclosure    │  │   Management  │                │  │
│  │  │   Service     │  │ Engine        │  │   System      │                │  │
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
│  **IOTA Identity SDK provides the cryptographic foundation**                  │
│  **Connected to IOTA Tangle for immutable DID anchoring**                     │
└───────────────────────────────────────────────────────────────────────────────┘

```

**Key Technologies:**

-   **TypeScript/WASM** for cross-platform development
-   **IOTA Identity SDK** for DID and verifiable credential operations
-   **BBS+ signatures** for selective disclosure capabilities
-   **IOTA Tangle** for decentralized DID registry

## 4. From Theory to Implementation

### Technical Implementation Flow

The complete ZKP implementation flow demonstrates how privacy theory translates into technical reality using IOTA Identity:

```
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│      ISSUER     │        │      HOLDER     │       │     VERIFIER    │
└────────┬────────┘        └────────┬────────┘       └────────┬────────┘
         │                          │                          │
         │ 1. Creates               │                          │
         │ credential with BBS+     │                          │
         │ signature (ZKP-ready)    │                          │
         │                          │                          │
         │ 2. Issues credential     │                          │
         │────────────────────────> │                          │
         │                          │                          │
         │                          │ 3. Stores credential     │
         │                          │                          │
         │                          │ <─────────────────────── │
         │                          │ 4. Requests proof with   │
         │                          │    challenge             │
         │                          │                          │
         │                          │ 5. Creates ZKP with      │
         │                          │    selective disclosure  │
         │                          │    (THIS IS WHERE ZKP    │
         │                          │     HAPPENS!)            │
         │                          │                          │
         │                          │ 6. Sends presentation    │
         │                          │    with ZKP              │
         │                          │ ────────────────────────>│
         │                          │                          │
         │                          │                          │ 7. Verifies ZKP
         │                          │                          │    proof without
         │                          │                          │    seeing hidden
         │                          │                          │    attributes
         │                          │                          │
```

This flow demonstrates how:

**Privacy Theory → Technical Implementation**

-   **Data Minimization** → Client-side credential storage + Selective disclosure protocols + Zero-knowledge proof generation
-   **User Control** → Private key management + Consent management interfaces + Granular attribute disclosure controls
-   **Cryptographic Trust** → BBS+ signature schemes + IOTA Identity framework + Pairing-based cryptographic operations
-   **Decentralized Verification** → IOTA Tangle integration + DID resolution protocols + Offline verification capabilities

### Integration Points

ZKP systems integrate through standardized protocols and well-defined integration points:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATION ARCHITECTURE                              │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CLIENT-SIDE INTEGRATION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • WASM module loading for cryptographic operations                      │  │
│  │ • Secure key storage (browser/mobile secure enclave)                    │  │
│  │ • User interface for consent and disclosure control                     │  │
│  │ • Local credential storage and management                               │  │
│  │ • Cross-platform compatibility                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  NETWORK PROTOCOL INTEGRATION                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • DIDComm protocol for secure messaging                                 │  │
│  │ • HTTPS/WSS for transport security                                      │  │
│  │ • W3C verifiable credential data model                                  │  │
│  │ • Challenge-response protocol implementation                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  SERVER-SIDE INTEGRATION                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • IOTA Identity SDK integration                                         │  │
│  │ • BBS+ signature verification                                           │  │
│  │ • DID resolution and caching                                            │  │
│  │ • Revocation registry management                                        │  │
│  │ • API gateway privacy controls                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  INFRASTRUCTURE INTEGRATION                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • IOTA Tangle node configuration                                        │  │
│  │ • HSM integration for enterprise key management                         │  │
│  │ • Container orchestration with security policies                        │  │
│  │ • Privacy-preserving monitoring and alerting                            │  │
│  │ • Backup and disaster recovery planning                                 │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Zero-Knowledge Proof Implementation with IOTA Identity

This document explains the Zero-Knowledge Proof (ZKP) implementation using IOTA Identity for selective disclosure of verifiable credentials. It covers the entire flow from identity creation to credential verification, with code examples from our implementation.

## Overview of the SSI Ecosystem

Self-Sovereign Identity (SSI) is a model for digital identity management that gives individuals control over their identity information without relying on centralized authorities. The SSI ecosystem consists of three primary actors:

1. **Issuer**: Creates and signs verifiable credentials (e.g., universities, governments, employers)
2. **Holder**: Receives credentials from issuers and creates presentations for verifiers
3. **Verifier**: Validates presentations from holders to verify claims

### The W3C Trust Triangle

The W3C Trust Triangle represents the trust relationships between these three entities:

```
┌───────────────────┐
│      ISSUER       │
│                   │
│ - Creates and     │
│   signs VCs       │
│ - Publishes DID   │
│   Document        │
└─────────┬─────────┘
          │
     1. Issues
   Credential with
      signature
          │
          ▼
┌───────────────────┐         ┌───────────────────┐
│      HOLDER       │         │     VERIFIER      │
│                   │    2.   │                   │
│ - Stores VCs      │ Present │ - Validates       │
│ - Controls        │Selective│  presentations    │
│   disclosure      │  Data   │ - Checks issuer   │
│ - Creates         │ ──────> │   signatures      │
│   presentations   │         │ - Trusts issuer   │
└───────────────────┘         └─────────┬─────────┘
          ▲                             │
          │                             │
          └─────────────────────────────┘
                3. Trust Relationship
                   (Optional direct)
```

The trust triangle demonstrates how:

1. **Issuer → Holder**: The issuer creates a credential containing claims about the holder and cryptographically signs it.
2. **Holder → Verifier**: The holder presents selective information from their credentials to the verifier.
3. **Verifier → Issuer**: The verifier trusts the issuer's attestations by validating their signature.

### Decentralized Identifiers (DIDs)

Decentralized Identifiers (DIDs) are a fundamental component of SSI. They are:

-   **Globally unique identifiers** that don't require a centralized registry
-   **Persistent** and don't change over time
-   **Resolvable** to DID documents containing verification methods
-   **Cryptographically verifiable** and controlled by the DID subject

A DID looks like this:

```
did:iota:0x123456789abcdef...
  ^    ^         ^
  |    |         |
Method Method-   Method-specific identifier
       specific  (unique ID string)
       identifier
       (blockchain/ledger)
```

In the IOTA Identity framework, DIDs are stored on the IOTA Tangle (distributed ledger), making them immutable and tamper-proof.

### DID Documents

A DID Document is a JSON-LD document that contains information associated with a DID, including:

-   **Verification Methods**: Public keys used for authentication and authorization
-   **Services**: Endpoints where the DID subject can be contacted or interacted with
-   **Authentication Methods**: References to verification methods for authentication
-   **Assertion Methods**: References to verification methods for making assertions

Example DID Document structure:

```json
{
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:iota:0x123456789abcdef...",
    "verificationMethod": [
        {
            "id": "did:iota:0x123456789abcdef...#key-1",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:iota:0x123456789abcdef...",
            "publicKeyMultibase": "z28Kp7P9...DQk"
        },
        {
            "id": "did:iota:0x123456789abcdef...#key-2",
            "type": "BLS12381G2Key2020",
            "controller": "did:iota:0x123456789abcdef...",
            "publicKeyMultibase": "zUC7LTaPw...JWN"
        }
    ],
    "authentication": ["did:iota:0x123456789abcdef...#key-1"],
    "assertionMethod": ["did:iota:0x123456789abcdef...#key-2"],
    "service": [
        {
            "id": "did:iota:0x123456789abcdef...#linked-domain",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://example.com"
        }
    ]
}
```

### Public/Private Key Relationships

In the SSI model, cryptographic key pairs are essential:

1. **Private Keys**:

    - Stored securely by the entity (never shared)
    - Used to sign credentials, presentations, and DID operations
    - Controlled solely by the DID subject
    - Can be rotated and revoked if compromised

2. **Public Keys**:
    - Published in the DID Document
    - Used by others to verify signatures
    - Different types for different purposes (authentication, assertion, etc.)
    - Can be associated with different verification methods

Key types in our implementation:

-   **Ed25519**: Fast, secure signing for general operations
-   **BLS12381**: Enables advanced cryptographic operations needed for ZKPs and selective disclosure

The relationship looks like:

```
┌───────────────┐              ┌───────────────┐
│  Private Key  │              │  Public Key   │
│ (stored       │  derives     │ (published in │
│  securely)    │─────────────>│  DID Document)│
└───────────────┘              └───────────────┘
        │                              │
        │                              │
        ▼                              ▼
┌───────────────┐              ┌───────────────┐
│   Signing     │              │  Verification │
│  Operations   │              │  Operations   │
└───────────────┘              └───────────────┘
```

### Where ZKP Fits in the SSI Model

Zero-Knowledge Proofs (ZKPs) are a cryptographic method that enables a party to prove they know a value without revealing the value itself. In the Self-Sovereign Identity ecosystem, ZKPs enable **selective disclosure** - a critical privacy feature that allows holders to reveal only specific parts of their credentials while keeping other parts confidential.

#### The Problem ZKPs Solve in SSI

Traditional digital signatures have an "all-or-nothing" property - either you show the entire signed document or you can't verify the signature at all. This creates a privacy issue in SSI, where credentials often contain more information than necessary for a specific verification scenario.

For example, a university degree credential might include:

-   Full name
-   Date of birth
-   Degree type
-   Graduation date
-   GPA
-   Student ID
-   Courses completed

For many verification scenarios, only a subset of this information is needed (e.g., just proving you have a degree without revealing your GPA).

#### How BBS+ Signatures Enable ZKPs

The IOTA Identity framework uses BBS+ signatures, which have these key properties:

1. **Multi-message signing**: Can sign multiple attributes independently within a single credential
2. **Selective disclosure**: Can create proofs that reveal only selected attributes
3. **Zero-knowledge**: Can prove knowledge about hidden attributes without revealing them
4. **Unlinkability**: Presentations derived from the same credential are unlinkable

The mathematical properties of BBS+ signatures rely on pairing-friendly elliptic curves (specifically BLS12-381) and involve:

-   Commitment schemes
-   Bilinear pairings
-   Mathematical transformations that preserve verification properties

#### ZKP Integration Points in the SSI Flow

1. **During Credential Issuance**:

    - The issuer must use the BLS12381_SHA256 algorithm for creating verification methods
    - Credentials are structured as a set of discrete claims that can be individually revealed or concealed
    - Each attribute in the credential is encoded separately in the signing process
    - The signature binds all attributes together cryptographically

2. **During Credential Storage**:

    - The holder stores the complete credential with all attributes
    - The holder also stores the cryptographic material needed to create selective disclosures later
    - No special processing is needed at this stage

3. **Between Holder and Verifier**:

    - When the holder receives a presentation request from a verifier, they can:
        - Decide which claims to reveal and which to conceal using the `concealInSubject()` method
        - Create a selective disclosure presentation that contains:
            - Revealed attributes in plaintext
            - Hidden attributes as "null" values
            - Cryptographic proof that hidden attributes were part of the original signed credential
        - Include a response to the verifier's challenge to prevent replay attacks

4. **During Verification**:
    - The verifier can cryptographically verify that:
        - All claims (both revealed and concealed) were part of the original credential
        - The issuer's signature is valid over the entire credential
        - The holder has not tampered with any information
        - The challenge was correctly incorporated in the proof
        - All this without seeing the concealed claims!

#### ZKP Capabilities in IOTA Identity

The IOTA Identity framework's implementation of ZKP provides several advanced features:

1. **Fine-grained selective disclosure**:

    - Select specific fields in a credential (e.g., `"name"`)
    - Select nested properties (e.g., `"degree.type"`)
    - Select specific array elements (e.g., `"mainCourses[0]"`)

2. **Predicate proofs** (planned feature):

    - Prove statements about attributes without revealing them
    - Examples: "Age is over 21", "GPA is above 3.0", "Salary is within range X-Y"

3. **Cross-credential proofs** (planned feature):
    - Create proofs that span multiple credentials
    - Example: Prove you have a degree AND a driver's license without revealing all details

This diagram illustrates where ZKP fits in the SSI flow:

```
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│      ISSUER     │        │      HOLDER     │       │     VERIFIER    │
└────────┬────────┘        └────────┬────────┘       └────────┬────────┘
         │                          │                          │
         │ 1. Creates               │                          │
         │ credential with BBS+     │                          │
         │ signature (ZKP-ready)    │                          │
         │                          │                          │
         │ 2. Issues credential     │                          │
         │────────────────────────> │                          │
         │                          │                          │
         │                          │ 3. Stores credential     │
         │                          │                          │
         │                          │ <─────────────────────── │
         │                          │ 4. Requests proof with   │
         │                          │    challenge             │
         │                          │                          │
         │                          │ 5. Creates ZKP with      │
         │                          │    selective disclosure  │
         │                          │    (THIS IS WHERE ZKP    │
         │                          │     HAPPENS!)            │
         │                          │                          │
         │                          │ 6. Sends presentation    │
         │                          │    with ZKP              │
         │                          │ ────────────────────────>│
         │                          │                          │
         │                          │                          │ 7. Verifies ZKP
         │                          │                          │    proof without
         │                          │                          │    seeing hidden
         │                          │                          │    attributes
         │                          │                          │
```

## Step 1: Creating Issuer Identity

The issuer creates an identity with a verification method capable of BBS+ signatures, which enable selective disclosure.

```typescript
// Create client to connect to IOTA network
const iotaClient = new IotaClient({ url: NETWORK_URL })
const network = await iotaClient.getChainIdentifier()

// Create storage for issuer's keys
const issuerStorage = getMemstorage()

// Get funded client
const issuerClient = await getFundedClient(issuerStorage)

// Create unpublished issuer document
const unpublishedIssuerDocument = new IotaDocument(network)

// Generate verification method with BLS for BBS+ signatures
const issuerFragment = await unpublishedIssuerDocument.generateMethodJwp(
    issuerStorage,
    ProofAlgorithm.BLS12381_SHA256,
    undefined,
    MethodScope.VerificationMethod()
)

// Publish issuer identity to the network
const { output: issuerIdentity } = await issuerClient
    .createIdentity(unpublishedIssuerDocument)
    .finish()
    .buildAndExecute(issuerClient)
const issuerDocument = issuerIdentity.didDocument()
```

## Step 2: Creating and Signing Credentials

The issuer creates a credential with subject data and signs it using BBS+ signatures.

```typescript
// Create credential subject
const subject = {
    name: "Hứa Văn Lý",
    mainCourses: ["Software Engineering", "System Modeling"],
    degree: {
        type: "BachelorDegree",
        name: "Bachelor of Software Engineering",
    },
    GPA: 3.34,
}

// Build credential using the subject and issuer
const credential = new Credential({
    id: "https:/uit.edu.vn/credentials/3732",
    issuer: issuerDocument.id(),
    type: "UniversityDegreeCredential",
    credentialSubject: subject,
})

// Create JPT credential with BBS+ signature
const credentialJpt = await issuerDocument.createCredentialJpt(
    credential,
    issuerStorage,
    issuerFragment,
    new JwpCredentialOptions()
)

// Validate the credential's proof
const decodedJpt = JptCredentialValidator.validate(
    credentialJpt,
    issuerDocument,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

The credential JWT (JPT) is a structured token with three parts:

-   Header: Contains algorithm info and claims metadata
-   Payload: Contains the actual credential data
-   Signature: Cryptographic proof of the credential's authenticity

Example of a JWT credential payload:

```json
{
    "iss": "did:iota:0x123456789abcdef...",
    "sub": "did:subject:holder123",
    "iat": 1628097029,
    "exp": 1659633029,
    "vc": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiableCredential", "UniversityDegreeCredential"],
        "credentialSubject": {
            "name": "Hứa Văn Lý",
            "mainCourses": ["Software Engineering", "System Modeling"],
            "degree": {
                "type": "BachelorDegree",
                "name": "Bachelor of Software Engineering"
            },
            "GPA": 3.34
        }
    }
}
```

-   Header: Contains algorithm info and claims metadata
-   Payload: Contains the actual credential data
-   Signature: Cryptographic proof of the credential's authenticity

## Step 3: Issuer Sends Credential to Holder

In a real system, the issuer would securely transmit the credential to the holder:

```typescript
// In a real system, this would involve secure transmission
// Here we simply pass the credential JWT string
const credentialJptString = credentialJpt.toString()
// Transmit credentialJptString to holder...
```

The JWT payload looks like:

```
eyJ0eXAiOiJKUFQiLCJhbGciOiJCQlMtQkxTMTIzODEtU0hBMjU2Iiwia2lkIjoiZGlkOmlvdGE6...
```

## Step 4: Holder Resolves Issuer's DID and Validates Credential

The holder needs to resolve the issuer's DID to obtain their public key for validation:

```typescript
// Create identity client to resolve DIDs
const identityClientReadOnly = await IdentityClientReadOnly.createWithPkgId(
    iotaClient,
    IOTA_IDENTITY_PKG_ID
)

// Extract issuer DID from credential
let issuerDid = IotaDID.parse(
    JptCredentialValidatorUtils.extractIssuerFromIssuedJpt(
        credentialJpt
    ).toString()
)

// Resolve issuer's DID to get their DID document
let issuerDoc = await identityClientReadOnly.resolveDid(issuerDid)

// Validate the credential
let decodedCredential = JptCredentialValidator.validate(
    credentialJpt,
    issuerDoc,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

## Step 5: Verifier Sends Challenge for Presentation

The verifier generates a unique, random challenge that the holder must incorporate into their presentation. This is a critical security mechanism to prevent replay attacks:

```typescript
// Generate a random challenge
const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"
```

## Step 6: Holder Creates Selective Disclosure Presentation

The holder decides which fields to conceal and which to reveal:

```typescript
// Get method ID from credential for referencing verification method
const methodId = decodedCredential.decodedJwp().getIssuerProtectedHeader().kid!

// Create selective disclosure presentation from credential
const selectiveDisclosurePresentation = new SelectiveDisclosurePresentation(
    decodedCredential.decodedJwp()
)

// Conceal specific fields - this is the core of ZKP!
selectiveDisclosurePresentation.concealInSubject("mainCourses[1]")
selectiveDisclosurePresentation.concealInSubject("degree.name")
```

## Step 7: Holder Creates Presentation JWT

The holder creates a presentation JWT with the selective disclosure and challenge:

```typescript
// Set up presentation options with the challenge
const presentationOptions = new JwpPresentationOptions()
presentationOptions.nonce = challenge

// Create presentation JWT
const presentationJpt = await issuerDoc.createPresentationJpt(
    selectiveDisclosurePresentation,
    methodId,
    presentationOptions
)
```

## Step 8: Holder Sends Presentation to Verifier

The holder sends the presentation to the verifier:

```typescript
// In a real system, this would involve secure transmission
// Here we simply pass the presentation JWT string
const presentationJptString = presentationJpt.toString()
// Transmit presentationJptString to verifier...
```

When decoded, a presentation JWT payload looks like:

```json
{
    "payloads": [
        "ImRpZDppb3RhOmNiY2Y4ZDM1OjB4Yzc0MTAzNjIzN2JiYWZhM2VmYjcwMGJmNmJkZDQ5OTBhOGRlMzZjNWVkNDdkNTFhYTVhNzQwYmMwMDFkNGRlZiI",
        null,
        null,
        "Imh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIg",
        "IlZlcmlmaWFibGVDcmVkZW50aWFsIg",
        "IlVuaXZlcnNpdHlEZWdyZWVDcmVkZW50aWFsIg",
        "My4zNA",
        "IkJhY2hlbG9yRGVncmVlIg",
        null,
        "IlNvZnR3YXJlIEVuZ2luZWVyaW5nIg",
        null,
        "IkhydeG4gVsSDbiBMw70i"
    ],
    "issuer": "eyJ0eXAiOiJKUFQiLCJhbGci...",
    "proof": "eyJhbGciOiJCQlMtQkxTMTIzOD...",
    "presentation": "eyJub25jZSI6IjQ3NWE3OTg..."
}
```

### Key Components of the Presentation

1. **payloads**:

    - This is an array format that's different from the original JSON credential because BBS+ signatures process each attribute separately.
    - Each string is a Base64URL-encoded value, wrapped in JSON quotes, then Base64URL-encoded again. This double-encoding is a technical requirement for the IOTA Identity library's BBS+ implementation.
    - The null values represent concealed attributes.

2. **issuer**: Contains information about the issuer's DID document. This is used by the verifier to locate the public key needed to verify the signature.

3. **proof**: The cryptographic BBS+ signature proof that validates the credential's authenticity. It mathematically proves that even the hidden fields were part of the original signed credential.

4. **presentation**: Contains the challenge response data, proving this presentation was created specifically for this verification request. This prevents replay attacks.

### Why the Different Encoding Formats?

-   The original credential uses a JSON format (easier for humans to read)
-   The BBS+ algorithm requires individual attributes to be processed separately to enable selective disclosure
-   The payloads array uses a specialized encoding format required by the cryptographic library
-   The double-encoding happens because:
    1. First encoding: Each value is encoded to maintain consistent binary representation
    2. Second encoding: The encoded values are processed by the BBS+ algorithm, which outputs Base64-encoded values

This specialized format allows the cryptographic proof to work properly even when some fields are concealed.

## Step 9: Verifier Validates the Presentation

The verifier resolves the issuer's DID and validates the presentation:

```typescript
// Extract issuer DID from presentation
const issuerDidV = IotaDID.parse(
    JptPresentationValidatorUtils.extractIssuerFromPresentedJpt(
        presentationJpt
    ).toString()
)

// Resolve issuer's DID to get their DID document
const issuerDocV = await identityClientReadOnly.resolveDid(issuerDidV)

// Set up validation options with the challenge
const presentationValidationOptions = new JptPresentationValidationOptions({
    nonce: challenge,
})

// Validate the presentation
const decodedPresentedCredential = JptPresentationValidator.validate(
    presentationJpt,
    issuerDocV,
    presentationValidationOptions,
    FailFast.FirstError
)
```

After validation, the verifier can see only the disclosed fields:

```json
{
    "name": "Hứa Văn Lý",
    "mainCourses": ["Software Engineering"],
    "degree": {
        "type": "BachelorDegree"
    },
    "GPA": 3.34
}
```

The beauty of ZKP is that the verifier can cryptographically verify that:

1. The entire credential was properly signed by the issuer
2. No tampering has occurred with any fields
3. The challenge was properly incorporated (preventing replay attacks)

All this while seeing only the fields the holder chose to disclose!
