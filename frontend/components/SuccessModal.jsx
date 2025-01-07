import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { WarningTriangleSolid , ThumbsUp } from 'iconoir-react-native';

const SuccessfulModal = ({ visible, onClose }) => {


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <ThumbsUp width={50} height={50} color="#B5C18E" />
                    <Text style={styles.header}>Operation completed Successfully!</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
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

export default SuccessfulModal;