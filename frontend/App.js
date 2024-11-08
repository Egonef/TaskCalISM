//Imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './routes/Home';
import UserCalendar from './routes/UserCalendar';
import Groups from './routes/Groups';
import Notifications from './routes/Notifications';

//Components
import Navbar from './components/Navbar';




const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false, // Ocultar el header
                }}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Calendar" component={UserCalendar} />
                <Stack.Screen name="Groups" component={Groups} />
                <Stack.Screen name="Notifications" component={Notifications} />
            </Stack.Navigator>
            <Navbar />
        </NavigationContainer>
    );
}

