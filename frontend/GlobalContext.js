import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [OpenAddPopUp, setOpenAddPopUp] = useState(false);
    const [OpenProfilePopUp, setOpenProfilePopUp] = useState(false);
    const [LoggedIn, setLoggedIn] = useState(false);

    const [CurrentGroup, setCurrentGroup] = useState(null);

    return (
        <GlobalContext.Provider value={{ 
            OpenAddPopUp, setOpenAddPopUp, 
            OpenProfilePopUp, setOpenProfilePopUp , 
            LoggedIn, setLoggedIn,
            CurrentGroup, setCurrentGroup,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};