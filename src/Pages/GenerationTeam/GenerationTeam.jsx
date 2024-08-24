import React, { useEffect, useState } from "react";
import { MdOutlineFilterList } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import { GrNext, GrPrevious } from "react-icons/gr";
import "./GenerationTeam.css";
import { Data } from "../../Common/Data";
import Select from "react-select";

const GenerationTeam = () => {
  const [selectLevel, setSelectLevel] = useState("1");
  const [filterVisiblity, setFilterVisiblity] = useState(false);
  const [directTeamData, setDirectTeamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initValue, setInitValue] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNum, setPageNum] = useState();
  const [filterName, setFilterName] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterjoinDate, setFilterjoinDate] = useState("");
  var dropdownData = [
    { value: "1", label: "Level 1" },
    { value: "2", label: "Level 2" },
    { value: "3", label: "Level3" },
    { value: "4", label: "Level4" },
    { value: "5", label: "Level 5" },
    { value: "6", label: "Level6" },
    { value: "7", label: "Level 7" },
    { value: "8", label: "Level 8" },
    { value: "9", label: "Level 9" },
    { value: "10", label: "Level 10" },
  ];
  function handleChange(selectLevel) {
    setSelectLevel(selectLevel.value);
    console.log("selectLevel", selectLevel.value)
    FetchData(selectLevel.value);
  }
  useEffect(() => {
    let param = dropdownData[0].value;
    setSelectLevel(param);
    FetchData(param, initValue);
    // checkData();
  }, []);

  function fetchIncome(e) {
    setSelectLevel(e.target.value);
    FetchData(e.target.value);
  }
  function FetchData(incomeType, startVal = 0) {
    Data.isDebug && console.log("setSelectLevel", selectLevel);
    setLoading(true);
    let userId = localStorage.getItem("userId");
    let myurl = `${ApiPaths.generationTeam}?name=${filterName}&username=${filterUserId}`;
    axios({
      method: "post",
      url: myurl,
      data: {
        u_id: userId,
        init_val: startVal,
        level: incomeType,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        Data.isDebug && console.log(response);
        setDirectTeamData(response?.data);
        let totalCnt = Math.ceil(response?.data?.total_count / 20);
        Data.isDebug && console.log("totalCnt", totalCnt);
        setTotalPages(totalCnt);
        setLoading(false);
      })
      .catch(function (response) {
        Data.isDebug && console.log(response);
        setLoading(false);
      });
  }

  // function MovePrev() {
  //     if (directTeamData?.total_count > 20 && directTeamData?.prev_page == "yes") {
  //         if (directTeamData?.next_page == 'yes') {
  //             FetchData(selectLevel, (directTeamData?.next_init_val) - 40);
  //         }
  //     }
  // }
  function MovePrev() {
    if (
      directTeamData?.total_count > 20 &&
      directTeamData?.prev_page == "yes"
    ) {
      if (directTeamData?.prev_page == "yes") {
        let len = parseInt(directTeamData?.data?.length);
        FetchData(selectLevel, directTeamData?.next_init_val - (20 + len));
      }
    }
  }
  function MoveNext() {
    if (directTeamData?.next_page == "yes") {
      FetchData(selectLevel, directTeamData?.next_init_val);
    }
  }
  function GoTo() {
    if (pageNum > 0 && pageNum <= totalPages) {
      FetchData(selectLevel, (pageNum - 1) * 20);
    }
  }
  function filterReset() {
    setFilterName("");
    setFilterUserId("");
    setFilterMobile("");
    setFilterjoinDate("");
    setFilterStatus("");
    FetchData(selectLevel, 0);
  }
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#007bff" : "transparent",
      color: state.isSelected ? "#ffffff" : "#495057",
    }),
  };
  return (
    <>
      {loading ? <Loader /> : null}
      <section className="dashboard">
        <div className="incomeSelectBox">
          <Select
            defaultValue={dropdownData[0]}
            onChange={handleChange}
            options={dropdownData}
            styles={customStyles}
          // placeholder="Level 1"
          />

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
              {/* <Col lg="2" md="4" ><input type="number" placeholder='Mobile' value={filterMobile} onChange={(e) => setFilterMobile(e.target.value)} /></Col> */}

              <Col lg="2" md="4" xs="6">
                <button onClick={() => FetchData(selectLevel, 0)()}>
                  Search
                </button>
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
                  <th>S.o</th>
                  <th>Name</th>
                  <th>User Id</th>
                  {/* <th>Country Code</th> */}
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Level</th>
                  <th>Sponsor ID (Name)</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(directTeamData?.data) && directTeamData?.data?.map((x, i) => {
                  return (
                    <tr>
                      {/* <td>{parseInt(directTeamData?.start_from) + 1 + i}</td> */}
                      <td>{i + 1}</td>
                      <td>{x.name}</td>
                      <td>{x.username}</td>
                      {/* <td>{x.country_code}</td> */}
                      <td>{x.added_on}</td>
                      {x.active_status == "1" ? (
                        <td style={{ color: Data?.colorSuccess }}>
                          Active{" "}
                          <td className="p-0" style={{ border: "none" }}>
                            {x.active_date}
                          </td>
                        </td>
                      ) : (
                        <td style={{ color: "red" }}>Inactive</td>
                      )}
                      <td>{dropdownData[selectLevel.value - 1]?.label}</td>
                      <td>{x?.sponsor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {directTeamData?.data?.length == 0 ? <p>No history yet</p> : null}
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
                Pages {Math.ceil(directTeamData?.next_init_val / 20)} /{" "}
                {totalPages}
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default GenerationTeam;
