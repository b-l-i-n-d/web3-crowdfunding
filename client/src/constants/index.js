/* eslint-disable import/prefer-default-export */
import { createCampaign, dashboard, payment, profile, withdraw } from '../assets';

export const navlinks = [
    {
        name: 'dashboard',
        imgUrl: dashboard,
        link: '/',
    },
    {
        name: 'campaign',
        imgUrl: createCampaign,
        link: '/create-campaign',
    },
    {
        name: 'payment',
        imgUrl: payment,
        link: '/payments',
    },
    {
        name: 'withdraw',
        imgUrl: withdraw,
        link: '/',
        disabled: true,
    },
    {
        name: 'profile',
        imgUrl: profile,
        link: '/profile',
    },
];
