import { useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { thirdweb } from '../assets';
// import { daysLeft } from '../utils';

function FundCard({ address }) {
    // const remainingDays = daysLeft(deadline);
    const campaignAddress = address;
    const { contract: campaignContract } = useContract(campaignAddress);
    const [campaignData, setCampaignData] = useState('');

    const navigate = useNavigate();

    const handleNavigate = (campaignName) => {
        navigate(`/campaign-details/${campaignName}`, { state: { campaignData, campaignAddress } });
    };

    const getCampaignDetails = async () => {
        const campaignDetails = await campaignContract.call('getSummary');
        return campaignDetails;
    };

    useEffect(() => {
        if (campaignContract) {
            getCampaignDetails().then((data) => {
                setCampaignData(data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignContract]);

    return (
        campaignData && (
            <div
                role="none"
                className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer"
                onClick={() => handleNavigate(campaignData[5])}
            >
                {/* Image */}
                <img
                    src={campaignData[7]}
                    alt="fund"
                    className="w-full h-[158px] object-cover rounded-[15px]"
                />

                <div className="flex flex-col p-4">
                    <div className="block">
                        {/* Name */}
                        <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
                            {campaignData[5]}
                        </h3>
                        {/* Description */}
                        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
                            {campaignData[6]}
                        </p>
                    </div>

                    <div className="flex justify-between flex-wrap mt-[15px] gap-2">
                        <div className="flex flex-col">
                            {/* Balance */}
                            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                {ethers.utils.formatEther(campaignData[1])}
                            </h4>
                            {/* Target */}
                            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                                Raised of {ethers.utils.formatEther(campaignData[8])} ETH
                            </p>
                        </div>
                        {/* <div className="flex flex-col">
                        <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                            {remainingDays > 0 ? remainingDays : 'Ended'}
                        </h4>
                        <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                            {remainingDays > 0 && 'Days Left'}
                        </p>
                    </div> */}
                    </div>

                    <div className="flex items-center mt-[20px] gap-[12px]">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
                            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
                        </div>
                        {/* Owner */}
                        <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
                            by <span className="text-[#b2b3bd]">{campaignData[4]}</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    );
}

export default FundCard;
