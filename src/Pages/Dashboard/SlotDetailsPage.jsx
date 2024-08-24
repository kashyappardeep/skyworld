import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "./SlotDetailsPage.css";
import { Row, Col } from "react-bootstrap";
import { GiCycle } from "react-icons/gi";
import { Link } from "react-router-dom";
import axios from "axios";
import { Data } from "../../Common/Data";
import { ApiPaths } from "../../Config";
const SlotDetailsPage = () => {
  let x = 0;
  const [loading, setLoading] = useState(false);
  const [g1Data, setG1Data] = useState([]);
  const [g2Data, setG2Data] = useState([]);
  const [g3Data, setG3Data] = useState([]);
  const [checkSlot, setCheckSlot] = useState();
  const [slotAmount, setSlotAmount] = useState();
  useEffect(() => {
    if (x === 0) {
      checkData();
      x = 1;
    }
  }, []);

  function checkData() {
    let jsondata = localStorage.getItem("slotData");
    let slotDetailName = localStorage.getItem("slotDetailInfoName");
    let slotDetailNumber = localStorage.getItem("slotDetailInfoNumber");
    let slotDetailAmount = localStorage.getItem("slotDetailInfoAmount");
    // console.log("1111111111", {
    //   slotDetailName, slotDetailNumber, slotDetailAmount
    // })
    setSlotAmount(slotDetailAmount);
    setCheckSlot(slotDetailName);
    const data = JSON.parse(jsondata);
    if (data) {
      setG1Data(data?.g1?.[slotDetailNumber]?.data);
      setG2Data(data?.g2?.[slotDetailNumber]?.data);
      setG3Data(data?.g3?.[slotDetailNumber]?.data)
      FetchData(false, slotDetailNumber);
    } else {
      FetchData(true, slotDetailNumber);
    }
  }

  function FetchData(checkload, slotDetailNumber) {
    if (checkload) {
      setLoading(true);
    }
    let userId = localStorage.getItem("userId");
    Data.isDebug && console.log("user id", userId);
    axios({
      method: "post",
      url: ApiPaths.slotData,
      // url: "https://gambitbot.io/beta2/jhg7q/user/matrix_data",
      data: {
        u_id: userId,
        // u_id: 3,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        Data.isDebug && console.log(response);
        const data = response?.data[0];
        setG1Data(data?.g1?.[slotDetailNumber]?.data);
        setG2Data(data?.g2?.[slotDetailNumber]?.data);
        setG3Data(data?.g3?.[slotDetailNumber]?.data)
        Data.isDebug && console.log("data", data);

        localStorage.setItem("slotData", JSON.stringify(data));
        setLoading(false);
      })
      .catch(function (response) {
        Data.isDebug && console.log(response);
        setLoading(false);
      });
  }
  function getLastKey(obj) {
    if (!obj || typeof obj !== 'object') {
      return null; // or whatever value you prefer for non-existent or invalid objects
    }
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      return null; // or whatever value you prefer for empty objects
    }
    // return keys[keys.length - 1];
    return keys[0];
  }

  return (
    <>
      {
        checkSlot == 'g1' ?
          <section className="dashboard">
            <section >
              <h1 className="textHeadingWithMargin">4X MATRIX</h1>
              <Row>
                {g1Data != null
                  ?
                  Object.keys(g1Data).map((key, i) => {
                    let upgadeAmt = 0;
                    let cycleNo = 0;
                    let recycleAmount = 0;
                    let income = 0;

                    let lastChild = getLastKey(g1Data?.[i + 1]?.data)
                    const g1NodeData = g1Data?.[i + 1]?.data?.[lastChild];
                    return <Col md="6 p-2" lg="4 p-2">
                      <div className="slotDiv">
                        <div className="slotViewDiv" style={{ justifyContent: "center" }}>
                          <p>$ {slotAmount}</p>
                        </div>
                        <div className="slotContentDiv">
                          {[...Array(4)].map((_, index) => {
                            upgadeAmt = g1Data?.[key]?.upgrade_amount ?? 0;
                            cycleNo = g1Data?.[key]?.cycleNo ?? 0;
                            recycleAmount = g1Data?.[key]?.recycle_amount ?? 0;
                            income = g1Data?.[key]?.income ?? 0;
                            return <span
                              className={
                                g1Data?.[key]?.nodes?.[index]
                                  ? "activeSpan"
                                  : "inActiveSpan"
                              }
                              data-tooltip-id="my-tooltip" data-tooltip-content={g1Data?.[key]?.nodes_username?.[index]}
                            ></span>
                          })}
                        </div>
                        <div className="slotDetailDiv">
                          <div className="slotAmountDiv">
                            <p>Cycle Number</p>
                            <p>{cycleNo}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Income</p>
                            <p>$ {income}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Recycle Amount</p>
                            <p>$ {recycleAmount}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Upgrade Amount</p>
                            <p>$ {upgadeAmt}</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  }) : null}
              </Row>
            </section>
          </section> : checkSlot == 'g2' ?
            <section className="dashboard">
              <h1 className="textHeadingWithMargin">2X4 MATRIX</h1>
              <Row>
                {g2Data != null
                  ? Object.keys(g2Data).map((key, i) => {
                    let g2UpgadeAmt = 0;
                    let g2cycleNo = 0;
                    let g2recycleAmount = 0;
                    let g2income = 0;
                    const g2NodeData = Object.keys(g2Data?.[key]?.child_Nodes);
                    // console.log("g2NodeData", g2Data)

                    return <Col md="6 p-2" lg="4 p-2" key={i}>
                      <div className="slotDiv">
                        <div className="slotViewDiv" style={{ justifyContent: "center" }}>
                          <p>$ {slotAmount}</p>
                        </div>
                        <div className="slotContentTreeDiv">
                          <div className="mb-3">
                            <Row style={{ width: "100%" }}>
                              {[...Array(2)].map((_, index) => {
                                // console.log("g2NodeData?.nodes?.[index]", g2NodeData?.nodes?.[index])
                                g2UpgadeAmt = g2Data?.[key]?.upgrade_amount ?? 0;
                                g2cycleNo = g2Data?.[key]?.cycleNo ?? 0;
                                g2recycleAmount = g2Data?.[key]?.recycle_amount ?? 0;
                                g2income = g2Data?.[key]?.income ?? 0;
                                let obj = [];
                                if (g2NodeData && g2NodeData?.child_Nodes) {
                                  obj = Object.keys(g2NodeData?.child_Nodes);
                                }
                                return (
                                  <>
                                    <Col xs="6">
                                      <div>
                                        <div className="treeFirstDiv">
                                          <span
                                            className={
                                              g2Data?.[key]?.nodes_username?.[index] ? "activeSpan" : "inActiveSpan"
                                            } data-tooltip-id="my-tooltip" data-tooltip-content={g2Data?.[key]?.nodes_username?.[index]}
                                          ></span>
                                        </div>
                                        <div className="treeSecondDiv mt-3">
                                          <span
                                            className={
                                              g2Data?.[key]?.child_Nodes_username?.[g2Data?.[key]?.nodes?.[index]]?.[0]
                                                ? "activeSpan"
                                                : "inActiveSpan"
                                            } data-tooltip-id="my-tooltip" data-tooltip-content={g2Data?.[key]?.child_Nodes_username?.[g2Data?.[key]?.nodes?.[index]]?.[0]}
                                          ></span>
                                          <span
                                            className={
                                              g2Data?.[key]?.child_Nodes_username?.[g2Data?.[key]?.nodes?.[index]]?.[1]
                                                ? "activeSpan"
                                                : "inActiveSpan"
                                            } data-tooltip-id="my-tooltip" data-tooltip-content={g2Data?.[key]?.child_Nodes_username?.[g2Data?.[key]?.nodes?.[index]]?.[1]}
                                          ></span>
                                        </div>
                                      </div>
                                    </Col>
                                  </>
                                );
                              })}
                            </Row>
                          </div>
                        </div>
                        <div className="slotDetailDiv">
                          <div className="slotAmountDiv">
                            <p>Cycle Number</p>
                            <p>{g2cycleNo}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Income</p>
                            <p>$ {g2income}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Recycle Amount</p>
                            <p>$ {g2recycleAmount}</p>
                          </div>
                          <div className="slotAmountDiv">
                            <p>Upgrade Amount</p>
                            <p>$ {g2UpgadeAmt}</p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  }) : null}
              </Row>
            </section> : checkSlot == "g3" ?
              <section className="dashboard">
                <h1 className="textHeadingWithMargin">GLOBAL AUTO MATRIX</h1>
                <Row>
                  {g3Data != null
                    ? Object.keys(g3Data).map((key, i) => {
                      let g3upgadeAmt = 0;
                      let g3cycleNo = 0;
                      let g3recycleAmount = 0;
                      let g3income = 0;
                      return <Col md="6 p-2" lg="4 p-2">
                        <div className="slotDiv">
                          <div className="slotViewDiv" style={{ justifyContent: "center" }}>
                            <p>$ {slotAmount}</p>
                          </div>
                          <div className="slotContentDiv">
                            {g3Data &&
                              [...Array(3)].map((_, index) => {
                                let g3LastChild = getLastKey(g3Data?.['13']?.data)
                                g3upgadeAmt = g3Data?.[key]?.upgrade_amount ?? 0;
                                g3cycleNo = g3Data?.[key]?.cycleNo ?? 0;
                                g3recycleAmount = g3Data?.[key]?.recycle_amount ?? 0;
                                g3income = g3Data?.[key]?.income ?? 0;
                                return <span
                                  className={
                                    g3Data?.[key]?.nodes?.[index]
                                      ? "activeSpan"
                                      : "inActiveSpan"
                                  }
                                  data-tooltip-id="my-tooltip" data-tooltip-content={g3Data?.[key]?.nodes_username?.[index]}
                                ></span>
                              })}
                          </div>
                          <div className="slotDetailDiv">
                            <div className="slotAmountDiv">
                              <p>Cycle Number</p>
                              <p>{g3cycleNo}</p>
                            </div>
                            <div className="slotAmountDiv">
                              <p>Income</p>
                              <p>$ {g3income}</p>
                            </div>
                            <div className="slotAmountDiv">
                              <p>Recycle Amount</p>
                              <p>$ {g3recycleAmount}</p>
                            </div>
                            <div className="slotAmountDiv">
                              <p>Upgrade Amount</p>
                              <p>$ {g3upgadeAmt}</p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    }) : null}
                </Row>
              </section> : <p>Data not found</p>
      }

    </>
  );
};

export default SlotDetailsPage;
