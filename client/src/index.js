import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from './components/Route'; 
// console.log(routes)
const router = createBrowserRouter(routes)
// console.log(router)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<React.StrictMode>
     <RouterProvider router={router} />
</React.StrictMode> 
 
);
