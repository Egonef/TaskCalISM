//Imports
import React, { useContext, useEffect, useRef , useState } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , TextInput, Button} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import axios from 'axios'

//Components



export default function Register() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");
    }, []);

    const registerUser = async () => {
        try {
            const response = await axios.post('http://172.21.10.131:3000/api/register', {
                username,
                name,
                birthdate,
                password
            });
            console.log('User registered:', response.data);
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
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="Birthdate"
                style={styles.input}
                value={birthdate}
                onChangeText={setBirthdate}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
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


