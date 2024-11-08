//Imports
import { StatusBar } from 'expo-status-bar';
import { Image , Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

//Components




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
                <View></View>
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
        marginTop: '13%',
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
        marginTop: 20,
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
});