import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated , View } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';



//El rendimiento de la aplicacion se puede mejorar haciendo que este componente se esconda en la barra de navegacion en lugar de en cada pagina, pero hay que cambiar el sistema mediante el que detecta en que pagina esta




export default function AddPopUp() {
    const route = useRoute();
    const { OpenAddPopUp } = useContext(GlobalContext);
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: OpenAddPopUp ? 300 : 80, // Cambia la altura a 300 si OpenAddPopUp es true, de lo contrario a 0
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [OpenAddPopUp]);

    return (
        <Animated.View style={[styles.container, { height: heightAnim }]}>
            { route.name === 'Groups' 
                ? <Text>Estoy en Groups</Text>
                : <Text>Estoy en donde sea que no es Groups</Text>
            }
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#B4A593',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
});


