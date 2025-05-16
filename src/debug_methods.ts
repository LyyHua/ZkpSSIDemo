const shared = require("./shared/iota_identity_client")

console.log(
    "IotaIdentityClient Methods:",
    Object.getOwnPropertyNames(shared.IotaIdentityClient.prototype)
)
