//Imports
import React from 'react';
import { useRef , useEffect , useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import { GlobalContext } from './GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';




//Components
import Navbar from './components/Navbar';
import LogIn from './routes/LogIn';
import Register from './routes/Register'
import Home from './routes/Home';
import UserCalendar from './routes/UserCalendar';
import Groups from './routes/Groups';
import Notifications from './routes/Notifications';
import TaskForm from './routes/TaskForm';



const Stack = createStackNavigator();

export default function MainApp() {

    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                setLoggedIn(true);
            }
        };

        checkLoginStatus();
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={LoggedIn ? "Home" : "LogIn"}
                screenOptions={{
                    headerShown: false, // Ocultar el header
                }}
            >
                {!LoggedIn ? (
                    <>
                        <Stack.Screen name="LogIn" component={LogIn} />
                        <Stack.Screen name="Register" component={Register} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Calendar" component={UserCalendar} />
                        <Stack.Screen name="Groups" component={Groups} />
                        <Stack.Screen name="Notifications" component={Notifications} />
                        <Stack.Screen name="TaskForm" component={TaskForm} />
                    </>
                )}
            </Stack.Navigator>
                {LoggedIn && <Navbar />}
            </NavigationContainer>
    );
}

