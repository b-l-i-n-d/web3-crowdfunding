import { useAddress, useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React, { useEffect, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton, Loader } from '../components';

function CampaignRequests() {
    const {
        state: { campaignData, campaignAddress },
    } = useLocation();
    const navigate = useNavigate();
    const id = useId();
    const [isLoading, setIsLoading] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [approversCount, setApproversCount] = useState(0);
    const [isApprovers, setIsApprovers] = useState(false);
    const { contract: campaignContract } = useContract(campaignAddress);
    const address = useAddress();

    const getRequests = async () => {
        try {
            const requestCount = await campaignContract.call('getRequestsCount');

            const requests = await Promise.all(
                Array(parseInt(requestCount, 10))
                    .fill()
                    .map((element, index) => campaignContract.call('requests', index))
            );
            setRequestList(requests);
        } catch (error) {
            console.log(error);
        }
    };

    const getApproversCount = async () => {
        try {
            const data = await campaignContract.call('approversCount');
            setApproversCount(data);
        } catch (error) {
            console.log(error);
        }
    };

    const checkIsApprovers = async () => {
        try {
            const data = await campaignContract.call('approvers', address);
            setIsApprovers(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            setIsLoading(true);
            const data = await campaignContract.call('approveRequest', requestId);
            setIsLoading(false);
            console.log(data);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleFinalize = async (requestId) => {
        try {
            setIsLoading(true);
            const data = await campaignContract.call('finalizeRequest', requestId);
            setIsLoading(false);
            console.log(data);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getRequests();
        getApproversCount();
        checkIsApprovers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isLoading]);

    const handleNavigate = (campaignName) => {
        navigate(`/campaign-details/${campaignName}/requests/new`, {
            state: { campaignData, campaignAddress },
        });
    };

    return (
        <div>
            {isLoading && <Loader />}
            <div className="flex flex-wrap justify-between items-center">
                <h1 className="font-epilogue font-semibold text-[18px] text-white">
                    Withdral request for
                    <span className="text-secondary"> {campaignData[5]}</span>
                </h1>
                <CustomButton
                    btnType="button"
                    title="Add withdrawal request"
                    styles="btn-primary"
                    handleClick={() => handleNavigate(campaignData[5])}
                />
            </div>
            <div className="flex items-center justify-center my-3">
                <span className="font-bold text-info text-lg">
                    Current balance {ethers.utils.formatEther(campaignData[1])} ETH
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="table mx-auto">
                    <thead>
                        <tr className="font-epilogue">
                            <th className="text-left">ID</th>
                            <th className="text-left">Description</th>
                            <th className="text-left">Amount</th>
                            <th className="text-left">Recipient</th>
                            <th className="text-center">Approval Count</th>
                            <th className="text-left">Approve</th>
                            <th className="text-left">Finalize</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.map((request, index) => (
                            <tr key={id} className="hover">
                                <td>{index}</td>
                                <td>{request.description}</td>
                                <td>{ethers.utils.formatEther(request[1])}</td>
                                <td className="font-firaMono text-secondary transcate">
                                    {request.recipient}
                                </td>
                                <td className="text-center">
                                    {parseInt(request.approvalCount, 10)} /{' '}
                                    {parseInt(approversCount, 10)}
                                </td>
                                <td>
                                    <CustomButton
                                        title="Appprove"
                                        styles={`${
                                            ethers.utils.formatEther(campaignData[1]) <= 0 &&
                                            'btn-disabled'
                                        } ${!isApprovers && 'btn-disabled'} ${
                                            request.complete && 'btn-disabled'
                                        } btn-primary btn-sm`}
                                        handleClick={() => handleApprove(index)}
                                    />
                                </td>
                                <td>
                                    <CustomButton
                                        title="Finalize"
                                        styles={`${
                                            ethers.utils.formatEther(campaignData[1]) <= 0 &&
                                            'btn-disabled'
                                        } ${campaignData[4] !== address && 'btn-disabled'} ${
                                            parseInt(request.approvalCount, 10) <=
                                                parseInt(approversCount, 10) / 2 && 'btn-disabled'
                                        } ${request.complete && 'btn-disabled'} btn-primary btn-sm`}
                                        handleClick={() => handleFinalize(index)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CampaignRequests;
