import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar, Sidebar } from './components';
import {
    CampaignDetails,
    CampaignNewRequest,
    CampaignRequests,
    CreateCampaign,
    Home,
    PaymentDetails,
    Profile,
} from './pages';

export default function App() {
    return (
        <div className="relative sm:p-8 p-4 bg-[#131318] min-h-screen flex flex-row text-white">
            <div className="sm:flex hidden mr-10 relative">
                <Sidebar />
            </div>

            <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-campaign" element={<CreateCampaign />} />
                    <Route path="/campaign-details/:id" element={<CampaignDetails />} />
                    <Route path="/campaign-details/:id/requests" element={<CampaignRequests />} />
                    <Route
                        path="/campaign-details/:id/requests/new"
                        element={<CampaignNewRequest />}
                    />
                    <Route path="/payments" element={<PaymentDetails />} />
                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </div>
        </div>
    );
}
