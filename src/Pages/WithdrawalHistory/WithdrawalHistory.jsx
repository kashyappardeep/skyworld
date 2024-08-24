import React, { useEffect, useState } from 'react';
import './WithdrawalHistory.css';
import { MdOutlineFilterList } from 'react-icons/md'
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { ApiPaths } from '../../Config';
import Loader from '../../Components/Loader/Loader';
import { GrNext, GrPrevious } from 'react-icons/gr'
import { ToastContainer, toast } from 'react-toastify';
const WithdrawalHistory = () => {

    const [selectIncome, setSelectIncome] = useState(1);
    const [filterVisiblity, setFilterVisiblity] = useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [initValue, setInitValue] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNum, setPageNum] = useState();

    useEffect(() => {
        setSelectIncome();
        FetchData(initValue);
        // checkData();
    }, [])

    const toastSuccess = (msg) => toast.success(msg);
    const toastFailed = (msg) => toast.error(msg);

    function fetchIncome(e) {
        setSelectIncome(e.target.value);
        FetchData(e.target.value);
    }
    function FetchData(startVal = 0, reset = "") {
        var newUrl;
        // console.log('start', startDate)
        // console.log('end', endDate)
        // console.log('setSelectIncome', selectIncome)
        setLoading(true);
        let userId = localStorage.getItem('userId');
        if (reset == "reset") {
            newUrl = `${ApiPaths.withdrawalHistory}?start_date=&end_date=`;
        } else {
            newUrl = `${ApiPaths.withdrawalHistory}?start_date=${startDate}&end_date=${endDate}`;
        }
        axios({
            method: "post",
            url: newUrl,
            data: {
                u_id: userId,
                init_val: startVal
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                console.log(response);
                setIncomeData(response?.data);
                let totalCnt = Math.ceil(response?.data?.total_count / 20);
                // console.log("totalCnt", totalCnt)
                setTotalPages(totalCnt);
                setLoading(false);
            })
            .catch(function (response) {
                // console.log(response);
                setLoading(false);
            });
    }
    function WithdrawCancel(txId) {
        setLoading(true)
        let userId = localStorage.getItem('userId');
        axios({
            method: "post",
            url: ApiPaths.cancelWithdraw,
            data: {
                u_id: userId,
                trx_id: txId
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                console.log(response);
                if (response?.data?.res == "success") {
                    FetchData(initValue);
                    toastSuccess(response?.data?.msg);
                } else {
                    toastFailed(response?.data?.msg)
                }
                setLoading(false);
            })
            .catch(function (response) {
                // console.log(response);
                setLoading(false);
            });
    }


    function resetData() {
        setStartDate("");
        setEndDate("");
        FetchData(0, "reset");
    }

    function MovePrev() {
        if (incomeData?.total_count > 20 && incomeData?.prev_page == "yes") {
            if (incomeData?.next_page == 'yes') {
                FetchData((incomeData?.next_init_val) - 40);
            }
        }
    }
    function MoveNext() {
        if (incomeData?.next_page == 'yes') {
            FetchData((incomeData?.next_init_val));
        }
    }
    function GoTo() {
        if (pageNum > 0 && pageNum <= totalPages) {
            FetchData(selectIncome, ((pageNum - 1) * 20))
        }
    }
    return (
        <>
            {
                loading ? <Loader /> : null
            }
            <ToastContainer />
            <section className="dashboard">
                <div className='incomeSelectBox'>
                    <div></div>
                    <button onClick={() => setFilterVisiblity(!filterVisiblity)}>{filterVisiblity ? "Hide Filters" : "Show Filters"}<i> <MdOutlineFilterList /></i> </button>
                </div>
                {
                    filterVisiblity ?
                        <section className="filtersection inputPrimary">
                            <Row>
                                <Col lg="2" md="4" xs="12"><input type="date" name="" id="" placeholder='Start Date' value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="12"><input type="date" name="" id="" placeholder='End Date' value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="6"><button onClick={() => FetchData()}>Search</button></Col>
                                <Col lg="2" md="4" xs="6"><button onClick={() => resetData()}>Reset</button></Col>
                            </Row>
                        </section> : null
                }

                <section className="history">
                    <h1 className="textHeading">Withdrawal History</h1>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Amount ($)</th>
                                    <th>TX ID</th>
                                    <th>TX Charges ($)</th>
                                    <th>Remark</th>
                                    <th>Status</th>
                                    <th>TX Hash</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    incomeData?.data?.map((x, i) => {
                                        return <tr>
                                            <td>{parseInt(incomeData?.start_from) + 1 + i}</td>

                                            {/* <td>{i + 1}</td> */}
                                            <td>{parseFloat(x?.amount).toFixed(2)}</td>
                                            <td>{x?.id}</td>
                                            <td>{x?.tx_charge}</td>
                                            <td>{x?.remark}</td>
                                            {
                                                x?.status == "0" ?
                                                    <td>
                                                        <p className='m-0' >Pending</p>
                                                        <button className='btnPrimary' style={{ width: "auto", padding: "5px 10px", boxShadow: "none" }} onClick={() => WithdrawCancel(x?.id)}>Cancel</button>
                                                    </td> :
                                                    x?.status == "1" ?
                                                        <td style={{ color: "green" }}>Success</td> :
                                                        <td style={{ color: "red" }}>Rejected</td>
                                            }
                                            <td>{x?.tx_hash}</td>
                                            <td>{x?.added_on}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            incomeData?.data?.length == 0 ?
                                <p>No history yet</p> : null
                        }
                    </div>
                    <div className="myPagination">
                        <div className='GoOnPage'><input min={1} type="number" placeholder='Page' value={pageNum} onChange={(e) => setPageNum(e.target.value)} /><button onClick={() => GoTo()}>Go</button></div>
                        <div className='movePagination'>
                            <button onClick={() => MovePrev()}><i><GrPrevious /></i></button>
                            <button onClick={() => MoveNext()}><i><GrNext /></i></button>
                        </div>
                        <div className='pageCount'>
                            <p>Pages {Math.ceil(incomeData?.next_init_val / 20)} / {totalPages}</p>
                        </div>

                    </div>
                </section>

            </section>
        </>
    )
}

export default WithdrawalHistory