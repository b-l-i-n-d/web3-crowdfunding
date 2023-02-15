import React, { createContext, useContext } from 'react';

import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export function StateContextProvider({ children }) {
    const { contract: campaignFactoryContract } = useContract(
        '0x26Ca3aE8Bd22a65FB02f75CC9B3B2959AB74839D'
    );
    const { contract: campaignContract } = useContract(
        '0x018cC231dfAf369f7F07886404d4f3d09c473462'
    );
    const { mutateAsync: createCampaign } = useContractWrite(
        campaignFactoryContract,
        'createCampaign'
    );

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            console.log(form);
            const data = await createCampaign([
                form.minimum, // minimum
                form.name, // name
                form.description, // description
                // new Date(form.deadline).getTime(), // deadline,
                form.image, // image url
                form.target, // target
            ]);

            console.log('contract call success', data);
        } catch (error) {
            console.log('contract call failure', error);
        }
    };

    const getCampaigns = async () => {
        const campaigns = await campaignFactoryContract.call('getDeployedCampaigns');

        const campaingDetails = campaigns.map((campaign, i) => campaignContract.call('getSummary'));

        return campaingDetails;
    };

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    };

    const donate = async (pId, amount) => {
        const data = await campaignContract.call('donateToCampaign', pId, {
            value: ethers.utils.parseEther(amount),
        });

        return data;
    };

    // withdraw funds
    const withdraw = async (pId) => {
        const data = await campaignContract.call('withdraw', pId);
        return data;
    };

    const getDonations = async (pId) => {
        const donations = await campaignContract.call('getDonators', pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i += 1) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
    };

    // get paymnets from etherscan
    const getPayments = async () => {
        const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${
            import.meta.env.VITE_ETHER_SCAN
        }`;

        const response = await fetch(url);
        const data = await response.json();

        return data;
    };

    return (
        <StateContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                address,
                campaignFactoryContract,
                campaignContract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                withdraw,
                getDonations,
                getPayments,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
