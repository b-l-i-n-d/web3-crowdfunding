import React, { useEffect, useState } from 'react';

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const { address, campaignContract, getCampaigns } = useStateContext();

    const fetchCampaigns = async () => {
        setIsLoading(true);
        const data = await getCampaigns();
        console.log(data);
        setCampaigns(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (campaignContract) fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, campaignContract]);

    return <DisplayCampaigns title="All Campaigns" isLoading={isLoading} campaigns={campaigns} />;
}

export default Home;
