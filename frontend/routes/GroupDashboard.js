//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView, FlatList, Modal, TouchableOpacity, Animated} from 'react-native';
import { Calendar } from 'react-native-calendars';
import React, { useState, useEffect, useRef , useContext} from 'react';
import { useRoute,  useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditPencil , Group } from 'iconoir-react-native';
import { GlobalContext } from '../GlobalContext';
import { TrashSolid } from 'iconoir-react-native';

//Entorno
import { BACKEND_IP } from '@env';


//Components
import AddPopUp from '../components/AddPopUp';
import GroupProfile from '../components/GroupProfile';



export default function GroupDashboard() {
    const [selectedDate, setSelectedDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const scaleValue = useRef(new Animated.Value(0)).current;

    const route = useRoute();
    const { groupID } = route.params;

    const navigation = useNavigation();

    const { CurrentGroup, setCurrentGroup } = useContext(GlobalContext);
    const { OpengroupProfilePopUp, setOpengroupProfilePopUp } = useContext(GlobalContext);

    const [groupInfo, setGroupInfo] = useState(null);

    useEffect(() => {
        console.log('GroupDashboard:', groupID);
        setCurrentGroup(groupID);
    }, [groupID]);

    useEffect(() => {
        if (CurrentGroup) {
            console.log('CurrentGroup:', CurrentGroup);
            fetchTasks();
            getGroupInfo();
        }
    }, [CurrentGroup]);


    //Solicitud al backend para obtener la informacion del grupo

    const getGroupInfo = async () => {
        try {
            const response = await axios.get(`${BACKEND_IP}/api/group/${CurrentGroup}`);
            console.log('Group Info:', response.data);
            setGroupInfo(response.data);
        } catch (error) {
            console.error('Error fetching the group info:', error);
        }
    };

    // Solicitud al backend para obtener las tareas
    const fetchTasks = async () => {
    try {

        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log(userID);

        const response = await axios.get(
            `${BACKEND_IP}/api/tasks/group/all/${CurrentGroup}`,
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

//funcon para terminar una tarea
const finishTask = async () => {
    try {
        const response = await axios.put(
            `${BACKEND_IP}/api/tasks/group/endtask/${selectedTask._id}`,
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
    } catch (error) {
        console.error('Error finishing the task:', error);
    }
};

//funcon para eliminar una tarea
const deleteTask = async () => {
    try {
        const response = await axios.delete(
            `${BACKEND_IP}/api/tasks/group/delete/${selectedTask._id}`,
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
        console.error('Error finishing the task:', error);
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
            <View style={styles.infoContainer}>
                <View></View>
                {groupInfo ? <Text style={styles.header}>{groupInfo.nombre}</Text> : <Text style={styles.header}>Group...</Text>}
                <TouchableOpacity 
                    onPress={() => setOpengroupProfilePopUp(!OpengroupProfilePopUp)}
                >
                    <Group width={24} height={24} color="#FFF" />
                </TouchableOpacity>
            </View>
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
            <GroupProfile />
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
                        <Text style={styles.modalText}>Descripción: {selectedTask.descripcion}</Text>
                        <Text style={styles.modalText}>Fecha de vencimiento: {selectedTask.fecha_vencimiento.split('T')[0]}</Text>
                        <Text style={styles.modalText}>Estado: {selectedTask.estado ? 'Completada' : 'Pendiente'}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => {navigation.navigate('EditTaskFormGroup', {task: selectedTask}, {GroupId: CurrentGroup}); closeModal();}}>
                            <EditPencil width={24} height={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteTask}>
                            <TrashSolid width={24} height={24} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Cerrar</Text>
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
        marginTop: 15,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        color: '#FFFFFF',
    },
    calendar: {
        marginTop: 15,
        width: 350,
        height: 325,
        borderRadius: 30,
        shadowColor: '#e0e0da',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 5,
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
        marginTop: 10,
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
    infoContainer: {
        flexDirection: 'row',
        backgroundColor: '#B4A593',
        marginTop: 30,
        width: '85%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 50,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});