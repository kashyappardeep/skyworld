import React from 'react'

import { ToastContainer, toast } from 'react-toastify';
const MyPromoMaterialCard = (props) => {
    const toastSuccess = (msg) => toast.info(msg);
    const toastFailed = (msg) => toast.error(msg);
    return (
        <>
            {
                <ToastContainer />
            }
            <div className="promoMaterialCard">
                <h5 className="dashboardCardHeading d-block text-center">{props.name}</h5>
                <img src={props.img} alt="" />
                <div className='d-flex gap-3'>
                    <a className='flex-1 w-100' onClick={() => toastSuccess("Will Be Available Soon")}><button className="btnSecondary">Buy</button></a>
                    <a className='flex-1 w-100' href={props.img} download={true}><button className="btnSecondary">Download</button></a>
                </div>
            </div>
        </>
    )
}

export default MyPromoMaterialCard