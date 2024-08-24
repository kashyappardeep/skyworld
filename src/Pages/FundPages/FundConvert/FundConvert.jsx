import React, { useEffect, useState } from 'react';
import './FundConvert.css';
import axios from 'axios';
import { SiConvertio } from 'react-icons/si';
import { ApiPaths } from '../../../Config';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../../Components/Loader/Loader';
const FundConvert = () => {
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
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
        // setLoading(true);
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

    function FundConvertFunc() {
        let userId = localStorage.getItem('userId');
        setAmountError('');
        if (amount > 0) {
            setLoading(true);
            axios({
                method: "post",
                url: ApiPaths.fundConvert,
                data: {
                    u_id: userId,
                    from_wallet: "main_wallet",
                    to_wallet: "fund_wallet",
                    amount: amount
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
                    } else {
                        const errorAmountWithoutTags = response?.data?.error_amount.replace(/<\/?p>/g, '');
                        if (errorAmountWithoutTags.length > 0) {
                            toastFailed(errorAmountWithoutTags);
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
            setAmountError("Invalid Amount")
        }
    }

    return (
        <section className="dashboard">
            {
                loading ? <Loader /> : null
            }
            <ToastContainer />
            <div className="addfundDiv inputPrimary">
                <h1>Fund Convert</h1>
                <div className='fundConvertDiv'>
                    <div>
                        <h5>$ {parseFloat(dashboardData?.wallets?.main_wallet).toFixed(2)}</h5>
                        <p>Main Wallet</p>
                    </div>
                    <i className='d-flex'><SiConvertio /></i>
                    <div>
                        <h5>$ {parseFloat(dashboardData?.wallets?.fund_wallet).toFixed(2)}</h5>
                        <p>Fund Wallet</p>
                    </div>
                </div>

                <label htmlFor="Amount">Amount</label>
                <input min={1} required type="number" name="" id="" placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                <p className='errorMsg'>{amountError}</p>
                <button className="btnPrimary mt-3" onClick={FundConvertFunc}>Convert</button>
            </div>
        </section>
    )
}

export default FundConvert