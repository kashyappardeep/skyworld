import React, { useEffect, useState } from 'react';
import './FundTransfer.css';
import axios from 'axios';
import { ApiPaths } from '../../../Config';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../Components/Loader/Loader';
const FundTransfer = () => {
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [amount, setAmount] = useState('');
    const [userId, setUserId] = useState('');
    const [amountError, setAmountError] = useState('');
    const [userIdError, setUserIdError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [sponsorLoading, setSponsorLoading] = useState(false);
    const [checkSponsorExist, setCheckSponsorExist] = useState([]);
    useEffect(() => {
        checkData();
    }, []);

    const toastSuccess = (msg) => toast.success(msg);
    const toastFailed = (msg) => toast.error(msg);

    function checkData() {
        let jsondata = localStorage.getItem("dashboardData");
        const data = JSON.parse(jsondata);
        // console.log("data", data)
        if (data) {
            setDashboardData(data);
            FetchData();
        } else {
            FetchData();
        }
    }
    function FetchData() {
        let userId = localStorage.getItem('userId');
        axios({
            method: "post",
            url: ApiPaths.dashboard,
            data: {
                u_id: userId,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                // console.log(response);
                setDashboardData(response?.data);
                localStorage.setItem("dashboardData", JSON.stringify(response?.data));
                setLoading(false);
            })
            .catch(function (response) {
                // console.log(response);
                setLoading(false);
            });
    }
    function TransferOTP() {
        let x = 0;
        let user_Id = localStorage.getItem('userId');
        // console.log("userId", user_Id)
        setAmountError('');
        setUserIdError('');
        if (!amount > 0) {
            setAmountError("Invalid Amount")
        } else {
            if (checkSponsorExist?.res == "success") {
                x++;
            }
        }
        if (!userId.length > 0) {
            setUserIdError("Invalid User ID")
        } else {
            x++;
        }
        setLoading(true);
        if (x === 2) {
            axios({
                method: "post",
                url: ApiPaths.transferFundOtp,
                data: {
                    u_code: user_Id,
                    otp_type: "transfer"
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(function (response) {
                    // console.log(response);
                    if (response?.data?.res == "success") {
                        FetchData();
                        toastSuccess(response?.data?.message);
                        setShowOtp(true);
                    } else {
                        toastFailed(response?.data?.message);
                        const errorAmountWithoutTags = response?.data?.error_amount.replace(/<\/?p>/g, '');
                        if (response?.data?.errorAmountWithoutTags.length > 0) {
                            toastFailed(errorAmountWithoutTags.replace(/<\/?p>/g, ''));
                        } else {
                            toastFailed(response?.data?.message);
                        }
                    }
                    setLoading(false);
                })
                .catch(function (response) {
                    // console.log(response);
                    toastFailed('Something went wrong');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }
    function FundTransferFunc() {
        let user_Id = localStorage.getItem('userId');
        const token = localStorage.getItem("token");
        // console.log("userId", userId)
        // console.log("user_Id", user_Id)
        //  console.log("otp", otp)
        setAmountError('');
        setUserIdError('');
        setOtpError('');
        if (!amount > 0) {
            setAmountError("Invalid Amount")
        }
        if (!userId.length > 0) {
            setUserIdError("Invalid User ID")
        }
        if (otp.length !== 6) {
            setOtpError("Invalid OTP")
        }
        setOtpLoading(true);
        if (amount > 0 && userId.length > 0 && otp.length == 6) {
            axios({
                method: "post",
                url: ApiPaths.transferFund,
                data: {
                    u_id: user_Id,
                    selected_wallet: "offset",
                    tx_username: userId,
                    amount: amount,
                    otp_input: otp
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token":token,
                },
            })
                .then(function (response) {
                     console.log(response);
                    if (response?.data?.res == "success") {
                        FetchData();
                        setShowOtp(false);
                        setOtp('');
                        toastSuccess(response?.data?.message);
                    } else {
                        const errorAmountWithoutTags = response?.data?.error_amount.replace(/<\/?p>/g, '');
                        if (errorAmountWithoutTags.length > 0) {
                            toastFailed(errorAmountWithoutTags);
                            setShowOtp(false);
                        }
                        if (response?.data?.error_otp.length > 0) {
                            toastFailed(response?.data?.error_otp.replace(/<\/?p>/g, ''));
                        }
                        if (response?.data?.error_wallet.length > 0) {
                            toastFailed(response?.data?.error_wallet.replace(/<\/?p>/g, ''));
                        }
                    }
                    setOtpLoading(false);
                })
                .catch(function (response) {
                    // console.log(response);
                    toastFailed('Something went wrong');
                    setOtpLoading(false);
                });
        } else {
            setOtpLoading(false);
        }
    }
    const onUserStoppedTyping = (sponID) => {
        // console.log(sponID);
        setSponsorLoading(true);
        axios({
            method: "post",
            url: ApiPaths.checkUsername,
            data: {
                username: sponID,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                // console.log("response", response)
                setCheckSponsorExist(response?.data);
                setLoading(false);
                setSponsorLoading(false)
            })
            .catch(function (response) {
                setLoading(false);
                setSponsorLoading(false)
            });
        // console.log("User stopped typing. Do something here.");
    };
    const handleInputChange = (e) => {
        setUserIdError('');
        const value = e.target.value;
        setUserId(value);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(
            setTimeout(() => {
                if (value.length > 0) {
                    onUserStoppedTyping(value);
                } else {
                    setCheckSponsorExist([])
                }
            }, 500)
        );
    };
    return (
        <section className="dashboard">
            {
                loading ? <Loader /> : null
            }
            {
                showOtp ? <div className="otpSection">
                    <div className='otpContainer'>
                        <h1>OTP</h1>
                        <p>OTP sent to your registered email address</p>
                        <input type="text" maxLength={6} size={6} placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <p className='errorMsg'>{otpError}</p>
                        {
                            otpLoading ? <div className='otpLoading'></div> :
                                <div>
                                    <button className="btnSecondary" onClick={() => (setOtp(''), setShowOtp(false))}>Cancel</button>
                                    <button className="btnPrimary" onClick={FundTransferFunc}>Submit</button>
                                </div>
                        }
                    </div>
                </div> : null
            }
            <ToastContainer />
            <div className="addfundDiv inputPrimary">
                <h1>Fund Transfer</h1>
                <div className='addfundDivFundWallet'>
                    <p>Offset Wallet</p>
                    <p>${parseFloat(dashboardData?.wallets?.offset).toFixed(2)}</p>
                </div>
                <label htmlFor="Amount">User ID</label>
                {
                    checkSponsorExist?.res == "success" ?
                        <p id="sponsorVerified">{checkSponsorExist?.name}</p>
                        :
                        <p id="sponsorVerified" style={{ color: "red" }}>{checkSponsorExist?.message}</p>
                }
                <div className="loginInput_inner">
                    <input style={{ borderRadius: "5px" }} min={1} required type="text" placeholder='User Id' value={userId} onChange={(e) => handleInputChange(e)} />
                    {
                        sponsorLoading ?
                            <i id="sponsorLoading">
                            </i>
                            : null
                    }
                </div>
                <p className='errorMsg'>{userIdError}</p>
                <label htmlFor="Amount">Amount</label>
                <input min={1} required type="number" placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                <p className='errorMsg'>{amountError}</p>
                <button className="btnPrimary mt-3" onClick={TransferOTP}>Send OTP</button>
            </div>
        </section>
    )
}

export default FundTransfer