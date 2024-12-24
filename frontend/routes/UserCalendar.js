//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import React, { useState } from 'react';


//Components
import AddPopUp from '../components/AddPopUp';

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
        console.log('Tasks fetched:', response.data);
        //setTasks(response.data);
    } catch (error) {
        console.error('Error fetching the tasks:', error);
    }
};

export default function UserCalendar() {
    const [selectedDate, setSelectedDate] = useState('');
    const [tasks, setTasks] = useState([
        { id: '1', date: '2024-12-01', task: 'Task 1' },
        { id: '2', date: '2024-12-01', task: 'Task 2' },
        { id: '3', date: '2024-12-02', task: 'Task 3' },
    ]);

    const tasksForSelectedDate = tasks.filter(task => task.date === selectedDate);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
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
                keyExtractor={item => item.id}
                renderItem={({ item }) => <Text style={styles.task}>{item.task}</Text>}
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
    task: {
        fontSize: 18,
        marginVertical: 10,
    },
});