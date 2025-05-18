# IOTA Identity Integration Issues and Solutions

## Current Issue

When attempting to use the actual IOTA Identity WASM library's ZKP capabilities, we encountered an error:

```
Error: expected instance of JwpIssued
```

This error occurs in the `SelectiveDisclosurePresentation` constructor. Looking at the error, it seems that the IOTA Identity library requires a more specific implementation than what we currently have.

## Root Cause Analysis

After analyzing the error, we've determined:

1. The `SelectiveDisclosurePresentation` class requires a `JwpIssued` instance, which is a specific class from the IOTA Identity library.
2. Our implementation was attempting to create a SelectiveDisclosurePresentation with a simple JavaScript object, which isn't compatible.
3. The IOTA Identity library appears to have changed since our type definitions were created, or the approach we're using doesn't align with how the library is meant to be used.

## Required Changes

To properly implement ZKP with IOTA Identity, we need to make these changes:

1. **Update Type Definitions**: Ensure our type definitions match the actual IOTA Identity WASM library.

2. **Proper Credential Creation**: We need to use the proper IOTA Identity flow:

    - Create an `IotaDocument` for the issuer
    - Create an `IotaDocument` for the holder
    - Use `IotaDocument.createCredentialJpt()` with a BLS12-381 verification method
    - Sign the credential properly

3. **Proper Presentation Creation**:

    - Use `SelectiveDisclosurePresentation` with the properly created credential
    - Follow the IOTA Identity library's expected flow

4. **Network Integration**:
    - Set up a proper resolver that can interact with the IOTA network
    - Properly register DIDs on the network

## Next Steps

1. **Review Documentation**: Consult the latest IOTA Identity documentation for the correct API usage.

    - See: https://wiki.iota.org/identity/tutorials/selective-disclosure/

2. **Update Type Definitions**: Update our type definitions to match the current IOTA Identity WASM library.

3. **Implement Step by Step**: Break down the implementation into smaller steps:

    - First, get basic DID creation working
    - Then, implement proper credential creation
    - Finally, implement the selective disclosure presentation

4. **Consider Simple Simulation**: Until we can properly integrate with IOTA Identity, we can:
    - Continue using our simulated implementation
    - Clearly document that it's a simulation
    - Explain how it would work with the real IOTA Identity library

## Technical Details

Based on the error, the IOTA Identity WASM API requires:

1. The proper sequence of initialization
2. Creating a JwpIssued instance before creating a SelectiveDisclosurePresentation
3. Following the exact API as specified in the documentation

The error suggests we need a deeper understanding of the IOTA Identity API structure before proceeding with the implementation.
