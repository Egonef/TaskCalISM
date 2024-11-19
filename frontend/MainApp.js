//Imports
import React from 'react';
import { useRef , useEffect , useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './routes/Home';
import UserCalendar from './routes/UserCalendar';
import Groups from './routes/Groups';
import Notifications from './routes/Notifications';
import * as NavigationBar from 'expo-navigation-bar';
import { GlobalContext } from './GlobalContext';




//Components
import Navbar from './components/Navbar';
import LogIn from './routes/LogIn';




const Stack = createStackNavigator();

export default function MainApp() {

    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");

    }
    ,[])

    return (
        !LoggedIn ?
            <LogIn />
            :
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

