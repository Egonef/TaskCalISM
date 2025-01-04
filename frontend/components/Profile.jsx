//Imports
import React, { useContext, useEffect, useRef , useState } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , Image, TouchableOpacity,  TextInput  } from 'react-native';
import { GlobalContext } from '../GlobalContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//Entorno
import { BACKEND_IP } from '@env';

//Components
import ClosePopUp from '../components/SvgComponents/Profile/ClosePopUp'
import Edit from '../components/SvgComponents/Profile/Edit'
import SuccessModal from '../components/SuccessModal';

export default function Profile() {
    //Para controlar las animaciones
    const { OpenProfilePopUp, setOpenProfilePopUp } = useContext(GlobalContext);
    const horizontalAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const exitAnim = useRef(new Animated.Value(1)).current;
    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
    const [Password, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    
    const navigation = useNavigation();

    //Para cerrar la sesión (Provisional)
    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);

    const [userInfo, setUserInfo] = useState({});
    //Funcion para sacar la información del usuario
    const getUserInfo = async () => {
        const userInfo = await AsyncStorage.getItem('userInfo');
        console.log('User Info:', JSON.parse(userInfo));
        setUserInfo(JSON.parse(userInfo));
    }

    const handleChangePassword = async () => {
        if (Password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const userInfo = await AsyncStorage.getItem('userInfo');
        const userID = JSON.parse(userInfo)._id;

        try {
            const response = await axios.put(`${BACKEND_IP}/api/user/modifyPassword/${userID}`, {
                contraseña: Password,
            });
            console.log('Password changed:', response.data);
            setIsSuccessModalVisible(true);
            setIsChangePasswordVisible(false);

            // Limpiar la información del usuario de AsyncStorage y redirigir a la pantalla de inicio de sesión
            handleLogOut();

        } catch (error) {
            console.error('Error changing password:', error);
        }
    };


    useEffect(() => {
        getUserInfo();
    },[]);

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
            <Text style={styles.text}>{userInfo.nombre_usuario}'s Profile</Text>
            <View style={{ height: 200 }}>
                <Image style={styles.profileImage} source={require('../assets/pingu.png')} />
                <Pressable
                    style={styles.editButton}
                    onPress={() => console.log('Change Profile Picture')}
                    onPressIn={() => handlePressIn(exitAnim)}
                    onPressOut={() => handlePressOut(exitAnim)}
                >
                    <Animated.View style={{ transform: [{ scale: exitAnim }] }}>
                        <Edit onPress={() => {navigation.navigate('EditProfile')}}/>
                    </Animated.View>
                </Pressable>
            </View>
            <View style={styles.buttoncontainer}>
                <Pressable
                    style={styles.logoutButton}
                    onPress={() => handleLogOut()}
                >
                    <Animated.View style={{ transform: [{ scale: exitAnim }] }}>
                        <Text style={styles.text}>Log Out</Text>
                    </Animated.View>
                </Pressable>
                <TouchableOpacity style={styles.button} onPress={() => setIsChangePasswordVisible(!isChangePasswordVisible)}>
                    <Text style={styles.text}>Change password</Text>
                </TouchableOpacity>
                {isChangePasswordVisible && (
                <View style={styles.changePasswordContainer}>
                    <TextInput
                        placeholder="New Password"
                        style={styles.input}
                        secureTextEntry
                        value={Password}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )}
            <SuccessModal
                visible={isSuccessModalVisible}
                onClose={() => setIsSuccessModalVisible(false)}
            />
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
        width: '25%',
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
    changePasswordContainer: {
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderBottomWidth: 2,
        borderColor: '#FFF',
        fontSize: 17,
    },
    button: {
        width: '50%',
        height: 40,
        backgroundColor: '#B4A593',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    buttoncontainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
});


