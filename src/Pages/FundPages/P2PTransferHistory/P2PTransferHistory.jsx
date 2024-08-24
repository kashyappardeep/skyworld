import React, { useEffect, useState } from 'react';
import './P2PTransferHistory.css';
import { MdOutlineFilterList } from 'react-icons/md'
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { ApiPaths } from '../../../Config';
import Loader from '../../../Components/Loader/Loader';
import { GrNext, GrPrevious } from 'react-icons/gr'
const P2PTransferHistory = () => {

    const [filterVisiblity, setFilterVisiblity] = useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [initValue, setInitValue] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNum, setPageNum] = useState();
    const [filterName, setFilterName] = useState('');
    const [filterUsername, setFilterUsername] = useState('');
    useEffect(() => {
        FetchData(initValue);
    }, []);

    function FetchData(startVal = 0, reset = "") {
        var newUrl;
        // console.log('start', startDate)
        // console.log('end', endDate)
        setLoading(true);
        let token = localStorage.getItem('token');
        if (reset == "reset") {
            newUrl = `${ApiPaths.fundHistory}?name=&username=start_date=&username=`;
        } else {
            newUrl = `${ApiPaths.fundHistory}?name=${filterName}&username=${filterUsername}start_date=${startDate}&end_date=${endDate}`;
        }
        //   console.log(newUrl)


        axios({
            method: "post",
            url: newUrl,
            data: {
                init_val: startVal,
                type: "transfer"
            },
            headers: {
                "Content-Type": "multipart/form-data",
                token: token
            },
        })
            .then(function (response) {
                // console.log(response);
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


    function resetData() {
        setStartDate("");
        setEndDate("");
        setFilterName("");
        setFilterUsername("");
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
            FetchData(((pageNum - 1) * 20))
        }
    }
    return (
        <>
            {
                loading ? <Loader /> : null
            }
            <section className="dashboard">
                <div className='incomeSelectBox'>
                    <div></div>
                    <button onClick={() => setFilterVisiblity(!filterVisiblity)}>{filterVisiblity ? "Hide Filters" : "Show Filters"}<i> <MdOutlineFilterList /></i> </button>

                </div>
                {
                    filterVisiblity ?
                        <section className="filtersection inputPrimary">
                            <Row>
                                <Col lg="2" md="4" xs="12"><input type="text" placeholder='Name' value={filterName} onChange={(e) => setFilterName(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="12"><input type="text" placeholder='Username' value={filterUsername} onChange={(e) => setFilterUsername(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="12"><input type="date" placeholder='Start Date' value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="12"><input type="date" placeholder='End Date' value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Col>
                                <Col lg="2" md="4" xs="6"><button onClick={() => FetchData()}>Search</button></Col>
                                <Col lg="2" md="4" xs="6"><button onClick={() => resetData()}>Reset</button></Col>
                            </Row>
                        </section> : null
                }

                <section className="history">
                    <h1 className="textHeading">History</h1>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>TXN User</th>
                                    <th>Username</th>
                                    <th>TXN Type</th>
                                    <th>Credit/Debit</th>
                                    <th>Balance</th>
                                    <th>Remark</th>
                                    <th>Date&Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    incomeData?.data?.map((x, i) => {
                                        return <tr>
                                            <td>{parseInt(incomeData?.start_from) + 1 + i}</td>

                                            {/* <td>{i + 1}</td> */}
                                            <td>{x?.tx_from_name}</td>
                                            <td>{x?.tx_from_ucode}</td>
                                            <td>{x?.tx_type}</td>
                                            <td>{x?.debit_credit}</td>
                                            <td>{x?.amount}</td>
                                            <td>{x?.remark}</td>
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

export default P2PTransferHistory