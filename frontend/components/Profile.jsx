//Imports
import React, { useContext, useEffect, useRef  } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , Image } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Components
import ClosePopUp from '../components/SvgComponents/Profile/ClosePopUp'
import Edit from '../components/SvgComponents/Profile/Edit'

export default function AddPopUp() {
    //Para controlar las animaciones
    const { OpenProfilePopUp, setOpenProfilePopUp } = useContext(GlobalContext);
    const horizontalAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const exitAnim = useRef(new Animated.Value(1)).current;


    //Para cerrar la sesión (Provisional)
    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

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

    const handleLogOut = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('userInfo');
        setLoggedIn(false);
    };

    return (
        <Animated.View style={[styles.container, { left: horizontalAnim }]}>
            <Text style={styles.text}>Your Profile</Text>
            <View style={{ height: 200 }}>
                <Image style={styles.profileImage} source={require('../assets/pingu.png')} />
                <Pressable
                    style={styles.editButton}
                    onPress={() => console.log('Change Profile Picture')}
                    onPressIn={() => handlePressIn(exitAnim)}
                    onPressOut={() => handlePressOut(exitAnim)}
                >
                    <Animated.View style={{ transform: [{ scale: exitAnim }] }}>
                        <Edit />
                    </Animated.View>
                </Pressable>
            </View>
            <View>
                <Pressable
                    style={styles.logoutButton}
                    onPress={() => handleLogOut()}
                >
                    <Animated.View style={{ transform: [{ scale: exitAnim }] }}>
                        <Text style={styles.text}>Log Out</Text>
                    </Animated.View>
                </Pressable>
            </View>
            <Animated.View style={[styles.exitContainer, { opacity: buttonAnim }]}>
                <Pressable
                    style={styles.exitButton}
                    onPress={() => setOpenProfilePopUp(!OpenProfilePopUp)}
                    onPressIn={() => handlePressIn(exitAnim)}
                    onPressOut={() => handlePressOut(exitAnim)}
                >
                    <Animated.View style={{ transform: [{ scale: exitAnim }] }}>
                        <ClosePopUp />
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
        justifyContent: 'start',
        paddingTop: 40,
        zIndex: 4,
    },
    exitContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        transform: [{ translateY: -30 }],
        width: '15%',
    },
    exitButton: {
        backgroundColor: '#B4A593',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        height: 50,
        justifyContent: 'center',
    },
    editButton: {
        height: 30,
        transform: [{ translateX: 75 }, { translateY: -25 }],
        justifyContent: 'center',
    },
    logoutButton: {
        backgroundColor: '#B4A593',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
    },
});


