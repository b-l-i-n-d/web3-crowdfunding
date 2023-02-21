import { useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React, { useEffect, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { thirdweb } from '../assets';
import { CountBox, CustomButton, Loader } from '../components';
import { useStateContext } from '../context';
import { calculateBarPercentage } from '../utils';

function CampaignDetails() {
    const {
        state: { campaignData, campaignAddress },
    } = useLocation();

    const { contract: campaignContract } = useContract(campaignAddress);

    const navigate = useNavigate();
    const { getDonations, contract, address } = useStateContext();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [donators, setDonators] = useState([]);
    const keyId = useId();

    const contribute = async (contributeAmount) => {
        try {
            const data = await campaignContract.call('contibute', {
                value: ethers.utils.parseEther(contributeAmount),
            });
            return data;
        } catch (error) {
            return error;
        }
    };
    // const remainingDays = daysLeft(campaignData.deadline);

    const fetchDonators = async () => {
        const data = await getDonations(campaignData.pId);

        setDonators(data);
    };

    useEffect(() => {
        if (contract) fetchDonators();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, address]);

    const handleDonate = async () => {
        setIsLoading(true);

        try {
            const data = await contribute(amount);
            console.log('🚀 ~ file: CampaignDetails.jsx:58 ~ handleDonate ~ data', data);

            navigate('/');
            setIsLoading(false);
        } catch (error) {
            alert('Transaction failed. Please try again.');
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleNavigate = (campaignName) => {
        navigate(`/campaign-details/${campaignName}/requests`, {
            state: { campaignData, campaignAddress },
        });
    };

    return (
        <div>
            {isLoading && <Loader />}

            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                <div className="flex-1 flex-col">
                    {/* Image */}
                    <img
                        src={campaignData[7]}
                        alt="campaign"
                        className="w-full h-[410px] object-cover rounded-xl"
                    />
                    <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
                        <div
                            className="absolute h-full bg-[#4acd8d]"
                            style={{
                                width: `${calculateBarPercentage(
                                    // target
                                    ethers.utils.formatEther(campaignData[8]),
                                    // balance
                                    ethers.utils.formatEther(campaignData[1])
                                )}%`,
                                maxWidth: '100%',
                            }}
                        />
                    </div>
                </div>

                <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
                    <CountBox
                        title="Minimum Contribution"
                        value={ethers.utils.formatEther(campaignData[0])}
                    />
                    <CountBox
                        title={`Raised of ${ethers.utils.formatEther(campaignData[8])}`}
                        value={ethers.utils.formatEther(campaignData[1])}
                    />
                    <CountBox
                        title="Total Backers"
                        // value={campaignData[9].length ? campaignData[9].length : 'No donators'}
                    />
                </div>
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Creator
                        </h4>

                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img
                                    src={thirdweb}
                                    alt="user"
                                    className="w-[60%] h-[60%] object-contain"
                                />
                            </div>
                            <div>
                                {/* Manager */}
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                                    {campaignData[4]}
                                </h4>
                                {/* <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                                    10 Campaigns
                                </p> */}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Story
                        </h4>

                        <div className="mt-[20px]">
                            {/* Description */}
                            <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                {campaignData[6]}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Donators
                        </h4>

                        <div className="mt-[20px] flex flex-col gap-4">
                            {donators.length > 0 ? (
                                donators.map((item, index) => (
                                    <div
                                        key={`${item.donator}-${keyId}`}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <p className="font-firaMono font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                                            {index + 1}.{' '}
                                            <span
                                                data-theme="business"
                                                className="text-primary-content"
                                            >
                                                {item.donator}
                                            </span>
                                        </p>
                                        <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                                            {item.donation}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                    No donators yet. Be the first one!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {/* {remainingDays > 0 && (
                        <> */}
                    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                        Fund
                    </h4>

                    <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                        <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                            Fund the campaign
                        </p>
                        <div className="mt-[30px] transition-all duration-300">
                            <input
                                type="number"
                                placeholder="ETH 0.1"
                                step="0.01"
                                min={ethers.utils.formatEther(campaignData[0])}
                                className={`${
                                    amount < ethers.utils.formatEther(campaignData[0])
                                        ? 'input-error'
                                        : 'input-primary'
                                } input w-full`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {amount < ethers.utils.formatEther(campaignData[0]) && (
                                <p className="mt-[10px] font-epilogue font-normal text-[12px] text-error">
                                    Minimum contribution is{' '}
                                    {ethers.utils.formatEther(campaignData[0])} ETH
                                </p>
                            )}
                            <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                                    Back it because you believe in it.
                                </h4>
                                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                                    Support the project for no reward, just because it speaks to
                                    you.
                                </p>
                            </div>
                            {address ? (
                                <CustomButton
                                    btnType="button"
                                    title="Fund Campaign"
                                    styles="w-full btn-primary"
                                    handleClick={handleDonate}
                                />
                            ) : (
                                <div className="alert alert-warning shadow-lg">
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            className="stroke-current flex-shrink-0 w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>Connect your wallet first.</span>
                                    </div>
                                </div>
                            )}

                            <CustomButton
                                btnType="button"
                                title="View Withdrawal Request"
                                styles="w-full mt-[20px] btn-secondary"
                                handleClick={() => handleNavigate(campaignData[5])}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetails;
