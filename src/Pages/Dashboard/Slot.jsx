import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "./Slot.css";
import { Row, Col } from "react-bootstrap";
import { GiCycle } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Data } from "../../Common/Data";
import { ApiPaths } from "../../Config";
const Slot = () => {
  let x = 0;
  const [loading, setLoading] = useState(false);
  const [g1Data, setG1Data] = useState([]);
  const [g2Data, setG2Data] = useState([]);
  const [g3Data, setG3Data] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (x === 0) {
      checkData();
      x = 1;
    }
  }, []);

  function checkData() {
    let jsondata = localStorage.getItem("slotData");
    const data = JSON.parse(jsondata);
    if (data) {
      setG1Data(data?.g1);
      setG2Data(data?.g2);
      setG3Data(data?.g3)
      FetchData();
    } else {
      FetchData(true);
    }
  }

  function FetchData(checkload) {
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
        setG1Data(data?.g1);
        setG2Data(data?.g2);
        setG3Data(data?.g3)
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
  function ViewDetailFunction(name, number, amount) {
    // console.log({ name, number, amount })
    localStorage.setItem('slotDetailInfoName', name);
    localStorage.setItem('slotDetailInfoNumber', number);
    localStorage.setItem('slotDetailInfoAmount', amount);
    navigate('slot')
  }
  return (
    <>
      <section>
        <h1 className="textHeadingWithMargin">4X MATRIX</h1>
        <Row>
          {g1Data != null
            ? [...Array(6)].map((_, i) => {
              let upgadeAmt = 0;
              let lastChild = getLastKey(g1Data?.[i + 1]?.data)
              const g1NodeData = g1Data?.[i + 1]?.data?.[lastChild];
              return <Col md="6 p-2" lg="4 p-2">
                <div className="slotDiv">
                  <div className="slotViewDiv">
                    <p>$ {g1Data?.[i + 1]?.package_amount}</p>
                    <button onClick={() => ViewDetailFunction("g1", i + 1, g1Data?.[i + 1]?.package_amount)}>View</button>
                  </div>
                  <div className="slotContentDiv">
                    {[...Array(4)].map((_, index) => {
                      upgadeAmt = g1NodeData?.income ?? 0;
                      return <span
                        className={
                          g1NodeData?.nodes?.[index]
                            ? "activeSpan"
                            : "inActiveSpan"
                        }
                        data-tooltip-id="my-tooltip" data-tooltip-content={g1NodeData?.nodes_username?.[index]}
                      ></span>
                    })}
                  </div>
                  <div className="slotAmountDiv">
                    <p>$ {upgadeAmt}
                    </p>
                    <p>
                      {g1Data?.[i + 1]?.cycles}
                      <i>
                        <GiCycle />
                      </i>
                    </p>
                  </div>
                </div>
              </Col>
            }) : null}
        </Row>
      </section>
      <section>
        <h1 className="textHeadingWithMargin">2X4 MATRIX</h1>
        <Row>
          {g2Data != null
            ? [...Array(6)].map((_, i) => {
              // console.log("88888888888888888888888888888", g2Data);
              let g2UpgadeAmt = 0;
              let g2LastChild = getLastKey(g2Data?.[i + 7]?.data)
              const g2NodeData = g2Data?.[i + 7]?.data?.[g2LastChild];
              // console.log("01010101010", g2NodeData)
              return <Col md="6 p-2" lg="4 p-2" key={i}>
                <div className="slotDiv">
                  <div className="slotViewDiv">
                    <p>$ {g2Data?.[i + 7]?.package_amount}</p>
                    <button onClick={() => ViewDetailFunction("g2", i + 7, g2Data?.[i + 7]?.package_amount)}>View</button>
                  </div>
                  <div className="slotContentTreeDiv">
                    <div className="mb-3">
                      <Row style={{ width: "100%" }}>
                        {[...Array(2)].map((_, index) => {
                          g2UpgadeAmt = g2NodeData?.income ?? 0
                          let obj = [];
                          if (g2NodeData && g2NodeData?.child_Nodes) {
                            obj = Object.keys(g2NodeData?.child_Nodes);
                          }
                          // console.log("ind.22222obj", obj[index])
                          return (
                            <>
                              <Col xs="6">
                                <div>
                                  <div className="treeFirstDiv">
                                    <span
                                      className={
                                        g2NodeData?.nodes?.[index] ? "activeSpan" : "inActiveSpan"
                                      }
                                      data-tooltip-id="my-tooltip" data-tooltip-content={g2NodeData?.nodes_username?.[index]}
                                    ></span>
                                  </div>
                                  <div className="treeSecondDiv mt-3">
                                    <span
                                      className={
                                        g2NodeData?.child_Nodes_username?.[g2NodeData?.nodes?.[index]]?.[0]
                                          ? "activeSpan"
                                          : "inActiveSpan"
                                      }
                                      data-tooltip-id="my-tooltip" data-tooltip-content={g2NodeData?.child_Nodes_username?.[g2NodeData?.nodes?.[index]]?.[0]}
                                    ></span>
                                    <span
                                      className={
                                        g2NodeData?.child_Nodes_username?.[g2NodeData?.nodes?.[index]]?.[1]
                                          ? "activeSpan"
                                          : "inActiveSpan"
                                      } data-tooltip-id="my-tooltip" data-tooltip-content={g2NodeData?.child_Nodes_username?.[g2NodeData?.nodes?.[index]]?.[1]}
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
                  <div className="slotAmountDiv">
                    <p>$ {g2UpgadeAmt}
                    </p>
                    <p>
                      {g2Data?.[i + 7]?.cycles}
                      <i>
                        <GiCycle />
                      </i>
                    </p>
                  </div>
                </div>
              </Col>
            }) : null}
        </Row>
      </section>
      <section>
        <h1 className="textHeadingWithMargin">GLOBAL AUTO MATRIX</h1>
        <Row>
          {g3Data != null
            ? [...Array(1)].map((_, i) => {
              let g3UpgradeAmount = 0;
              return <Col md="6 p-2" lg="4 p-2">
                <div className="slotDiv">
                  <div className="slotViewDiv">
                    <p>$  {g3Data?.["13"]?.package_amount}</p>
                    <button onClick={() => ViewDetailFunction("g3", 13, g3Data?.["13"]?.package_amount)}>View</button>
                  </div>
                  <div className="slotContentDiv">
                    {g3Data &&
                      [...Array(3)].map((_, index) => {
                        let g3LastChild = getLastKey(g3Data?.['13']?.data)
                        g3UpgradeAmount = g3Data?.['13']?.data?.[g3LastChild]?.income ?? 0;
                        return <span
                          className={
                            g3Data?.['13']?.data?.[g3LastChild]?.nodes?.[index]
                              ? "activeSpan"
                              : "inActiveSpan"
                          }
                          data-tooltip-id="my-tooltip" data-tooltip-content={g3Data?.['13']?.data?.[g3LastChild]?.nodes_username?.[index]}
                        ></span>
                      })}
                  </div>
                  <div className="slotAmountDiv">
                    <p>$ {g3UpgradeAmount} </p>
                    <p>
                      {g3Data?.["13"]?.cycles}
                      <i>
                        <GiCycle />
                      </i>
                    </p>
                  </div>
                </div>
              </Col>
            }) : null}
        </Row>
      </section>

    </>
  );
};

export default Slot;
