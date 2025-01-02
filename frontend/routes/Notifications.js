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
    useEffect(() => {
        const getNotifications = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;
            console.log("Entrando a getNotifications");
            try {
                const res = await axios.get(`${BACKEND_IP}/api/notification/${userID}`);
                console.log('Notifications:', res.data);
                setNotifications(res.data);
                console.log('Notifications guardadas:', notifications);
            }catch (error) {
                console.error('Error creating lists:', error);
            }
        }

        getNotifications();
    },[]);


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>Your Inbox</Text>
            <View style={styles.notificationContainer}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.notificationCard}>
                            <Text style={styles.notificationTitle}>
                                {item.titulo}
                            </Text>
                            <Text>{item.descripcion}</Text>
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
    notificationContainer: {
        width: '100%',
        height: '80%',
        padding: 10,
        margin: 10,
    },
    notificationCard: {
        borderRadius: 10,
        height: 150,
        backgroundColor: '#B5C18E',
        padding: 10,
        margin: 10,
        borderColor: '#B4A593',
        borderWidth: 2,
    },
    notificationTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    notificationDescription: {
        fontSize: 14,
    },
});