import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import { toast } from "react-toastify";

const PaymentPage = ({ transactionData, onCancel, onConfirmPayment }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!transactionData) {
    return <p>Loading...</p>;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionData.address);
    toastSuccess("Address copied to clipboard!");
  };
  const handleConfirmPayment = () => {
    onConfirmPayment();
  };

  return (
    <div className="paymentPage">
      <div className="paymentCard">
        <div className="paymentAmount">
          <p>Amount to Pay</p>
          <h2>
            {transactionData.amount} {transactionData.coin} (
            {transactionData.fiat_amount} USD)
          </h2>
        </div>
        <div className="qrCode">
          <img src={transactionData.qrcode_url} alt="QR Code" />
        </div>
        <div className="paymentDetails">
          <div className="paymentDetail">
            <p>Payment address</p>
            <div className="addressContainer">
              <input type="text" value={transactionData.address} readOnly />
              <button className="copyButton" onClick={copyToClipboard}>
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
        {/* <button className="payButton" onClick={handleConfirmPayment}>
          Confirm Payment
        </button> */}
        <div className="cancelText" onClick={onCancel}>
          Cancel
        </div>
        <div className="paymentStatus">
          <p>Waiting for payment...</p>
          <p>{formatTime(timeLeft)}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
