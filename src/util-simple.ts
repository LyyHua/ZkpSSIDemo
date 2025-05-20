/**
 * Utility functions for the local/offline ZKP implementation
 */
import { Storage, JwkMemStore, KeyIdMemStore } from "@iota/identity-wasm/node"

/**
 * Creates a memory storage for keys
 */
export function createStorage(): Storage {
    return new Storage(new JwkMemStore(), new KeyIdMemStore())
}
