//Imports
import React, { useContext, useEffect, useRef , useState } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , TextInput, Button} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import axios from 'axios'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Entorno
import { BACKEND_IP } from '@env';


//Components



export default function Register() {
    const [nombre_usuario, setNombre_usuario] = useState('');
    const [nombre, setNombre] = useState('');
    const [fecha_nacimiento, setFecha_nacimiento] = useState('');
    const [contraseña, setContraseña] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");
    }, []);

    //Solicitud al backend para enviar una notificacion de bienvenida
    const createWelcomeNotification = async (userID) => {
        try {
            const response = await axios.post(`${BACKEND_IP}/api/notification/welcome/${userID}`);
            console.log('Welcome notification:', response.data);
        } catch (error) {
            console.error('Error creating welcome notification:', error);
        }
    };


    const registerUser = async () => {
        try {
            const response = await axios.post(`${BACKEND_IP}/api/user/`, {
                nombre_usuario,
                nombre,
                contraseña,
                fecha_nacimiento
            });
            console.log('User registered:', response.data);
            createWelcomeNotification(response.data._id);
            navigation.navigate('LogIn');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.AppName}>TaskCal</Text>
            <TextInput
                placeholder="Username"
                style={styles.input}
                value={nombre_usuario}
                onChangeText={setNombre_usuario}
            />
            <TextInput
                placeholder="Name"
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                placeholder="Date of birth"
                style={styles.input}
                value={fecha_nacimiento}
                onChangeText={setFecha_nacimiento}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={contraseña}
                onChangeText={setContraseña}
                secureTextEntry
            />
            <Pressable style={styles.button} onPress={registerUser}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
        </View>
    );
};

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


