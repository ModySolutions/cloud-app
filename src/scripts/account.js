import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Account from './account/components/Account';
import Links from "./account/components/Links";
import Settings from "./account/components/Settings";
import Security from "./account/components/Security";
import {AccountProvider} from "./account/AccountContext";
import {ToastContainer} from "react-toastify";

const AccountContainer = () => {
    return (
        <div>
            <AccountProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/account" element={<Account/>}/>
                        <Route path="/account/settings" element={<Settings/>}/>
                        <Route path="/account/security" element={<Security/>}/>
                    </Routes>
                </BrowserRouter>
                <ToastContainer draggable />
            </AccountProvider>
        </div>
    )
}

wp.api.loadPromise.done(function () {
    const accountPage = new wp.api.models.Page({id: App.account_page_id});
    accountPage.fetch()
        .done((post) => {
            if (post.routes) {
                const nav = createRoot(
                    document.getElementById('dynamic-sidebar-nav')
                )
                nav.render(<Links routes={post.routes}/>);
            }
        })
})

domReady(() => {
    const root = createRoot(
        document.getElementById('app-account-container')
    );

    root.render(<AccountContainer/>);
});