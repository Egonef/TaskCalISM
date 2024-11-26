//Imports
import { StatusBar } from 'expo-status-bar';
import { Image , Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import axios from 'axios';
import React from 'react';
import { useEffect ,useState } from 'react';

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

//Clave de la api de openweather(Pasar a .env)
const WEATHER_API = '0410f4e1d48e8b7de2f6529d00e3560f';
//Direccion ip del backend (Cambiar para desarrollo)
const BACKEND_IP = '87.223.128.77';

export default function Home() {

    //Estado para la temperatura (Asi controlamos que se haya cargado la temperatura)
    const [temperature, setTemperature] = useState(null);
    //Estado para el clima
    const [weather, setWeather] = useState(null);
    //Estado para las tareas
    const [tasks, setTasks] = useState(null);

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

    //Funcion para obtener los dias de la semana
    const getWeekDays = () => {
        let today = new Date();
        let day = today.getDay();
        let days = [];
        for (let i = 0; i < 7; i++) {
            days.push(today.getDate() - day + i + 1);
            console.log(days[i]);
        }
        return days;
    }

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

    //Solicitud al backend para obtener las tareas
    const fetchTasks = async () => {
        try {
            console.log('Fetching the tasks...');
            const response = await axios.get(`http://${BACKEND_IP}:3000/api/tasks`);
            console.log('Tasks fetched:', response.data);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching the tasks:', error);
        }
    };

    //Solicitud al backend para obtener las listas
    const fetchLists = async () => {
        try {
            console.log('Fetching the lists...');
            const response = await axios.get(`http://${BACKEND_IP}:3000/api/lists`);
            console.log('Lists fetched:', response.data);
            setLists(response.data);
        } catch (error) {
            console.error('Error fetching the lists:', error);
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

        fetchTasks();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.profileGreeting}>
                <View >
                    <Text style={styles.headerText}>{greet()}</Text>
                    <Pressable style={styles.profileButton}>
                        <Image style={styles.profileImage} source={require('../assets/pingu.png')} />
                    </Pressable>
                </View>
                <View style={styles.weatherContainer}>
                    {weather == 'Clear' ? <Sunsvg style={styles.climateIcon} /> 
                    : weather == 'Clouds' ?  <Cloudsvg style={styles.climateIcon}/> 
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
                <Text style={styles.headerText}>Tasks</Text>
            </View>
            <View style={styles.tasksContainer}>
                <FlatList style={styles.taskList} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                data={tasks}
                renderItem={({ item }) => 
                    <Shadow offset={[10,15]} distance={3}>
                        <View style={styles.taskcard}>
                            <Text>{item.descripcion}</Text>
                        </View>
                    </Shadow>}
                />
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.headerText}>Lists</Text>
                <View style={styles.listList} >
                    <FlatList horizontal={false} showsVerticalScrollIndicator={false}
                        data={[
                            { key: 'List 1' },
                            { key: 'List 2' },
                            { key: 'List 3' },
                            { key: 'List 4' },
                            { key: 'List 5' },
                        ]}
                        renderItem={({ item }) => 
                        <View style={styles.tasksContainer}>
                                <View style={styles.listcard}>
                                    <Text style={styles.textList}>{item.key}</Text>
                                    <Pressable>
                                        <Text>+</Text>
                                    </Pressable>
                                </View>
                        </View>}
                    />
                </View>
            </View>
            <AddPopUp />
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
        height: 250,
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
    textList: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
});