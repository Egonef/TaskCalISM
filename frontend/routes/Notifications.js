//Imports
import { StatusBar } from 'expo-status-bar';
import React, { useState , useEffect} from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList , TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TrashSolid } from 'iconoir-react-native';



//Entorno
import { BACKEND_IP } from '@env';



//Components
import AddPopUp from '../components/AddPopUp';



export default function Notifications() {

    const [notifications, setNotifications] = useState([]);

    //Funcion para obtener las notificaciones

    const getNotifications = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log("Entrando a getNotifications");
        try {
            const res = await axios.get(`${BACKEND_IP}/api/notification/${userID}`);

            // Filtrar notificaciones duplicadas
            const filteredNotifications = [];
            const descrptions = new Set();

            for (const notification of res.data) {
                if (notification.titulo === 'Invitacion a Grupo') {
                    filteredNotifications.push(notification);
                } else if (!descrptions.has(notification.descripcion)) {
                    descrptions.add(notification.descripcion);
                    filteredNotifications.push(notification);
                } else {
                    // Eliminar notificación duplicada
                    await deleteNotification(notification._id);
                }
            }

            console.log('Notifications:', res.data);
            //Le damos la vuelta al vector antes de guardarlo
            filteredNotifications.reverse();
            setNotifications(filteredNotifications);
            console.log('Notifications guardadas:', notifications);
        }catch (error) {
            console.error('Error creating lists:', error);
        }
    }
    //Funcion para obtener las notificaciones
    useEffect(() => {
        getNotifications();
    },[]);

    const deleteNotification = async (notifId) => {
        console.log("Entrando a deleteNotifications");
        try {
            const res = await axios.delete(`${BACKEND_IP}/api/notification/delete/${notifId}`);
            console.log('Notification deleted:', res.data);
            getNotifications();
        }catch (error) {
            console.error('Error creating lists:', error);
        }
    }

    //Funcion para unirse a un grupo

    const joinGroup = async (groupId) => {
        console.log("Entrando a joinGroup");
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        try {
            const res = await axios.put(`${BACKEND_IP}/api/user/invitation/${groupId}`, {
                id_usuario: userID,
            });
            console.log('Joined group:', res.data);
            getNotifications();
        }catch (error) {
            console.error('Error creating lists:', error);
        }
    }


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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.notificationTitle}>
                                    {item.titulo}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        deleteNotification(item._id);
                                    }}
                                >
                                    <TrashSolid  width={24} height={24} color="#FFF"/>
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                <Text>{item.descripcion}</Text>
                            </ScrollView>
                            {item.titulo === 'Invitacion a Grupo' ? 
                            <TouchableOpacity style={styles.joinButton}
                                onPress={() => {
                                    joinGroup(item.id_grupo);
                                }}
                            >
                                <Text style={styles.joinText} >Join Group</Text>
                            </TouchableOpacity> 
                            : null}
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
        height: 160,
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
    joinButton: {
        backgroundColor: '#B4A593',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    joinText: {
        color: 'white',
    },
});