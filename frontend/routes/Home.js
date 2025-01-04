//Imports
import { StatusBar } from 'expo-status-bar';
import { Image , Pressable, Animated , StyleSheet, Text, TextInput, View , ScrollView , FlatList , Modal, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import axios from 'axios';
import React, { use } from 'react';
import { useEffect ,useState , useContext , useRef} from 'react';
import { GlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrashSolid } from 'iconoir-react-native';
import { EditPencil } from 'iconoir-react-native';
import { useRoute , useNavigation} from '@react-navigation/native';

//Entorno
import { WEATHER_API } from '@env';
import { BACKEND_IP } from '@env';



//Components
import Weathersvg from '../components/SvgComponents/Home/Weathersvg1';
import WeathersvgShadow from '../components/SvgComponents/Home/Weathersvg1Shadow';
import Weathersvg2 from '../components/SvgComponents/Home/Weathersvg2';
import Weathersvg2Shadow from '../components/SvgComponents/Home/Weathersvg2Shadow';
import Sunsvg from '../components/SvgComponents/Home/Sunsvg';
import Cloudsvg from '../components/SvgComponents/Home/Cloudsvg';
import Rainsvg from '../components/SvgComponents/Home/Rainsvg';
import Moonsvg from '../components/SvgComponents/Home/Moonsvg';
import AddPopUp from '../components/AddPopUp';
import Profile from '../components/Profile';
import SkeletonTask from '../components/Skeletons/SkeletonTask';
import CategoryTasksModal from '../components/CategoryTasksModal';
import CategoryDeleteModal from '../components/CategoryDeleteModal';


export default function Home() {

    //Estado para la temperatura (Asi controlamos que se haya cargado la temperatura)
    const [temperature, setTemperature] = useState(null);
    //Estado para el clima
    const [weather, setWeather] = useState(null);
    //Estado para las tareas
    const [tasks, setTasks] = useState(null);
    //Estado para las listas
    const [lists, setLists] = useState(null);

    const [isCategoryTasksModalVisible, setCategoryTasksModalVisible] = useState(false);
    const [isCategoryDeleteModalVisible, setCategoryDeleteModalVisible] = useState(false);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    //Estado para la lista seleccionada
    const [selectedList, setSelectedList] = useState(null);

    //Contexto global para abrir el deplegable del perfil
    const { OpenProfilePopUp , setOpenProfilePopUp } = useContext(GlobalContext);
    //Estado para guardar la tarea seleccionada
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();


    //Animaciones
    const profileAnim = useRef(new Animated.Value(1)).current;

    //Funciones para la animacion de los botones
    const handlePressIn = (anim) => {
        Animated.spring(anim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (anim) => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };


    //Funcion para saludar segun la hora
    const greet = () => {
        let today = new Date();
        let curHr = today.getHours();
        if (curHr < 12) {
            return 'Good Morning!';
        } else if (curHr < 21) {
            return 'Good Afternoon!';
        } else {
            return 'Good Night!';
        }
    }

    //Funcion para obtener el dia de la semana
    const dayofweek = () => {
        let today = new Date();
        let day = today.getDay();
        return day;
    }

    //Obtener el dia del mes
    const getDayNumber = () => {
        let today = new Date();
        let day = today.getDate();
        return day;
    }

    // Función auxiliar para obtener el número de días en el mes
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Función para obtener los días de la semana
    const getWeekDays = () => {
        let today = new Date();
        let day = today.getDay();
        let date = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        let daysInMonth = getDaysInMonth(month, year);
        let days = [];

        for (let i = 0; i < 7; i++) {
            let currentDay = date - day + i + 1;
            if (currentDay > daysInMonth) {
                currentDay -= daysInMonth;
            } else if (currentDay < 1) {
                let prevMonthDays = getDaysInMonth(month - 1, year);
                currentDay += prevMonthDays;
            }
            days.push(currentDay);
        }
        return days;
    };

    //Función para obtener la temperatura con la api de openweather
    const getTemperature = async () => {
        try {
            console.log('Fetching the temperature...');
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cordoba,ES&units=metric&appid=${WEATHER_API}`);
            console.log('Temperature fetched:', response.data.main.temp);
            return response.data.main.temp;
        } catch (error) {
            console.error('Error fetching the temperature:', error);
            return null;
        }
    };

    //Obtenemos el clima con la api de openweather(Clear, Cloud, Drizzle...)
    const fetchWeather = async () => {
        try {
            console.log('Fetching the weather...');
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cordoba,ES&units=metric&appid=${WEATHER_API}`);
            console.log('Weather fetched:', response.data.weather[0].main);
            setWeather(response.data.weather[0].main);
        } catch (error) {
            console.error('Error fetching the weather:', error);
        }
    };


    // Solicitud al backend para obtener las tareas
    const fetchTasks = async () => {

            //Para obtener informacion del usuario de la sesion
            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;
            const listID = selectedList;
            console.log(listID);
            try {
                const response = await axios.get(`${BACKEND_IP}/api/tasks/user/tasksToday/${userID}`);
                console.log('Tasks:', response.data);
                setTasks(response.data);


            } catch (error) {
                console.error('Error creating task:', error);
            }

    };


    //Solicitud al backend para obtener las listas
    const fetchLists = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log(userID);
        try {
            const response = await axios.get(`${BACKEND_IP}/api/categories/user/${userID}`);
            console.log('Lists:', response.data);
            setLists(response.data);
            if (selectedList == null) {
                setSelectedList(response.data[0]._id);
            }

        } catch (error) {
            console.error('Error creating lists:', error);
        }
    };

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
        } catch (error) {
            console.error('Error finishing the task:', error);
        }
    };

    //Funcion para crear una notificion sobre las tareass pendientes para el dia de hoy
    const createPendingTaskUserNotification = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        try {
            const res = await axios.post(`${BACKEND_IP}/api/notification/pendingTaskUser/${userID}`);
            console.log('Notification created:', res.data);
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    //useEffect sive par ejecutar lo de dentro cuando se modifique lo que hay
    // entre los corchetes[], si no hay nada se ejecuta solo una vez al cargar la pagina
    useEffect(() => {
        //Obtenemos la temperatura y nos aseguramos de que la hayamos obtenido antes de mostrarla(await)
        const fetchTemperature = async () => {
            const temp = await getTemperature();
            console.log('Temperature:', temp);
            const roundedTemp = Math.round(temp);
            setTemperature(roundedTemp);
        };
        fetchTemperature();

        fetchWeather();

        fetchLists();

        fetchTasks();

        createPendingTaskUserNotification();
    }, []);

    useEffect(() => {
        console.log('Selected list:', selectedList);
        fetchTasks();
    }, [selectedList]);

    const handleCategoryPress = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCategoryTasksModalVisible(true);
    };

    const handleCategoryDeletePress = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCategoryDeleteModalVisible(true);
    };

    const refreshAfterCategoryDelete = () => {
        fetchLists();
        fetchTasks();
        setCategoryDeleteModalVisible(false);
    };

    const handleTaskPress = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const finish = () => {
        finishTask();
    };



    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.profileGreeting}>
            <View>
                <Text style={styles.headerText}>{greet()}</Text>
                <Animated.View
                    style={{ transform: [{ scale: profileAnim }] }}
                >
                    <Pressable
                        style={styles.profileButton}
                        onPress={() => setOpenProfilePopUp(!OpenProfilePopUp)}
                        onPressIn={() => handlePressIn(profileAnim)}
                        onPressOut={() => handlePressOut(profileAnim)}
                    >
                        <Image style={styles.profileImage} source={require('../assets/pingu.png')} />
                    </Pressable>
                </Animated.View>
            </View>
                <View style={styles.weatherContainer}>
                    {weather == 'Clear' ? <Sunsvg style={styles.climateIcon} /> 
                    : weather == 'Clouds' ?  <Cloudsvg style={styles.climateIcon}/> 
                    : weather == 'Rain' ?  <Rainsvg style={styles.climateIcon}/> 
                    : weather == 'Drizzle' ?  <Rainsvg style={styles.climateIcon}/>
                    : weather == 'Clear' && greet() == 'Good Night!' ?  <Moonsvg style={styles.climateIcon}/> 
                    : <Weathersvg style={styles.climateIcon} />}
                    <Weathersvg style={styles.weathersvg} />
                    <WeathersvgShadow style={styles.weathersvgShadow} />
                    <Text style={styles.temperatureText}>{temperature}°C</Text>
                    <Weathersvg2 style={styles.weathersvg2} />
                    <Weathersvg2Shadow style={styles.weathersvg2Shadow} />
                </View>
            </View>
            <View style={styles.weekdaysContainer}>
                <Shadow offset={[0,4]} distance={3}>
                    <View style={styles.weekdays}>
                        <Pressable style={dayofweek() == 1 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 1 ? styles.texttoday : styles.textday}>M</Text>
                            <Text style={dayofweek() == 1 ? styles.texttoday : styles.textday}>{getWeekDays()[0]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 2 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 2 ? styles.texttoday : styles.textday}>T</Text>
                            <Text style={dayofweek() == 2 ? styles.texttoday : styles.textday}>{getWeekDays()[1]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 3 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 3 ? styles.texttoday : styles.textday}>W</Text>
                            <Text style={dayofweek() == 3 ? styles.texttoday : styles.textday}>{getWeekDays()[2]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 4 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 4 ? styles.texttoday : styles.textday}>T</Text>
                            <Text style={dayofweek() == 4 ? styles.texttoday : styles.textday}>{getWeekDays()[3]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 5 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 5 ? styles.texttoday : styles.textday}>F</Text>
                            <Text style={dayofweek() == 5 ? styles.texttoday : styles.textday}>{getWeekDays()[4]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 6 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 6 ? styles.texttoday : styles.textday}>S</Text>
                            <Text style={dayofweek() == 6 ? styles.texttoday : styles.textday}>{getWeekDays()[5]}</Text>
                        </Pressable>
                        <Pressable style={dayofweek() == 7 ? styles.today : styles.day}>
                            <Text style={dayofweek() == 7 ? styles.texttoday : styles.textday}>S</Text>
                            <Text style={dayofweek() == 7 ? styles.texttoday : styles.textday}>{getWeekDays()[6]}</Text>
                        </Pressable>
                    </View>
                </Shadow>
            </View>
            <View style={styles.taskHeaderWrapper}>
                <Text style={styles.headerText}>Today Tasks</Text>
            </View>
            <View style={styles.tasksContainer}>
                {tasks === null ? (
                    // Mostrar skeleton loading mientras se cargan las tareas
                    <FlatList style={styles.taskList} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        data={[1, 2, 3, 4, 5]} // Datos ficticios para mostrar múltiples skeletons
                        keyExtractor={(item) => item.toString()}
                        renderItem={() => 
                            <View style={styles.skeletonContainer}>
                                <SkeletonTask />
                            </View>
                        }
                    />
                ) : tasks.message === "No tienes tareas pendientes para hoy." ? (
                    // Mostrar mensaje cuando no hay tareas para hoy
                    <View style={styles.taskList}>
                        <Text style={styles.noTasksText}>No pending tasks for today!</Text>
                    </View>
                ) : (
                    // Mostrar las tareas reales una vez cargadas
                    <FlatList style={styles.taskList}  
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        data={tasks}
                    renderItem={({ item }) => 
                        <Shadow offset={[10,15]} distance={3}>

                            <TouchableOpacity style={styles.taskcard} onPress={() => handleTaskPress(item)}>
                                <Text>{item.nombre}</Text>
                            </TouchableOpacity>

                        </Shadow>}
                    />
                )}
            </View>
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
            <View style={styles.listContainer}>
                <Text style={styles.headerText}>Categories</Text>
                <View style={styles.listList} >
                    <FlatList horizontal={false} showsVerticalScrollIndicator={false}
                        data={lists}
                        renderItem={({ item }) => 
                        <View style={styles.tasksContainer}>
                            <TouchableOpacity
                                onPress={() => handleCategoryPress(item._id)}
                            >
                                <View style={styles.listcard}>
                                    <Text style={styles.textList}>{item.nombre}</Text>
                                    <TouchableOpacity onPress={() => {handleCategoryDeletePress(item._id)}}>
                                        <TrashSolid width={24} height={24} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>}
                    />
                </View>
            </View>
            <AddPopUp />
            <Profile />
            <CategoryTasksModal
                visible={isCategoryTasksModalVisible}
                onClose={() => setCategoryTasksModalVisible(false)}
                categoryId={selectedCategoryId}
            />
            <CategoryDeleteModal
                visible={isCategoryDeleteModalVisible}
                onClose={() => refreshAfterCategoryDelete()}
                categoryId={selectedCategoryId}
            />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
    },
    profileGreeting: {
        marginTop: '5%',
        marginLeft: 40,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 30,
        color: '#B4A593',
        fontWeight: 'bold',
    },
    profileButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B4A593',
        marginLeft: 30,
        marginTop: 10,
        borderRadius: 100,
        width: 100,
        height: 100,
    },
    profileImage: {
        width: 100,
        height: 100,
    },
    weatherContainer: {
        marginRight: 18,
    },
    weathersvg: {
        width: 100,
        height: 100,
        transform: [{ translateY: 32 }],
    },
    weathersvgShadow: {
        width: 100,
        height: 100,
        transform: [{ translateY: 35 }],
        position: 'absolute',
        zIndex: -1,
    },
    weathersvg2: {
        width: 100,
        height: 100,
        zIndex: -2,
    },
    weathersvg2Shadow: {
        width: 100,
        height: 100,
        position: 'absolute',
        transform: [{ translateY: 108 }],
        zIndex: -3,
    },
    temperatureText: {
        position: 'absolute',
        transform: [{ translateY: 133 }],
        marginLeft: 25,
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    climateIcon: {
        width: 50,
        height: 50,
        position: 'absolute',
        transform: [{ translateY: 63 }],
        marginLeft: 15,
        zIndex: 1,
    },
    weekdays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 3,
        height: 60,
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    weekdaysContainer: {
        width: '80%',
        marginTop: 10,
    },
    day: {
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: 20,
        width: '13%',
        borderRadius: 10,
    },
    textday: {
        color: '#B4A593',
        fontWeight: 'bold',
    },
    today: {
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: 20,
        backgroundColor: '#B5C18E',
        width: '13%',
        borderRadius: 10,
    },
    texttoday: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    tasksContainer: {
        width: '100%',
    },
    skeletonContainer: {
        margin: 10,
    },
    taskHeaderWrapper: {
        width: '80%',
        marginTop: 20,
    },
    taskList: {
        width: '100%',
        height: 190,
    },
    taskcard: {
        width: 150,
        height: 170,
        backgroundColor: '#B5C18E',
        margin: 10,
        borderRadius: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        width: '80%',
    },
    listList: {
        width: '100%',
        height: 190,
        marginTop: 10,
    },
    listcard: {
        width: '100%',
        height: 50,
        backgroundColor: '#B5C18E',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 15,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    biglistcard: {
        width: '100%',
        height: 70,
        backgroundColor: '#7a9c5a',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 15,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textList: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    noTasksText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});