import React, { useEffect, useState } from "react";
import { MdOutlineFilterList } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";

import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import "./Transactions.css";
import ScrollToTop from "../../Common/ScrollToTop";
const Transactions = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [filterVisiblity, setFilterVisiblity] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initValue, setInitValue] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNum, setPageNum] = useState();
  const [filterName, setFilterName] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  useEffect(() => {
    ScrollToTop();
    FetchData(initValue);
  }, []);
  const delay = (delayInms) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  function FetchData(initValue = 0, reset = "") {
    var myurl;
    // console.log("name", filterName)
    // console.log("username", filterUserId)
    // console.log("start", startDate)
    // console.log("end", endDate)
    setLoading(true);
    let userId = localStorage.getItem("userId");
    if (reset == "reset") {
      myurl = `${ApiPaths.transcations}?name=&username=&start_date=&end_date=`;
    } else {
      myurl = `${ApiPaths.transcations}?name=${filterName}&username=${filterUserId}&start_date=${startDate}&end_date=${endDate}`;
    }

    axios({
      method: "post",
      url: myurl,
      data: {
        u_id: userId,
        init_val: initValue,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        // console.log("transcations fetch", response);
        setTransactionData(response?.data);
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

  function MovePrev() {
    if (
      transactionData?.total_count > 20 &&
      transactionData?.prev_page == "yes"
    ) {
      FetchData(transactionData?.next_init_val - 40);
      // if (transactionData?.next_page == 'yes') {
      // }
    }
  }
  function MoveNext() {
    if (transactionData?.next_page == "yes") {
      FetchData(transactionData?.next_init_val);
    }
  }
  function GoTo() {
    if (pageNum > 0 && pageNum <= totalPages) {
      FetchData((pageNum - 1) * 20);
    }
  }

  function filterReset() {
    setFilterName("");
    setFilterUserId("");
    setStartDate("");
    setEndDate("");
    FetchData(0, "reset");
  }
  return (
    <>
      {loading ? <Loader /> : null}
      <section className="dashboard">
        <div className="incomeSelectBox">
          <button
            style={{ marginLeft: "auto" }}
            onClick={() => setFilterVisiblity(!filterVisiblity)}
          >
            {filterVisiblity ? "Hide Filters" : "Show Filters"}
            <i>
              {" "}
              <MdOutlineFilterList />
            </i>{" "}
          </button>
        </div>
        {filterVisiblity ? (
          <section className="filtersection inputPrimary">
            <Row>
              <Col lg="2" md="4">
                <input
                  type="text"
                  placeholder="Name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </Col>
              <Col lg="2" md="4">
                <input
                  type="text"
                  placeholder="User ID"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="date"
                  name=""
                  id=""
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="date"
                  name=""
                  id=""
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>

              <Col lg="2" md="4" xs="6">
                <button onClick={() => FetchData()}>Search</button>
              </Col>
              <Col lg="2" md="4" xs="6">
                <button onClick={filterReset}>Reset</button>
              </Col>
            </Row>
          </section>
        ) : null}

        <section className="history">
          <h1 className="textHeading">History</h1>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Tx user</th>
                  {/* <th>Username</th> */}
                  <th>Debit/Credit</th>
                  {/* <th>Wallet Type</th> */}
                  <th>Amount ($)</th>
                  <th>Extra Charges ($)</th>
                  <th>Remark</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactionData?.data?.map((x, i) => {
                  return (
                    <tr>
                      <td>{parseInt(transactionData?.start_from) + 1 + i}</td>
                      <td>{x.tx_from_ucode_name}</td>
                      {/* <td>{x?.tx_from_ucode}</td> */}
                      <td>{x?.debit_credit}</td>
                      {/* <td style={{ textTransform: "capitalize" }}>{x?.wallet_type.replace(/_/g, ' ')}</td> */}
                      <td>{x?.amount}</td>
                      <td>{x?.tx_charge}</td>
                      <td>{x?.remark}</td>
                      <td>{x?.added_on}</td>
                    </tr>
                  );
                })}
              </tbody>
              {/* {
                                loading ? <tr>
                                    {[...Array(9)].map((x, i) =>
                                        <td>{<Skeleton style={{ transition: 'width 0.5s' }} baseColor='#1D1D1D' highlightColor='#73BA3F' />}</td>
                                    )}
                                </tr> : null
                            } */}
            </table>

            {transactionData?.data?.length == 0 ? (
              <p>No Transactions yet</p>
            ) : null}
          </div>
          <div className="myPagination">
            <div className="GoOnPage">
              <input
                min={1}
                type="number"
                placeholder="Page"
                value={pageNum}
                onChange={(e) => setPageNum(e.target.value)}
              />
              <button onClick={() => GoTo()}>Go</button>
            </div>
            <div className="movePagination">
              <button onClick={() => MovePrev()}>
                <i>
                  <GrPrevious />
                </i>
              </button>
              <button onClick={() => MoveNext()}>
                <i>
                  <GrNext />
                </i>
              </button>
            </div>
            <div className="pageCount">
              <p>
                Pages {Math.ceil(transactionData?.next_init_val / 20)} /{" "}
                {totalPages}
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Transactions;
