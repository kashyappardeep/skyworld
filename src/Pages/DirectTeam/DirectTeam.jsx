import React, { useEffect, useState } from 'react';
import { MdOutlineFilterList } from 'react-icons/md'
import { Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { ApiPaths } from '../../Config';
import Loader from '../../Components/Loader/Loader';
import { GrNext, GrPrevious } from 'react-icons/gr'
import { Data } from '../../Common/Data';
import "./DirectTeam.css";
import { TbBinaryTree2 } from "react-icons/tb";
const DirectTeam = () => {

    const [selectIncome, setSelectIncome] = useState(1);
    const [filterVisiblity, setFilterVisiblity] = useState(false);
    const [directTeamData, setDirectTeamData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initValue, setInitValue] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNum, setPageNum] = useState();
    const [filterName, setFilterName] = useState('');
    const [filterUserId, setFilterUserId] = useState('');
    const [filterMobile, setFilterMobile] = useState('');
    const [filterjoinDate, setFilterjoinDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [uId, setUid] = useState(localStorage.getItem('userId'))
    var dropdownData = [
        { "name": "All", "type": "" },
        { "name": "Active", "type": "1" },
        { "name": "Inactive", "type": "0" },
    ];
    useEffect(() => {
        let param = dropdownData[0].type;
        setSelectIncome(param);
        FetchData(uId, param, initValue);
        // checkData();
    }, [])
    function MyTeam() {
        let idd = localStorage.getItem('userId');
        setUid(idd);
        FetchData(idd, "", 0);
    }
    function FetchData(uid = uId, incomeType = "", startVal = 0) {
        Data.isDebug && console.log('setSelectIncome', selectIncome)
        setLoading(true);
        let userId = localStorage.getItem('userId');

        axios({
            method: "post",
            url: ApiPaths.directTeam,
            data: {
                u_id: uid,
                init_val: startVal,
                status: incomeType
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                Data.isDebug && console.log(response);
                setDirectTeamData(response?.data);
                let totalCnt = Math.ceil(response?.data?.total_count / 20);
                Data.isDebug && console.log("totalCnt", totalCnt)
                setTotalPages(totalCnt);
                setLoading(false);
            })
            .catch(function (response) {
                Data.isDebug && console.log(response);
                setLoading(false);
            });
    }
    function FetchFilterData(uid = uId, incomeType, startVal = 0) {
        Data.isDebug && console.log('setSelectIncome', selectIncome)
        setLoading(true);
        let userId = localStorage.getItem('userId');
        let myurl = `${ApiPaths.directTeam}?name=${filterName}&username=${filterUserId}&active_date=${filterjoinDate}&mobile=${filterMobile}&status=${filterStatus}`
        console.log("myurl", myurl)
        axios({
            method: "post",
            url: myurl,
            data: {
                u_id: uid,
                init_val: startVal,
                status: incomeType
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(function (response) {
                Data.isDebug && console.log(response);
                setDirectTeamData(response?.data);
                let totalCnt = Math.ceil(response?.data?.total_count / 20);
                Data.isDebug && console.log("totalCnt", totalCnt)
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
    //             FetchData(uId, selectIncome, (directTeamData?.next_init_val) - 40);
    //         }
    //     }
    // }
    function MovePrev() {
        if (directTeamData?.total_count > 20 && directTeamData?.prev_page == "yes") {
            if (directTeamData?.prev_page == 'yes') {
                let len = parseInt(directTeamData?.data?.length);
                FetchData(uId, selectIncome, (directTeamData?.next_init_val) - (20 + len));
            }
        }
    }
    function MoveNext() {
        if (directTeamData?.next_page == 'yes') {
            FetchData(uId, selectIncome, (directTeamData?.next_init_val));
        }
    }
    function GoTo() {
        if (pageNum > 0 && pageNum <= totalPages) {
            FetchData(uId, selectIncome, ((pageNum - 1) * 20))
        }
    }
    function filterReset() {
        setFilterName('');
        setFilterUserId('');
        setFilterMobile('');
        setFilterjoinDate('');
        setFilterStatus('');
        FetchData();
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
                                <Col lg="2" md="4" ><input type="text" placeholder='Name' value={filterName} onChange={(e) => setFilterName(e.target.value)} /></Col>
                                <Col lg="2" md="4" ><input type="text" placeholder='User ID' value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} /></Col>
                                <Col lg="2" md="4" ><input type="number" placeholder='Mobile' value={filterMobile} onChange={(e) => setFilterMobile(e.target.value)} /></Col>
                                <Col lg="2" md="4">
                                    <select name="" id="" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        {
                                            dropdownData.map((x, i) => {
                                                return <option value={x.type}>{x.name}</option>
                                            })
                                        }
                                    </select></Col>


                                <Col lg="2" md="4" xs="6"><button onClick={() => FetchFilterData()}>Search</button></Col>
                                <Col lg="2" md="4" xs="6"><button onClick={filterReset}>Reset</button></Col>
                            </Row>
                        </section> : null
                }

                <section className="history">
                    <button className='myTeamBtn' onClick={MyTeam}>My Team</button>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>S.no</th>
                                    <th>Direct Team</th>
                                    <th>Name</th>
                                    <th>User Id</th>
                                    <th>Mobile</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th>Total Direct</th>
                                    <th>Total Team</th>
                                    <th>Subcription Packages</th>
                                    <th>My Rank</th>
                                    <th>Total Team Business</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    directTeamData?.data?.map((x, i) => {
                                        return <tr>
                                            <td>{parseInt(directTeamData?.start_from) + 1 + i}</td>
                                            {/* <td>{i + 1}</td> */}
                                            <td onClick={() => (FetchData(x?.id, "", "0"), setUid(x?.id))}><i style={{ fontSize: "25px", cursor: "pointer" }}><TbBinaryTree2 /></i></td>
                                            <td>{x.name}</td>
                                            <td>{x.username}</td>
                                            <td>{x.mobile}</td>
                                            <td>{x.added_on}</td>
                                            {
                                                x.active_status == "1" ?
                                                    <td style={{ color: Data?.colorSuccess }}>Active <td className='p-0' style={{ border: "none" }}>{x.active_date}</td></td> :
                                                    <td style={{ color: "red" }}>Inactive</td>
                                            }
                                            <td>{x.total_direct}</td>
                                            <td>{x.total_team}</td>
                                            <td>{x.ai_package}</td>
                                            <td>{x.my_rank} ({x.rank_per}%)</td>
                                            <td>{parseFloat(x.team_business).toFixed(2)}</td>


                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            directTeamData?.data?.length == 0 ?
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
                            <p>Pages {Math.ceil(directTeamData?.next_init_val / 20)} / {totalPages}</p>
                        </div>

                    </div>
                </section>

            </section>
        </>
    )
}

export default DirectTeam