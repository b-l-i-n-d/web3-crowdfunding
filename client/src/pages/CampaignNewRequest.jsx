import { useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton, FormField, Loader } from '../components';

function CampaignNewRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        requestDescription: '',
        amount: '',
        address: '',
    });
    const navigate = useNavigate();
    const {
        state: { campaignAddress },
    } = useLocation();
    const { contract: campaignContract } = useContract(campaignAddress);

    const createNewrequest = async (formData) => {
        try {
            console.log(formData);
            const data = await campaignContract.call(
                'createRequest',
                formData.requestDescription,
                ethers.utils.parseUnits(formData.amount, 18),
                formData.address
            );
            return data;
        } catch (error) {
            return error;
        }
    };

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        await createNewrequest(form);
        setIsLoading(false);
        navigate(-2);
    };

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
                    Create new withdrawal request
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <FormField
                    labelName="Request Description *"
                    placeholder="Write a description for your request"
                    inputType="text"
                    value={form.requestDescription}
                    handleChange={(e) => handleFormFieldChange('requestDescription', e)}
                />

                <FormField
                    labelName="Amount in Ether *"
                    placeholder="ETH 0.50"
                    inputType="text"
                    value={form.amount}
                    handleChange={(e) => handleFormFieldChange('amount', e)}
                />

                <FormField
                    labelName="Recipient Ethereum Wallet Address *"
                    placeholder="0x0000000"
                    inputType="text"
                    value={form.address}
                    handleChange={(e) => handleFormFieldChange('address', e)}
                />

                <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btnType="submit"
                        title="Create Withdrawal Request"
                        styles="btn-primary"
                        handleClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
}

export default CampaignNewRequest;
