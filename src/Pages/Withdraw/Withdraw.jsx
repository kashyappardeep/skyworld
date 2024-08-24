import React, { useEffect, useState } from "react";
import "./Withdraw.css";
import axios from "axios";
import { ApiPaths } from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import { Link } from "react-router-dom";
import { Data } from "../../Common/Data";
const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [paymentAddress, setPaymentAddress] = useState("");
  const [amountError, setAmountError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [withdrawalWallet, setWithdrawalWallet] = useState("main_wallet");
  const [withdrawalAddress, setWithdrawalAddress] = useState("BEP20");
  const [withdrawalAddressError, setWithdrawalAddressError] = useState("");
  const [accountInfo, setAccountInfo] = useState([]);

  useEffect(() => {
    FetchData();
  }, []);

  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  function checkData() {
    let jsondata = localStorage.getItem("dashboardData");
    const data = JSON.parse(jsondata);
    // console.log("data", data)
    if (data) {
      setDashboardData(data);
      setAccountInfo(data?.account_info?.[0]);
      FetchData();
    } else {
      FetchData();
    }
  }
  function resetError() {
    setWithdrawalAddressError("");
    setAmountError("");
    setOtpError("");
  }
  function FetchData() {
    setLoading(true);
    let userId = localStorage.getItem("userId");
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
        setAccountInfo(response?.data?.account_info?.[0]);
        localStorage.setItem("dashboardData", JSON.stringify(response?.data));
        setLoading(false);
      })
      .catch(function (response) {
        // console.log(response);
        setLoading(false);
      });
  }
  function WithdrawOTP() {
    let withdrawAdd = false;
    resetError();
    FetchData();
    withdrawAdd = accountInfo?.btc_address;
    let user_Id = localStorage.getItem("userId");
    Data.isDebug && console.log(accountInfo);
    setLoading(true);
    if (withdrawAdd) {
      if (amount > 0) {
        axios({
          method: "post",
          url: ApiPaths.transferFundOtp,
          data: {
            u_code: user_Id,
            otp_type: "withdrawal",
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then(function (response) {
            console.log(response, "response of transfer fund");
            if (response?.data?.res == "success") {
              FetchData();
              toastSuccess(response?.data?.message);
              setShowOtp(true);
            } else {
              const errorAmountWithoutTags =
                response?.data?.error_amount.replace(/<\/?p>/g, "");
              if (response?.data?.errorAmountWithoutTags.length > 0) {
                toastFailed(errorAmountWithoutTags.replace(/<\/?p>/g, ""));
              } else {
                toastFailed(response?.data?.message);
              }
            }
            setLoading(false);
          })
          .catch(function (response) {
            Data.isDebug && console.log(response);
            toastFailed("Something went wrong");
            setLoading(false);
          });
      } else {
        setLoading(false);
        toastFailed("Invalid amount");
        Data.isDebug && console.log("nn");
      }
    } else {
      toastFailed(
        "First set your withdrawal wallet address in profile section."
      );
    }
  }
  function WithdrawFunc() {
    let user_Id = localStorage.getItem("userId");
    resetError();
    Data.isDebug && console.log("Withdrawa now");

    if (withdrawalWallet == "1") {
      setWithdrawalAddressError("Select withdrawal wallet");
      showOtp(false);
    }

    if (!amount > 0) {
      setAmountError("Invalid Amount");
      showOtp(false);
    }

    if (otp.length !== 6) {
      setOtpError("Invalid OTP");
    }

    setOtpLoading(true);
    if (amount > 0 && withdrawalWallet !== "1" && otp.length == 6) {
      axios({
        method: "post",
        url: ApiPaths.withdraw,
        data: {
          u_id: user_Id,
          selected_wallet: withdrawalWallet,
          amount: amount,
          otp_input: otp,
          withdraw_type: withdrawalAddress,
          payment_address: accountInfo?.btc_address,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          // console.log(response);
          if (response?.data?.res == "success") {
            FetchData();
            setShowOtp(false);
            setOtp("");
            setAmount("");
            toastSuccess(response?.data?.message);
          } else {
            setOtp("");
            setShowOtp(false);
            toastFailed(response?.data?.message.replace(/<\/?p>/g, ""));
          }
          setOtpLoading(false);
        })
        .catch(function (response) {
          // console.log(response);
          toastFailed("Something went wrong");
          setOtpLoading(false);
        });
    } else {
      setOtpLoading(false);
    }
  }

  return (
    <section className="dashboard">
      {loading ? <Loader /> : null}
      {showOtp ? (
        <div className="otpSection">
          <div className="otpContainer">
            <h1>OTP</h1>
            <p>OTP sent to your registered email address</p>
            <input
              type="text"
              maxLength={6}
              size={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <p className="errorMsg">{otpError}</p>
            {otpLoading ? (
              <div className="otpLoading"></div>
            ) : (
              <div>
                <button
                  className="btnSecondary"
                  onClick={() => (setOtp(""), setShowOtp(false))}
                >
                  Cancel
                </button>
                <button className="btnPrimary" onClick={WithdrawFunc}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
      <ToastContainer />
      <div className="addfundDiv inputPrimary">
        <h1>Withdraw</h1>
        {/* <div className='addfundDivFundWallet'>
                    <p className='mb-1'>Main Wallet</p>
                    <p className='mb-1'>${parseFloat(dashboardData?.wallets?.main_wallet).toFixed(2)}</p>
                </div>
                <div className='addfundDivFundWallet'>
                    <p>Package Wallet</p>
                    <p>${parseFloat(dashboardData?.wallets?.package_wallet).toFixed(2)}</p>
                </div> */}
        <div className="withdrawSelectWallet">
          <div className="main_wallet">
            <h5 className="mb-1">
              ${parseFloat(dashboardData?.wallets?.main_wallet).toFixed(2)}
            </h5>
            <p className="mb-1">Withdraw Wallet</p>
          </div>
        </div>
        <label htmlFor="Amount">Withdrawal Address</label>
        <select
          value={withdrawalAddress}
          onChange={(e) => setWithdrawalAddress(e.target.value)}
        >
          {/* <option value="1">Select Withdrawal Address</option> */}
          <option value="BEP20">BEP20</option>
          {/* <option value="TRC20">TRC20</option> */}
        </select>
        {/* {
                    withdrawalAddress == "BEP20" ?
                        accountInfo?.btc_address != null ?
                            < p id="withdrawAddress">Addrss : {accountInfo?.btc_address}</p>
                            :
                            <div id='withdrawAddressError'>
                                < p >BEP20 address not found please add address first</p>
                                <Link to="/dashboard/profile" checkActive="1"><button>Add Account</button></Link>
                            </div>
                        :
                        withdrawalAddress == "TRC20" ?
                            accountInfo?.tron_address != null ?
                                < p id="withdrawAddress">Addrss : {accountInfo?.tron_address}</p>
                                :
                                <div id='withdrawAddressError'>
                                    < p >TRC20 address not found please add address first</p>
                                    <Link to="/dashboard/profile" checkActive="1"><button>Add Account</button></Link>
                                </div>
                            : null
                } */}
        <p className="errorMsg">{withdrawalAddressError}</p>
        <label htmlFor="Amount">Amount</label>
        <input
          min={1}
          required
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="errorMsg">{amountError}</p>
        <button className="btnPrimary mt-3" onClick={WithdrawOTP}>
          Send OTP
        </button>
        {/* <button className="btnPrimary mt-3" onClick={WithdrawFunc}>
          Withdraw
        </button> */}
      </div>
    </section>
  );
};

export default Withdraw;
