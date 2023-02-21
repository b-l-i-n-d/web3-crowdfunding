import React, { useEffect, useState } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [campaignAddresses, setCampaignAddress] = useState([]);

    const { address, campaignContract, getCampaignAddresses } = useStateContext();

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getCampaignAddresses();
        setCampaignAddress(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (campaignContract) fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, campaignContract]);

    return (
        <DisplayCampaigns
            title="All Campaigns"
            isLoading={isLoading}
            campaignAddresses={campaignAddresses}
        />
    );
}

export default Home;
