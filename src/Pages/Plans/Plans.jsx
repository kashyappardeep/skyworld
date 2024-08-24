import React, { useEffect, useState } from "react";
import "./Plans.css";
import { ApiPaths } from "../../Config";
import { toast } from "react-toastify";
import axios from "axios";
import { Data } from "../../Common/Data";
import Loader from "../../Components/Loader/Loader";
import PaymentPage from "../../Components/CoinPayments/PaymentPage";
import { Col, Row } from "react-bootstrap";

const Plans = () => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [transactionData, setTransactionData] = useState(null);
  const [offsetData, setOffsetData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);
  const [showPopup, setShowPopup] = useState(false);
  const [offsetError, setOffsetError] = useState("");
  const [offsetAmount, setOffsetAmount] = useState();
  const [loading2, setLoading2] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState();
  const [isConditionsTrue, setIsConditionTrue] = useState(false);
  const handleCancel = () => {
    setTransactionData(null);
  };
  let x = 0;
  useEffect(() => {
    if (x === 0) {
      FetchPackages();
      fetchBalance();
      x = 1;
    }
  }, []);

  function FetchPackages() {
    try {
      setLoading(true);
      let userId = localStorage.getItem("userId");
      axios({
        method: "post",
        url: ApiPaths.packages,
        data: {
          u_id: userId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(function (response) {
        console.log("Res", response);
        setPackagesData(response?.data);
        localStorage.setItem("packages", JSON.stringify(response?.data));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function Topup(pkgAmount) {
    console.log("amount", pkgAmount);
    console.log("offset_amount", offsetAmount);
    const token = localStorage.getItem("token");
    try {
      setLoading2(true);
      const response = await axios({
        method: "post",
        url: ApiPaths.deposit,
        data: {
          selected_wallet: "offset",
          amount: pkgAmount,
          offset_amount: offsetAmount,
          currency2: "USDT.BEP20",
        },
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      Data.isDebug && console.log("response", response);
      if (response?.data?.res === "success") {
        setShowPopup(false);
        fetchBalance();
        setTransactionData(response?.data?.coinpayment?.result);
        setOrderId(response?.data?.order_id);
        Data.isDebug && console.log("order id ", orderId);
      } else {
        if (response?.data?.tokenStatus === "false") {
          toastFailed("Token Expired Please Login");
        }
        toastFailed(response?.data?.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading2(false);
      setOffsetAmount("");
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
    let userId = localStorage.getItem("userId");
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
      if (response?.data?.res === "success") {
        setOffsetData(response?.data);
      } else {
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }
  const handOffsetAmount = (e) => {
    setOffsetError("");
    const value = e.target.value;
    setOffsetAmount(value);
    if (parseFloat(value) > 0) {
      if (parseFloat(value) <= selectedPackage) {
        if (
          parseFloat(value) > offsetData?.amount &&
          parseFloat(selectedPackage) >= parseFloat(offsetAmount)
        ) {
          setOffsetError("Insufficient Fund");
        } else if (parseFloat(value) > parseFloat(selectedPackage)) {
          setOffsetError("Amount greater then selected package");
        } else {
          if (offsetData?.active_status == "0") {
            let temp = (offsetData?.amount * 20) / 100;
            if (parseFloat(temp) < parseFloat(value)) {
              setOffsetError(offsetData?.condition);
            }
          }
        }
      } else {
        setOffsetError("Invalid Amount");
      }
    }
  };
  const TopupFunction = (pkgAmt) => {
    setSelectedPackage(pkgAmt);
    setShowPopup(true);
  };
  return (
    <>
      {loading && <Loader />}
      {showPopup && (
        <section className="offsetConfirmBox">
          <div>
            <div id="offsetConfirmBoxBalance" className="mb-2">
              <p>Package</p>
              <p>$ {selectedPackage}</p>
            </div>
            <div id="offsetConfirmBoxBalance">
              <p>Offset Wallet</p>
              <p>$ {offsetData?.amount}</p>
            </div>
            <input
              type="number"
              placeholder="Offset Amount"
              value={offsetAmount}
              onChange={(e) => handOffsetAmount(e)}
              min="0"
              step="0.01"
            />
            <p id="offsetAmountError">{offsetError}</p>
            {offsetData?.active_status == "0" && (
              <p style={{ color: "#000", fontSize: "12px", fontWeight: "600" }}>
                Note : {offsetData?.condition}
              </p>
            )}

            {offsetData?.active_status == "0" && (
              <p style={{ fontSize: "14px", fontWeight: "500" }}>
                Max Offset usable amout = ${(offsetData?.amount * 20) / 100}
              </p>
            )}
            {loading2 === true ? (
              <div className="offsetLoader"></div>
            ) : (
              <div id="offsetConfirmBoxButtons">
                <button
                  className="btnPrimary"
                  style={{
                    color: "var(--colorPrimary)",
                    background: "transparent",
                    border: "1px solid var(--colorPrimary)",
                  }}
                  onClick={() => (
                    setSelectedPackage(""),
                    setOffsetAmount(""),
                    setShowPopup(false)
                  )}
                >
                  Cancel
                </button>
                <button
                  className="btnPrimary"
                  onClick={() => Topup(selectedPackage)}
                  disabled={offsetError?.length > 0 ? true : false}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      <Row>
        {packagesData?.data?.map((x, i) => {
          return (
            <Col sm="6" md="3" className="mb-4">
              {transactionData ? (
                <PaymentPage
                  transactionData={transactionData}
                  onCancel={handleCancel}
                  onConfirmPayment={confirmDeposit} // Pass the confirmDeposit function
                />
              ) : (
                <div className="upgradesCard" draggable={true}>
                  <h1>{x?.pin_type}</h1>
                  <button
                    className="simplePrimaryButton"
                    onClick={() => TopupFunction(x?.pin_rate)}
                  >
                    Buy
                  </button>
                </div>
              )}
            </Col>
          );
        })}
        <Col sm="6" md="3" className="mb-4">
          <div className="upgradesCard" draggable={true}>
            <h1>Infinity</h1>
            <button className="simplePrimaryButton">Up to Infinity</button>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default Plans;
