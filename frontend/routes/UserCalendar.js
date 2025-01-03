//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView, FlatList, Modal, TouchableOpacity, Animated} from 'react-native';
import { Calendar } from 'react-native-calendars';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditPencil } from 'iconoir-react-native';
import { useRoute , useNavigation} from '@react-navigation/native';
import { TrashSolid } from 'iconoir-react-native';

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

    const navigation = useNavigation();

    useEffect(() => {
        fetchTasks(setTasks, setMarkedDates);
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [modalVisible]);

    // Solicitud al backend para obtener las tareas
    const fetchTasks = async () => {
    try {

        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log(userID);

        const response = await axios.get(
            `${BACKEND_IP}/api/tasks/user/all/${userID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        setTasks(response.data);
        //console.log('Tasks:', response.data);

        // Crear el objeto markedDates
        const markedDates = {};
        response.data.forEach(task => {
            if (!task.fecha_vencimiento) {
                console.log('Task without fecha_vencimiento:', task);
                return;
            }
            const taskDate = task.fecha_vencimiento.split('T')[0]; // Eliminar la hora de la fecha
            if (!markedDates[taskDate]) {
                markedDates[taskDate] = { dots: [], marked: true };
            }
            markedDates[taskDate].dots.push({ color: task.estado ? '#EADBC8' : '#B5C18E' });
        });
        setMarkedDates(markedDates);


    } catch (error) {
        console.error('Error fetching the tasks:', error);
    }
};

//funcion para finalizar una tarea
const finishTask = async () => {
    try {
        const response = await axios.put(
            `${BACKEND_IP}/api/tasks/user/endtask/${selectedTask._id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Task finished:', response.data);
        setSelectedTask({ ...selectedTask, estado: true });
        // Actualizar la lista de tareas
        fetchTasks();
        //handleDayPress(selectedDate);
    } catch (error) {
        console.error('Error finishing the task:', error);
    }
};

//funcion para eliminar una tarea
const deleteTask = async () => {
    try {
        const response = await axios.delete(
            `${BACKEND_IP}/api/tasks/user/delete/${selectedTask._id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Task deleted:', response.data);
        // Actualizar la lista de tareas
        fetchTasks();
        closeModal();
        handleDayPress(selectedDate);
    } catch (error) {
        console.error('Error deleting the task:', error);
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

    const handleTaskPress = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };






    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Calendar
                enableSwipeMonths={true}
                onDayPress={handleDayPress}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: { selected: true, marked: true, selectedColor: '#B5C18E' },
                }}
                markingType={'multi-dot'}
                theme={{
                    selectedDayBackgroundColor: '#B5C18E',
                    todayTextColor: '#B5C18E',
                    calendarBackground: '#fff',
                    arrowColor: '#B5C18E',
                    textMonthFontWeight: 'bold',
                }}
                style={styles.calendar}
            />
            <View style={styles.taskContainer}>
                <FlatList
                    data={tasksForSelectedDate}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleTaskPress(item)}>
                            <View style={styles.listcard}>
                                <Text style={styles.textList}>{item.nombre}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <AddPopUp />
            {selectedTask && (
                 <Modal
                 animationType="fade"
                 transparent={true}
                 visible={modalVisible}
                 onRequestClose={closeModal}
             >
                 <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{selectedTask.nombre}</Text>
                        <Text style={styles.modalText}>Description: {selectedTask.descripcion}</Text>
                        <Text style={styles.modalText}>Due date: {selectedTask.fecha_vencimiento.split('T')[0]}</Text>
                        <Text style={styles.modalText}>Status: {selectedTask.estado ? 'Complete' : 'Pending'}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => {navigation.navigate('EditTaskForm', {task: selectedTask}); closeModal();}}>
                            <EditPencil width={24} height={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteTask}>
                            <TrashSolid width={24} height={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            {!selectedTask.estado && (
                                    <TouchableOpacity style={styles.closeButton} onPress={finishTask}>
                                        <Text style={styles.closeButtonText}>Finish</Text>
                                    </TouchableOpacity>
                            )}
                        </View>
                     </View>
                 </View>
             </Modal>
            )}
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
        marginVertical: 20,
    },
    calendar: {
        marginTop: 55,
        width: 350,
        height: 365,
        borderRadius: 30,
        shadowColor: '#e0e0da',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 5,
    },
    listcard: {
        width: '100%',
        height: 110,
        backgroundColor: '#B5C18E',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        padding: 20,
        
    },
    textList: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 25,
    },
    taskContainer: {
        width: '100%',
        height: '100%',
        alignContent: 'center',
        padding: 20,
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
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'white',
    },
    modalText: {
        fontSize: 23,
        marginBottom: 10,
        color: 'white',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#B4A593',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: 100,
        height: 55,
        margin: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
        fontSize: 18,
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    deleteButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});