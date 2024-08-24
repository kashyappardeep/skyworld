import React, { useEffect, useState } from "react";
import "./UpgradeCard.css";
import { ApiPaths } from "../../Config";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import axios from "axios";
import { Data } from "../../Common/Data";
import PaymentPage from "../CoinPayments/PaymentPage"; // Import the PaymentPage component

const UpgradeCard = (props) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [transactionData, setTransactionData] = useState(null);

  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  const handleCancel = () => {
    setTransactionData(null);
  };

  useEffect(() => {
    if (x === 0) {
      fetchBalance();
      x = 1;
    }
  }, [])


  async function Topup() {
    setLoading(true);
    try {
      await createNewOrder();
      toastSuccess(
        "Transaction created successfully. Please complete the payment."
      );
    } catch (error) {
      toastFailed("Failed to create transaction.");
    }

    setLoading(false);
  }
  async function createNewOrder() {
    const token = localStorage.getItem("token");
    Data.isDebug && console.log(token);
    try {
      const response = await axios({
        method: "post",
        url: ApiPaths.deposit,
        data: {
          amount: props?.data?.pin_rate,
          currency2: "USDT.BEP20",
        },
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      Data.isDebug && console.log("response", response);
      if (response?.data?.res === "error") {
        if (response?.data?.tokenStatus === "false") {
          toastFailed("Token Expired Please Login");
        }
      } else {
        setTransactionData(response?.data?.coinpayment?.result);
        setOrderId(response?.data?.order_id);
        Data.isDebug && console.log("order id ", orderId);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }
  async function confirmDeposit() {
    const token = localStorage.getItem("token");
    Data.isDebug && console.log(token);
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: ApiPaths.confirmDeposit,
        data: {
          orderId: orderId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      Data.isDebug && console.log("response", response);
      if (response?.data?.res === "error") {
        if (response?.data?.tokenStatus === "false") {
          toastFailed("Token Expired Please Login");
        }
      } else {
        toastSuccess("Transaction confirmed!!");
        setTransactionData(null);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  }
  async function fetchBalance() {
    let userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    Data.isDebug && console.log(token);
    try {
      const response = await axios({
        method: "post",
        url: ApiPaths.offsetWallet,
        data: {
          u_id: userId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Data.isDebug && console.log("response", response);
      if (response?.data?.res === "error") {
      } else {
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  return (
    <>
      {loading && <Loader />}
      {transactionData ? (
        <PaymentPage
          transactionData={transactionData}
          onCancel={handleCancel}
          onConfirmPayment={confirmDeposit} // Pass the confirmDeposit function
        />
      ) : (
        <div className="upgradesCard" draggable={true}>
          <h1>{props?.data?.pin_type}</h1>
          <button className="simplePrimaryButton" onClick={Topup}>
            Buy
          </button>
        </div>
      )}
    </>
  );
};

export default UpgradeCard;
