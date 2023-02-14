import React, { createContext, useContext } from 'react';

import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export function StateContextProvider({ children }) {
    const { contract } = useContract('0xa2f8e20918CF568a76E66cf1Da4Eb10DCbAE500F');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address, // owner
                form.title, // title
                form.description, // description
                form.target,
                new Date(form.deadline).getTime(), // deadline,
                form.image,
            ]);

            console.log('contract call success', data);
        } catch (error) {
            console.log('contract call failure', error);
        }
    };

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i,
        }));

        return parsedCampaings;
    };

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    };

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', pId, {
            value: ethers.utils.parseEther(amount),
        });

        return data;
    };

    // withdraw funds
    const withdraw = async (pId) => {
        const data = await contract.call('withdraw', pId);
        return data;
    };

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', pId);
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
                contract,
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
