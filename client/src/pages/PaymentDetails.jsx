/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Table } from '../components';
import { useStateContext } from '../context';

function PaymentDetails() {
    const { getPayments } = useStateContext();
    const [paymentsData, setPaymentsData] = useState('');

    const payments = async () => {
        const data = await getPayments();
        setPaymentsData(data);
    };

    useEffect(() => {
        payments();
    }, []);

    return (
        <div>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                Payment Details
            </h1>

            <div className="divider" />

            <div className="mt-10 flex">
                <Table paymentsData={paymentsData} />
            </div>
        </div>
    );
}

export default PaymentDetails;
