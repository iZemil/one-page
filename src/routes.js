import React from 'react';

import IndexPage from 'pages/Index';

const routes = [
    {
        path: '/',
        exact: true,
        component: () => <IndexPage />
    }
];

export default routes;
