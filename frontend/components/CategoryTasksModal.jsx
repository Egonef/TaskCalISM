import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import axios from 'axios';
import { BACKEND_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryTasksModal = ({ visible, onClose, categoryId }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchTasks();
        }
    }, [visible]);

    const fetchTasks = async () => {
        try {

            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;
            console.log(userID);
            const response = await axios.get(
                `${BACKEND_IP}/api/tasks/user/${userID}`,
                {
                    params: {
                        id_categoria_usuario: categoryId,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Tasks:', response.data);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching the tasks:', error);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.header}>Monthly tasks</Text>
                    <FlatList
                        data={tasks}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.taskCard}>
                                <Text style={styles.taskText}>{item.nombre}</Text>
                                <Text style={styles.taskText2}>{item.descripcion}</Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        height: 700,
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
    },
    taskCard: {
        backgroundColor: '#B5C18E',
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 15,

        padding: 10,
        flexDirection: 'row',
    },
    taskText: {
        flex: 1,
        fontSize: 20,
    },
    taskText2: {
        flex: 1,
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#B5C18E',
        borderRadius: 15,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CategoryTasksModal;