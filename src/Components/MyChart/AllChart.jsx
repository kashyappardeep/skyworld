import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import './MyChart.css'
import { Data } from '../../Common/Data';
const AllChart = (props) => {

    // console.log("props.data", props.data);


    let myData = props?.data;
    let orderAmount = myData?.orderAmount;
    let remaining = Math.abs(myData?.remaining);
    let ern = myData?.totalEarning;
    let cap = myData?.capping;
    let num = myData?.number;
    // for (let i = 0; i < myData?.length; i++) {
    //     cap += myData[i]?.capping
    // }

    // remaining = cap - ern;
    // console.log("cap", cap)
    // console.log("ern", ern)
    // console.log("remaining", remaining)

    const data = [
        { title: 'Investment', value: parseFloat(remaining ?? 0.00000000001), color: 'grey' },
        { title: 'Earning', value: parseFloat(ern ?? 0.0000000000), color: Data.colorPrimary },
    ];

    return (
        <section >
            {/* <p style={{ margin: '0 0 5px 0', color: "var(--textHeading)", fontSize: "14px" }}>Order {num}</p> */}
            <div className='capping mb-3 position-relative' style={{ paddingTop: "50px" }}>
                <div id='OrderAmount'>
                    <p>Order Amount :</p>
                    <h5>${orderAmount}</h5>
                </div>
                <div className='cappingGraphDiv'>
                    <div style={{ height: '120px' }}>
                        <PieChart
                            animate={true}
                            animationDuration={2000}
                            data={data}
                            lineWidth={30}
                            paddingAngle={2}
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                            labelStyle={{
                                fill: "#fff",
                                fontSize: '5px',
                                fontFamily: 'sans-serif',
                                fontSize: "8px",
                                fontWeight: "bold",
                                borderRadius: "50%",
                                background: "red !important"
                            }}
                        />
                    </div>
                    <div className='cappingAbout '>
                        <div>
                            <span style={{ background: Data.colorPrimary }}></span>
                            <p>Earning</p>
                        </div>
                        <div>
                            <span style={{ background: "grey" }}></span>
                            <p>Remaining</p>
                        </div>
                    </div>
                </div>

                <div className='cappingDetails'>
                    <div>
                        <h1>${cap}</h1>
                        <p>Total Capping</p>
                    </div>
                    {/* <hr /> */}
                    <div>
                        <h1>${parseFloat(ern).toFixed(2)}</h1>
                        <p>Total Earning</p>
                    </div>
                    {/* <hr /> */}
                    <div>
                        <h1>${parseFloat(remaining).toFixed(2)}</h1>
                        <p>Remaining</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllChart;
// animationDuration: number;
// animationEasing: string;
// center: [number, number];
// data: Data < BaseDataEntry >;
// labelPosition: number;
// lengthAngle: number;
// lineWidth: number;
// paddingAngle: number;
// radius: number;
// startAngle: number;
// viewBoxSize: [number, number];