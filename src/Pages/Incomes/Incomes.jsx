import React, { useEffect, useState } from "react";
import "./Incomes.css";
import { MdOutlineFilterList } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import { GrNext, GrPrevious } from "react-icons/gr";
const Incomes = () => {
  const [selectIncome, setSelectIncome] = useState(1);
  const [filterVisiblity, setFilterVisiblity] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initValue, setInitValue] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNum, setPageNum] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  function getData() {
    let userId = localStorage.getItem("userId");
    axios({
      method: "post",
      url: ApiPaths.income_types,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(function (response) {
      let data = response?.data;
      console.log("income_types", response?.data);
      FetchData(data?.[0]?.type, initValue);
      setSelectIncome(data?.[0]?.type)
      setData(data);
    });
  }

  function fetchIncome(e) {
    setSelectIncome(e.target.value);
    FetchData(e.target.value);
  }

  function FetchData(incomeType, startVal = 0, reset = "") {
    var newUrl;
    // console.log('start', startDate)
    // console.log('end', endDate)
    // console.log('setSelectIncome', selectIncome)
    setLoading(true);
    let userId = localStorage.getItem("userId");
    if (reset == "reset") {
      newUrl = `${ApiPaths.incomes}?start_date=&end_date=`;
    } else {
      newUrl = `${ApiPaths.incomes}?start_date=${startDate}&end_date=${endDate}`;
    }
    axios({
      method: "post",
      url: newUrl,
      data: {
        u_id: userId,
        init_val: startVal,
        income_type: incomeType,
      },
      headers: {
        "Content-Type": "multipart/form-data",
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
    FetchData(selectIncome, 0, "reset");
  }

  function MovePrev() {
    if (incomeData?.total_count > 20 && incomeData?.prev_page == "yes") {
      if (incomeData?.next_page == "yes") {
        FetchData(selectIncome, incomeData?.next_init_val - 40);
      }
    }
  }
  function MoveNext() {
    if (incomeData?.next_page == "yes") {
      FetchData(selectIncome, incomeData?.next_init_val);
    }
  }
  function GoTo() {
    if (pageNum > 0 && pageNum <= totalPages) {
      FetchData(selectIncome, (pageNum - 1) * 20);
    }
  }
  return (
    <>
      {loading ? <Loader /> : null}
      <section className="dashboard">
        <div className="incomeSelectBox">
          <select
            name=""
            id=""
            value={selectIncome}
            onChange={(e) => fetchIncome(e)}
          >
            {data.map((x, i) => {
              return <option value={x.type}>{x.name}</option>;
            })}
          </select>
          <button onClick={() => setFilterVisiblity(!filterVisiblity)}>
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
                <button onClick={() => FetchData(selectIncome)}>Search</button>
              </Col>
              <Col lg="2" md="4" xs="6">
                <button onClick={() => resetData()}>Reset</button>
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
                  <th>Amount ($)</th>
                  <th>Remark</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {incomeData?.data?.map((x, i) => {
                  return (
                    <tr>
                      <td>{parseInt(incomeData?.start_from) + 1 + i}</td>

                      {/* <td>{i + 1}</td> */}
                      <td>{parseFloat(x?.amount).toFixed(2)}</td>
                      <td>{x?.remark}</td>
                      <td>{x?.added_on}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {incomeData?.data?.length == 0 ? <p>No history yet</p> : null}
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
                Pages {Math.ceil(incomeData?.next_init_val / 20)} / {totalPages}
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Incomes;
