//Imports
import React, { useContext, useEffect, useRef , useState } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , TextInput, Button , TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';


//Entorno
import { BACKEND_IP } from '@env';


//Components
import SuccessModal from '../components/SuccessModal';


export default function TaskForm() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [id_categoria_usuario, setCategoria] = useState('');
    const [fecha_vencimiento, setFecha_vencimiento] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [categories, setCategories] = useState([]);

    const userID = AsyncStorage.getItem('userInfo')._id;

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#F1F1F1");
        NavigationBar.setButtonStyleAsync("dark");

    //Solicitud al backend para obtener las categorias
    const fetchCategories = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log(userID);
        try {
            const response = await axios.get(`${BACKEND_IP}/api/categories/user/${userID}`);
            console.log('Lists:', response.data);
            const categoryOptions = response.data.map(category => ({
                label: category.nombre,
                value: category._id,
            }));
            setCategories(categoryOptions);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

        fetchCategories();
    }, []);

    const createTask = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;
        console.log(userID);
        try {
            const response = await axios.post(`${BACKEND_IP}/api/tasks/user/${userID}`, {
                nombre,
                descripcion,
                fecha_vencimiento,
                id_categoria_usuario
            });
            console.log('Task created:', response.data);
            setIsSuccessModalVisible(true);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <Text style={styles.AppName}>Fill task info</Text>
            <TextInput
                placeholder="Header"
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                placeholder="Description"
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
            />
            <TextInput
                placeholder="Due date"
                style={styles.input}
                value={fecha_vencimiento}
                onChangeText={setFecha_vencimiento}
            />
            <RNPickerSelect
                onValueChange={(value) => setCategoria(value)}
                items={categories}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a category", value: null }}
                
            />
            <TouchableOpacity style={styles.button} onPress={createTask}>
                <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
            <SuccessModal
                visible={isSuccessModalVisible}
                onClose={() => setIsSuccessModalVisible(false)}
            />
        </KeyboardAvoidingView>
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


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        width: '80%',
        alignSelf: 'center',
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        width: '80%',
        alignSelf: 'center',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});