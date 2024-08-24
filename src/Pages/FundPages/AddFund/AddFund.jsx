import React, { useEffect, useState } from 'react';
import './AddFund.css';
import { ApiPaths } from '../../../Config';
import axios from 'axios';
import { IoCopyOutline } from 'react-icons/io5'
import Loader from '../../../Components/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import QRCode from 'qrcode.react';
import Timer from '../../../Components/Timer';
import CopyFromtag from '../../../Common/CopyFromtag';
import { Data } from '../../../Common/Data';
const AddFund = () => {
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [loading, setLoading] = useState(false);
    const [fundData, setFundData] = useState([]);
    useEffect(() => {
        Fetch();
        setPaymentType('BEP20');
    }, [])
    const toastSuccess = (msg) => toast.success(msg);
    const toastFailed = (msg) => toast.error(msg);

    function Fetch() {
        setLoading(true);
        let userId = localStorage.getItem('userId');
        axios({
            method: "post",
            url: ApiPaths.fundTransaction,
            data: {
                u_id: userId,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                Data.isDebug && console.log(response);
                setFundData(response?.data);
                setLoading(false);
            })
            .catch(function (response) {
                toastFailed('Something went wrong')
                setLoading(false);
            });
    }
    function AddFundFunc() {
        // console.log('paymentType', amount)
        setAmountError('');
        if (amount > 0) {
            setLoading(true);
            let userId = localStorage.getItem('userId');
            axios({
                method: "post",
                url: ApiPaths.addFund,
                data: {
                    u_id: userId,
                    amount: amount,
                    payment_type: paymentType
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(function (response) {
                    Data.isDebug && console.log(response);
                    if (response?.data?.res == "success") {
                        setAmount('');
                        Fetch();
                        toastSuccess(response?.data?.message);
                    } else {
                        toastFailed(response?.data?.message);
                    }
                    setLoading(false);
                })
                .catch(function (response) {
                    toastFailed('Something went wrong')
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
            {
                fundData.show_qr == 'yes' ?
                    <div className='qrSection'>
                        <p>{fundData?.message}</p>
                        <h5>Pay : {fundData?.amount}</h5>
                        <div className='qrDiv'>
                            {
                                fundData && < QRCode value={fundData?.address} />
                            }
                        </div>
                        <p id="timer">{fundData && <Timer time={fundData?.expiryDate} />}</p>
                        <div id='qrAddress'>
                            <p id="fundAddress">{fundData?.address ?? ""}</p>
                            <i onClick={() => CopyFromtag("fundAddress")}><IoCopyOutline /></i>
                        </div>
                    </div>
                    :
                    <div className="addfundDiv inputPrimary">
                        <h1>Add Fund</h1>
                        <label htmlFor="Method">Payment Method</label>
                        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                            <option value="BEP20">BEP-20</option>
                        </select>
                        <label htmlFor="Amount">Amount</label>
                        <input min={1} required type="number" placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <p className='errorMsg'>{amountError}</p>
                        <button className="btnPrimary mt-3" onClick={AddFundFunc}>Add Fund</button>
                    </div>
            }

        </section>
    )
}

export default AddFund