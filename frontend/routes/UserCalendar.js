//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Entorno
import { BACKEND_IP } from '@env';


//Components
import AddPopUp from '../components/AddPopUp';



export default function UserCalendar() {
    const [selectedDate, setSelectedDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

    useEffect(() => {
        fetchTasks(setTasks);
    }, []);


    // Solicitud al backend para obtener las tareas
const fetchTasks = async () => {
    try {
        const response = await axios.get(
            `${BACKEND_IP}/api/tasks/user/6751da7588909b8e2b3093e1`,
            {
                params: {
                    id_categoria_usuario: "675ab3f6a485eb13b594132a"
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        setTasks(response.data);
        console.log('Tasks:', response.data);
    } catch (error) {
        console.error('Error fetching the tasks:', error);
    }
};

const handleDayPress = (day) => {
    console.log('Day pressed:', day.dateString);
    setSelectedDate(day.dateString);
    const filteredTasks = tasks.filter(task => {
        if (!task.fecha_vencimiento) {
            console.log('no hay tareas con esa fecha');
            return false;
        }
        const taskDate = task.fecha_vencimiento.split('T')[0]; // Eliminar la hora de la fecha
        console.log('Task Date:', taskDate, 'Selected Date:', day.dateString);
        return taskDate === day.dateString;
    });
    console.log('Filtered Tasks:', filteredTasks);
    setTasksForSelectedDate(filteredTasks);
};




    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: '#B5C18E' },
                }}
                theme={{
                    selectedDayBackgroundColor: '#B5C18E',
                    todayTextColor: '#B5C18E',
                    calendarBackground: '#fff',
                    arrowColor: '#B5C18E',
                    textMonthFontWeight: 'bold',
                }}
                style={styles.calendar}
            />
             <FlatList
                data={tasksForSelectedDate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskContainer}>
                        <Text style={styles.taskName}>{item.nombre}</Text>
                    </View>
                )}
            />
            <AddPopUp />
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    calendar: {
        marginTop: 55,
        width: 350,
        height: 325,
        borderRadius: 30,
        shadowColor: '#e0e0da',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 5,
        

    },
    taskName: {
        fontSize: 18,
        marginVertical: 10,
    },
});