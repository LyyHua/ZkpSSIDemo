import { initializeDID, publishDID } from "./zkp";
import { IotaDocument, IotaDID } from "@iota/identity-wasm/node"; // Added IotaDID import

async function main() {
  try {
    const document = await initializeDID(); // Correctly handle the promise
    if (document) {
      console.log("DID Initialized:", document.id().toString());
      // const publishedInfo = await publishDID(document, client); // client is not returned by initializeDID anymore
      // console.log("DID Published:", publishedInfo);
    } else {
      console.error("Failed to initialize DID.");
    }
  } catch (error) {
    console.error("Error in main execution:", error);
  }
}

main();
