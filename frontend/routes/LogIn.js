//Imports
import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , TextInput, Button} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

//Components
import Googlesvg from '../components/SvgComponents/LogIn/Googlesvg';
import { G } from 'react-native-svg';


export default function LogIn() {

    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");

    }
    ,[])

    return (
        <View style={styles.container}>
            <Text style={styles.AppName}>TaskCal</Text>
            <TextInput placeholder="Username" style={styles.input} ></TextInput>
            <TextInput placeholder="Password" style={styles.input} ></TextInput>
            <Pressable style={styles.button} onPress={() => setLoggedIn(true)} >
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>Or</Text>
                <View style={styles.separator} />
            </View>
            <View style={styles.externalLogin}>
                <View style={styles.externalLoginBox}>
                    <Googlesvg width={50} height={50} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    AppName: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 80,
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderBottomWidth: 2,
        borderColor: '#B5C18E',
        fontSize: 17,
    },
    button: {
        width: '40%',
        height: 40,
        backgroundColor: '#B5C18E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 100,
        width: '80%',
        justifyContent: 'space-around',
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '40%',
        opacity: 0.5,
    },
    separatorText: {
        fontSize: 18,
        opacity: 0.5,
    },
    externalLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    externalLoginBox: {
        width: 60,
        height: 60,
        backgroundColor: '#B5C18E',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


