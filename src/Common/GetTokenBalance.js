import { ethers } from "ethers";
import ContractDetails from "../Contracts/ContractDetails";
import { Data } from "./Data";
// Example usage
export default async function GetTokenBalance(acc) {
  console.log("Data.walletAddress",acc)
  try {
    const provider = new ethers.providers.JsonRpcProvider(Data.providerLink);
    const tokenContract = new ethers.Contract(
      ContractDetails.BUSD,
      ContractDetails.BUSD_ABI,
      provider
    );
    const tokenBalance = await tokenContract.balanceOf(acc);
    const tokenBal = (await tokenBalance) / 1e18;
    
    Data.isDebug && console.log("token Balance:", tokenBal, "token");
    return tokenBal;
  } catch (e) {
    Data.isDebug &&console.log("111111111111111",e);
  }
}
