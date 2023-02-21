import React, { createContext, useContext } from 'react';

import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export function StateContextProvider({ children }) {
    const { contract: campaignFactoryContract } = useContract(
        '0x26Ca3aE8Bd22a65FB02f75CC9B3B2959AB74839D'
    );
    const { contract: campaignContract } = useContract(
        '0x8f5CFf659bB229b456992eeD476B3f4dbd464200'
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

    const getCampaignAddresses = async () => {
        const campaignAddresses = await campaignFactoryContract.call('getDeployedCampaigns');

        return campaignAddresses;
    };

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaignAddresses();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
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
                getCampaignAddresses,
                getUserCampaigns,
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
