import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { IoWallet } from "react-icons/io5";
import { ethers, providers } from "ethers";
import Change from '../Common/StringToSub';
import { setaccount } from '../Redux/Accounts';
import { toast } from 'react-toastify';

const ConnectButton = () => {
    const toastFailed = (msg) => toast.error(msg);

    const [web3Modal, setWeb3Modal] = useState(null);
    const acc = useSelector((state) => state.account.value);
    const dispatch = useDispatch();
    const [msg, setMsg] = useState("");

    const checkWalletIsConnected = () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Make sure you have MetaMask installed");
            setMsg("Make sure you have MetaMask installed");
            return false;
        } else {
            console.log("Wallet exists! We are ready to go");
            setMsg("Wallet exists! We are ready to go");
            return true;
        }
    };

    useEffect(() => {
        checkWalletIsConnected();
    }, []);

    useEffect(() => {
        // Initialize web3modal
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "05f311673625f063cd5c0736f5bb17b0",
                }
            },
        };

        const newWeb3Modal = new Web3Modal({
            cacheProvider: true,
            providerOptions,
        });

        setWeb3Modal(newWeb3Modal);
    }, []);

    useEffect(() => {
        if (web3Modal && web3Modal.cachedProvider) {
            connectWallet();
        }
    }, [web3Modal]);

    async function connectWallet() {
        try {
            if (!web3Modal) {
                throw new Error("Web3Modal not initialized.");
            }

            const provider = await web3Modal.connect();
            if (!provider) {
                throw new Error("Failed to get provider.");
            }

            addListeners(provider);

            const ethersProvider = new providers.Web3Provider(provider);
            const userAddress = await ethersProvider.getSigner().getAddress();
            dispatch(setaccount(userAddress));
            localStorage.setItem('account', userAddress);
        } catch (e) {
            toastFailed(e.message || "Failed to connect wallet.");
            console.error(e);
        }
    }

    function addListeners(provider) {
        if (provider && provider.on) {
            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
        }
    }

    async function handleAccountsChanged(accounts) {
        window.location.reload();
    }

    async function handleChainChanged(chainId) {
        window.location.reload();
    }

    return (
        <>
            {acc != null ?
                <span id="connectButtonAddress">
                    <i><IoWallet /></i>{Change(acc)}
                </span> :
                <button onClick={connectWallet} className='btnConnect'>
                    Connect
                </button>
            }
        </>
    );
};

export default ConnectButton;
