//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView, FlatList, Modal, TouchableOpacity, Animated} from 'react-native';
import { Calendar } from 'react-native-calendars';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditPencil } from 'iconoir-react-native';

//Entorno
import { BACKEND_IP } from '@env';


//Components
import AddPopUp from '../components/AddPopUp';



export default function UserCalendar() {
    const [selectedDate, setSelectedDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const scaleValue = useRef(new Animated.Value(0)).current;

    const [groups, setGroups] = useState([]);


    const getGroups = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_IP}/api/group`);
            console.log(response.data);
            setGroups(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>Your Groups</Text>
            <View style={styles.taskContainer}>
                <FlatList
                    data={groups}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity >
                            <View style={styles.listcard}>
                                <Text style={styles.textList}>{item.nombre}</Text>
                            </View>
                        </TouchableOpacity>
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
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
    },
    listcard: {
        width: '100%',
        height: 130,
        backgroundColor: '#B5C18E',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        padding: 20,
        
    },
    textList: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    taskContainer: {
        width: '100%',
        height: '100%',
        alignContent: 'center',
        padding: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 315,
        height: 315,
        backgroundColor: '#B5C18E',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#B4A593',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});