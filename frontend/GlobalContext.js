import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [OpenAddPopUp, setOpenAddPopUp] = useState(false);

    return (
        <GlobalContext.Provider value={{ OpenAddPopUp, setOpenAddPopUp }}>
            {children}
        </GlobalContext.Provider>
    );
};