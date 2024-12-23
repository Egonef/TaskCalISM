import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated , View, Pressable } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';



//El rendimiento de la aplicacion se puede mejorar haciendo que este componente se esconda en la barra de navegacion en lugar de en cada pagina, pero hay que cambiar el sistema mediante el que detecta en que pagina esta




export default function AddPopUp() {
    const route = useRoute();
    const { OpenAddPopUp } = useContext(GlobalContext);
    const { OpenProfilePopUp, setOpenProfilePopUp } = useContext(GlobalContext);
    const horizontalAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const scaleTask = useRef(new Animated.Value(1)).current;
    const scaleList = useRef(new Animated.Value(1)).current;
    const scaleGroup = useRef(new Animated.Value(1)).current;

    //route.name devuelve el nombre de la pagina actual

    //Use Effect para animar el popUp cuando se detecta que se abre o cierra
    useEffect(() => {
        Animated.timing(horizontalAnim, {
            toValue: OpenProfilePopUp ? 0 : -450, // Cambia la altura a 300 si OpenAddPopUp es true, de lo contrario a 0
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(buttonAnim, {
            toValue: OpenProfilePopUp ? 1 : 0,
            duration: OpenProfilePopUp ? 600 : 200,
            useNativeDriver: false,
        }).start();
    }, [OpenProfilePopUp]);

    const handlePressIn = (anim) => {
        Animated.spring(anim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (anim) => {
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };


    return (
        <Animated.View style={[styles.container, { left: horizontalAnim }]}>
            <Text>prueba</Text>
            <Animated.View style={[styles.buttonContainer, { opacity: buttonAnim }]}>
                <Pressable 
                    style={styles.createButton} 
                    onPress={() => setOpenProfilePopUp(!OpenProfilePopUp)}
                >
                    <Animated.View style={{ transform: [{ scale: scaleTask }] }}>
                        <Text style={styles.text}>Add Task</Text>
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#B5C18E',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4,
    },
    buttonContainer: {
        transform: [{ translateY: -30 }],
        width: '90%',
    },
    createButton: {
        backgroundColor: '#B4A593',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        height: 50,
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
});


