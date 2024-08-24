import { ethers } from "ethers";

export default async function GetChainId(){
        try {
            if (window.ethereum) {
                window.provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.enable(); // Request user permission to access their accounts
            } else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
            const network = await window.provider.getNetwork();
            const chainId = network.chainId;
            console.log('Chain ID:', chainId);
            if(chainId == 97){
                return true;
            }else{
                alert("Please Connect your wallet with BNB Smart Chain Testnet")
                return false;
            }
        } catch (e) {
            console.log(e);
        }
}