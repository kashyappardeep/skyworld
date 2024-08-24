import React, { useEffect, useState } from 'react'
import "./AllCapping.css"
import { Data } from '../../Common/Data';
import { ApiPaths } from '../../Config';
import axios from 'axios';
import AllChart from '../../Components/MyChart/AllChart';
const AllCapping = () => {

    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState([]);
    const [cappingData, setCappingData] = useState([]);

    var cappingArray = [{}];
    var x = 0;
    useEffect(() => {
        if (x === 0) {
            checkData();
            x = 1
        }
    }, [])
    function checkData() {
        let jsondata = localStorage.getItem("dashboardData");
        const data = JSON.parse(jsondata);
        if (data) {
            setDashboardData(data);
            handleCapping(data?.pkg_info);
        } else {
            alert("Something went wrong. please login again !");
        }
    }

    function handleCapping(data) {
        let earned = parseFloat(data?.[0]?.pkg_earning);


        for (let i = 0; i < data?.length; i++) {
            let myCapping = parseFloat(data[i].capping);
            let remain = 0;
            let totalEarnnigNeeded = 0;
            let totalEarning = 0;

            for (let j = 0; j <= i; j++) {
                totalEarnnigNeeded += data[j].capping
            }
            if (earned - totalEarnnigNeeded >= 0) {
                totalEarning = myCapping;
                remain = 0;
                earned -= myCapping;
            } else {
                remain = myCapping - earned;
                totalEarning = earned;
                earned = 0;
            }
            cappingArray.push({
                "number": i + 1,
                "orderAmount": data?.[i]?.order_amount,
                "capping": myCapping,
                "remaining": remain,
                "totalEarning": totalEarning,
                "earningNeeded": totalEarnnigNeeded
            })

        }
        setCappingData(cappingArray);
    }


    function FetchData(checkload) {
        if (checkload) {
            setLoading(true)
        }
        let userId = localStorage.getItem('userId');
        axios({
            method: "post",
            url: ApiPaths.dashboard,
            data: {
                u_id: userId,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                Data.isDebug && console.log(response);
                setDashboardData(response?.data);
                localStorage.setItem("dashboardData", JSON.stringify(response?.data));
                setLoading(false);
            })
            .catch(function (response) {
                Data.isDebug && console.log(response);
                setLoading(false);
            });
    }
    return (
        <section className="dashboard">
            {
                cappingData != null && cappingData.length > 0 ?
                    cappingData?.map((x, i) => {
                        return i == 0 ? "" : <AllChart data={x} />
                    }) : ""
            }
        </section>
    )
}

export default AllCapping