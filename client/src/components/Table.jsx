/* eslint-disable no-plusplus */
import { ethers } from 'ethers';
import moment from 'moment';
import React from 'react';

function Table({ paymentsData }) {
    const data = paymentsData;
    let index = 1;

    const tableRowElements =
        data.status === 0 ? (
            <tr>data.result</tr>
        ) : (
            data?.result?.map(
                (item) =>
                    item.to &&
                    item.functionName && (
                        <tr className="hover">
                            <th>{index++}</th>
                            <td className="font-firaMono text-secondary">{item.to}</td>
                            <td>{ethers.utils.formatEther(item.value)}</td>
                            <td>{moment(item.timeStamp * 1000).format('DD MMM YYYY hh:mm a')}</td>
                        </tr>
                    )
            )
        );

    return (
        <table className="table w-full mx-auto">
            <thead>
                <tr>
                    <th>Index</th>
                    <th>To</th>
                    <th>value</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>{tableRowElements}</tbody>
        </table>
    );
}

export default Table;
