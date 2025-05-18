/**
 * Utility functions for IOTA Identity examples
 */
import {
    IotaIdentityClient,
    JwkMemStore,
    KeyIdMemStore,
    Storage,
} from "@iota/identity-wasm/node"
import { IotaClient } from "@iota/iota-sdk/client"

/** Network URL for the Shimmer testnet */
export const NETWORK_URL = "https://api.testnet.shimmer.network"

/** IOTA Identity Package ID */
export const IOTA_IDENTITY_PKG_ID = 2

/**
 * Creates a memory storage for working with keys
 */
export function getMemstorage(): Storage {
    return new Storage(new JwkMemStore(), new KeyIdMemStore())
}

/**
 * Gets a funded client for IOTA Identity operations
 *
 * @param storage The storage instance to use
 * @returns A funded IotaIdentityClient
 */
export async function getFundedClient(
    storage: Storage
): Promise<IotaIdentityClient> {
    try {
        // Create IOTA client
        const iotaClient = new IotaClient({ url: NETWORK_URL })

        // Create identity client
        const identityClient = new IotaIdentityClient(iotaClient)

        return identityClient
    } catch (error) {
        throw new Error(`Failed to create funded client: ${error}`)
    }
}
