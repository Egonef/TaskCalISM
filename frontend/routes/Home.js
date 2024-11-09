//Imports
import { StatusBar } from 'expo-status-bar';
import { Image , Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

//Components
import Weathersvg from '../components/SvgComponents/Home/Weathersvg1';
import WeathersvgShadow from '../components/SvgComponents/Home/Weathersvg1Shadow';
import Weathersvg2 from '../components/SvgComponents/Home/Weathersvg2';
import Weathersvg2Shadow from '../components/SvgComponents/Home/Weathersvg2Shadow';


export default function Home() {

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
                    <Weathersvg style={styles.weathersvg} />
                    <WeathersvgShadow style={styles.weathersvgShadow} />
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
                <FlatList style={styles.taskList} horizontal={true} showsHorizontalScrollIndicator={false}
                    data={[
                        { key: 'Task 1' },
                        { key: 'Task 2' },
                        { key: 'Task 3' },
                        { key: 'Task 4' },
                        { key: 'Task 5' },
                        { key: 'Task 6' },
                        { key: 'Task 7' },
                        { key: 'Task 8' },
                        { key: 'Task 9' },
                        { key: 'Task 10' },
                    ]}
                    renderItem={({ item }) => <Shadow offset={[10,15]} distance={3}><View style={styles.taskcard}><Text>{item.key}</Text></View></Shadow>}
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