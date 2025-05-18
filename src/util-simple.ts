/**
 * Utility functions for IOTA Identity examples - Simplified version
 * This is just a stub since we're not using the utility functions in our simulation.
 */
import { Storage, JwkMemStore, KeyIdMemStore } from "@iota/identity-wasm/node"

/** Creates a Memory Storage instance. */
export function createStorage(): Storage {
    return new Storage(new JwkMemStore(), new KeyIdMemStore())
}
