import React from 'react';

import { loader } from '../assets';
import FundCard from './FundCard';

function DisplayCampaigns({ title, isLoading, campaignAddresses }) {
    return (
        <div>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
                {title} ({campaignAddresses.length})
            </h1>

            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && (
                    <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
                )}

                {!isLoading && campaignAddresses.length === 0 && (
                    <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
                        You have not created any campigns yet
                    </p>
                )}

                {!isLoading &&
                    campaignAddresses.length > 0 &&
                    campaignAddresses.map((campaignAddress) => (
                        <FundCard key={campaignAddress} address={campaignAddress} />
                    ))}
            </div>
        </div>
    );
}

export default DisplayCampaigns;
