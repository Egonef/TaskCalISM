import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import axios from 'axios';
import { BACKEND_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WarningTriangleSolid } from 'iconoir-react-native';

const CategoryDeleteModal = ({ visible, onClose, categoryId }) => {

    const deleteCategory = async () => {
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;
            console.log(userID);
            const response = await axios.delete(
                `${BACKEND_IP}/api/categories/user/delete/${categoryId}`, {
                    data: { id: categoryId },
                });
            console.log('Category deleted:', response.data);
            onClose();
        } catch (error) {
            console.error('Error deleting the category:', error);
            onClose();
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
                    <WarningTriangleSolid width={50} height={50} color="#c71616" />
                    <Text style={styles.header}>Are you sure you want to delete this category?</Text>
                    <Text style={styles.warningText}>That will delete every task it has assigned</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteCategory}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
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
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    taskText: {
        flex: 1,
        fontSize: 20,
    },
    warningText: {
        flex: 1,
        fontSize: 16,
    },
    closeButton: {
        width: '40%',
        height: 50,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#B5C18E',
        borderRadius: 15,
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    deleteButton: {
        width: '40%',
        height: 50,
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#c71616',
        borderRadius: 15,
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CategoryDeleteModal;