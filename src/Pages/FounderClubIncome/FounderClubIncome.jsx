import React, { useEffect, useState } from "react";
import "./FounderClubIncome.css";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import { Data } from "../../Common/Data";
import Timer from "../../Components/Timer";
const FounderClubIncome = () => {
  const [loading, setLoading] = useState(false);
  const [fastIncomeData, setFastIncomeData] = useState([]);
  useEffect(() => {
    FetchData();
  }, []);

  function FetchData() {
    setLoading(true);
    let userId = localStorage.getItem("userId");
    console.log("userId", userId);
    axios({
      method: "post",
      url: ApiPaths.founderClubIncome,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        let data = response?.data?.data;
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        console.log("dataArray", dataArray);
        setFastIncomeData(dataArray);
        Data.isDebug && console.log(response);
        setLoading(false);
      })
      .catch(function (response) {
        console.log(response);
        setLoading(false);
      });
  }

  return (
    <>
      {loading ? <Loader /> : null}
      <section className="dashboard">
        <section className="history">
          <h1 className="textHeading">Founder Club Income</h1>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Required Rank</th>
                  <th> Pool Income</th>

                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fastIncomeData?.map((x, i) => {
                  return (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{x?.required_rank}</td>
                      <td>{x?.income}%</td>
                      {x?.status == "Achieved" ? (
                        <td style={{ color: Data.colorSuccess }}>
                          {x?.status}
                        </td>
                      ) : (
                        <td>{x?.status}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {fastIncomeData?.length == 0 ? <p>No history yet</p> : null}
          </div>
        </section>
      </section>
    </>
  );
};

export default FounderClubIncome;
