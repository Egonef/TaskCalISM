import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [OpenAddPopUp, setOpenAddPopUp] = useState(false);
    const [OpenProfilePopUp, setOpenProfilePopUp] = useState(false);
    const [LoggedIn, setLoggedIn] = useState(false);

    return (
        <GlobalContext.Provider value={{ OpenAddPopUp, setOpenAddPopUp, OpenProfilePopUp, setOpenProfilePopUp , LoggedIn, setLoggedIn}}>
            {children}
        </GlobalContext.Provider>
    );
};