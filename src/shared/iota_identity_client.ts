/**
 * IOTA Identity Client
 *
 * Provides utility functions for working with IOTA Identity WASM module
 * in a consistent way across the project.
 */

import path from "path"

// Original import maintained for compatibility
const { IotaIdentityClient } = require("@iota/identity-wasm/node")

/**
 * Dynamically imports the IOTA Identity WASM module
 * and resolves the module path based on the environment.
 */
export async function importIdentityWasm() {
    try {
        const modulePath = require.resolve(
            "@iota/identity-wasm/node/identity_wasm"
        )
        console.log("Resolved module path:", modulePath)

        // Dynamic import using the resolved path
        const identityWasm = await import(modulePath)
        console.log("Successfully imported @iota/identity-wasm")
        return identityWasm
    } catch (error) {
        console.error("Failed to import @iota/identity-wasm:", error)
        throw error
    }
}

/**
 * Encodes a string to base64
 */
export function encodeBase64(str: string): string {
    return Buffer.from(str).toString("base64")
}

/**
 * Decodes a base64 string
 */
export function decodeBase64(b64: string): string {
    return Buffer.from(b64, "base64").toString()
}

/**
 * Generates a random nonce for challenge-response protocols
 */
export function generateNonce(): string {
    // Generate a random 32-byte string and encode as base64
    const bytes = Buffer.from(
        Array(32)
            .fill(0)
            .map(() => Math.floor(Math.random() * 256))
    )
    return bytes
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
}

/**
 * Utility for generating a current timestamp in ISO format
 */
export function now(): string {
    return new Date().toISOString()
}

/**
 * Creates a DID (Decentralized Identifier) string for IOTA
 * In a real implementation, this would be generated and registered on the Tangle
 */
export function createDid(tag: string): string {
    // In a real implementation, this would generate a proper DID
    // with network-specific identifiers
    return `did:iota:${tag}:${Buffer.from(Math.random().toString())
        .toString("hex")
        .substring(0, 16)}`
}

/**
 * Parses a DID to extract components
 */
export function parseDid(did: string): {
    method: string
    network?: string
    identifier: string
} {
    // Example: did:iota:smr:0x123456789abcdef
    const parts = did.split(":")

    if (parts.length < 3 || parts[0] !== "did") {
        throw new Error(`Invalid DID format: ${did}`)
    }

    const method = parts[1]

    if (parts.length === 3) {
        // No network specified: did:iota:0x123456789abcdef
        return {
            method,
            identifier: parts[2],
        }
    } else {
        // Network specified: did:iota:smr:0x123456789abcdef
        return {
            method,
            network: parts[2],
            identifier: parts[3],
        }
    }
}

// Export original IotaIdentityClient for compatibility
export { IotaIdentityClient }

// Default export for backward compatibility
export default { IotaIdentityClient }
