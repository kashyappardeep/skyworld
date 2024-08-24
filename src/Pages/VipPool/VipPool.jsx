import React, { useEffect, useState } from "react";
import "./VipPool.css";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import { Data } from "../../Common/Data";
import Timer from "../../Components/Timer";

const VipPool = () => {
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
      url: ApiPaths.vipPool,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        let data = response?.data;
        Data.isDebug && console.log("API response data:", data);

        // Correctly extract data from nested structure
        if (data && data.data) {
          const nestedData = data.data;
          const dataArray = Object.keys(nestedData).map((key) => ({
            id: key,
            ...nestedData[key],
          }));
          Data.isDebug && console.log("Formatted dataArray:", dataArray);
          setFastIncomeData(dataArray);
        }

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
          <h1 className="textHeading">VIP GLOBAL POOLS BONUS</h1>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>VIP</th>
                  <th>Ranks</th>
                  <th>Income</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fastIncomeData?.map((x, i) => {
                  const minRank = parseInt(x?.min_rank, 10); // Ensure min_rank is treated as a number
                  return (
                    <tr key={x.id}>
                      <td>{i + 1}</td>
                      <td>{x?.rank}</td>
                      <td>
                        {minRank}, {minRank + 1}
                      </td>
                      <td>{x?.income}</td>
                      {x?.status === "Achieved" ? (
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
            {fastIncomeData?.length === 0 ? <p>No history yet</p> : null}
          </div>
        </section>
      </section>
    </>
  );
};

export default VipPool;
