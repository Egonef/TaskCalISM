import React from 'react';
import { GlobalProvider } from './GlobalContext';
import MainApp from './MainApp';

export default function App() {
    return (
        <GlobalProvider>
            <MainApp />
        </GlobalProvider>
    );
}