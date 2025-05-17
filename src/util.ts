import { IotaIdentityClient, JwkMemStore } from "@iota/identity-wasm/node"
import { IotaClient as IotaSDKClient } from "@iota/iota-sdk/client"

export const NETWORK_URL = process.env.NETWORK_URL || "http://localhost:14265"

export function getJwkMemStore(): JwkMemStore {
    return new JwkMemStore()
}

export function getIotaSDKClient(): IotaSDKClient {
    const clientOptions: { url: string; headers?: Record<string, string> } = {
        url: NETWORK_URL,
    }
    return new IotaSDKClient(clientOptions)
}

/**
 * Returns an IotaIdentityClient.
 * This attempts to instantiate IotaIdentityClient by passing an IotaSDKClient instance.
 */
export async function getIdentityClient(): Promise<IotaIdentityClient> {
    const sdkClient = getIotaSDKClient()
    // @ts-expect-error We are re-testing this to see the specific error with v1.5.1
    return new IotaIdentityClient(sdkClient)
}

// Deprecated functions (or functions to be reviewed if still needed elsewhere):
// export async function getFundedClient(storage: Storage): Promise<IotaIdentityClient> { ... }
// export function getMemstorage(): Storage { ... } // Replaced by getJwkMemStore for BBS+ context
