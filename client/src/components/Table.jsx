/* eslint-disable no-plusplus */
import moment from 'moment';
import React from 'react';

function Table({ paymentsData }) {
    const data = paymentsData;
    let index = 1;
    console.log(data);

    const tableRowElements =
        data.status === 0 ? (
            <tr>data.result</tr>
        ) : (
            data.result?.map(
                (item) =>
                    item.to &&
                    item.functionName && (
                        <tr className="hover">
                            <th>{index++}</th>
                            <td>{item.to}</td>
                            <td>{item.value / 1000000000000000000}</td>
                            <td>{moment(item.timeStamp * 1000).format('DD MMM YYYY hh:mm a')}</td>
                        </tr>
                    )
            )
        );
    console.log(tableRowElements);

    return (
        <table className="table w-full">
            <thead>
                <tr>
                    <th />
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
