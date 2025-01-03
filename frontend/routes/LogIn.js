//Imports
import React, { useContext, useEffect, useState , useRef } from 'react';
import axios from 'axios';
import { StyleSheet, Text, Animated , View, Pressable , TextInput, Button} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Components
import Googlesvg from '../components/SvgComponents/LogIn/Googlesvg';
import { G } from 'react-native-svg';

//Entorno
import { BACKEND_IP } from '@env';

export default function LogIn() {

    const navigation = useNavigation();
    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

    const [nombre_usuario, setNombre_usuario] = useState('');
    const [contraseña, setContraseña] = useState('');


    // Solicitud al backend para comrpbar el inicio de sesión
    const checkLogin = async () => {
        console.log('Checking login...');
        try {
            const response = await axios.post(`${BACKEND_IP}/api/user/login`, {
                nombre_usuario,
                contraseña,
            });
            console.log('Usuario y contraseña correctos:', response.data);
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));

            const info = await AsyncStorage.getItem('userInfo');
            console.log('Logged in session:', JSON.parse(info));
            setLoggedIn(true)
        } catch (error) {
            console.error('Usuario incorrecto:', "Inténtalo de nuevo");
        }
    };

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");

    }
    ,[])

    return (
        <View style={styles.container}>
            <Text style={styles.AppName}>TaskCal</Text>
            <TextInput
                placeholder="Nombre de usuario"
                style={styles.input}
                value={nombre_usuario}
                onChangeText={setNombre_usuario}
            />
            <TextInput
                placeholder="Contraseña"
                style={styles.input}
                value={contraseña}
                onChangeText={setContraseña}
                secureTextEntry
            />
            <Pressable style={styles.button} onPress={() => checkLogin()} >
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>Or</Text>
                <View style={styles.separator} />
            </View>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Register')} >
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
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


