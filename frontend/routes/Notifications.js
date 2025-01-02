//Imports
import { StatusBar } from 'expo-status-bar';
import React, { useState , useEffect} from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_IP } from '@env';



//Components
import AddPopUp from '../components/AddPopUp';



export default function Notifications() {

    const [notifications, setNotifications] = useState([]);

    //Funcion para obtener las notificaciones
    const getNotifications = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        try {
            const res = await axios.get(`${BACKEND_IP}/api/notification/${userID}`);
            setNotifications(res.data);
        }catch (error) {
            console.error('Error creating lists:', error);
        }
    }


    useEffect(() => {
        getNotifications();
    },[]);


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>Your Inbox</Text>
            <View>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.title}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    )}
                />
            </View>
            <AddPopUp />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 30,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
    },
});