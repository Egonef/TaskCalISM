import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [OpenAddPopUp, setOpenAddPopUp] = useState(false);
    const [LoggedIn, setLoggedIn] = useState(false);
    return (
        <GlobalContext.Provider value={{ OpenAddPopUp, setOpenAddPopUp, LoggedIn, setLoggedIn}}>
            {children}
        </GlobalContext.Provider>
    );
};