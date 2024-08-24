import { ethers } from "ethers";

export default async function getAddress() {
  try {
    // Check if MetaMask is installed
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have meta masked installed");
            return;
        } else {
            console.log("wallet exists! we are ready to go")
        }
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected wallet address:", address);
      return address;
    } else {
      console.log("MetaMask is not installed.");
    }
  } catch (e) {
    console.log(e);
  }
}
