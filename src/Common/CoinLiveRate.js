import { ethers } from "ethers";
import ContractDetails from "../Contracts/ContractDetails";
import { Data } from "./Data";

export default async function CoinLiveRate(id) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      Data.providerLink
    );
    const signer = provider.getSigner(ContractDetails.Contract);
    const contractInstance = new ethers.Contract(
      ContractDetails.Contract,
      ContractDetails.ContractABI,
      signer
    );
    const liveRate = await contractInstance.liveRate();
    console.log("rate is ", liveRate);
    Data.isDebug && console.log("Contract data:", parseFloat(liveRate / 100));
    return parseFloat(liveRate / 1000000);
  } catch (error) {
    console.error("Error fetching contract data:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}
