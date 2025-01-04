//Imports
import React, { use, useContext, useEffect, useRef , useState } from 'react';
import { StyleSheet, Text, Animated , View, Pressable , Image , TextInput , TouchableOpacity} from 'react-native';
import { GlobalContext } from '../GlobalContext';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_IP } from '@env';

//Components
import ClosePopUp from '../components/SvgComponents/Profile/ClosePopUp'
import Edit from '../components/SvgComponents/Profile/Edit'
import { FlatList } from 'react-native-gesture-handler';
import SuccessModal from '../components/SuccessModal';


export default function GroupProfile() {
    //Para controlar las animaciones
    const { OpengroupProfilePopUp, setOpengroupProfilePopUp } = useContext(GlobalContext);
    const horizontalAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const exitAnim = useRef(new Animated.Value(1)).current;

    const { CurrentGroup } = useContext(GlobalContext);
    const [groupInfo, setGroupInfo] = useState(null);
    const [usersInfo, setUsersInfo] = useState([]);
    const [invitedUser, setInvitedUser] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    //Para cerrar la sesión (Provisional)
    const { LoggedIn , setLoggedIn } = useContext(GlobalContext);


    //Use Effect para animar el popUp cuando se detecta que se abre o cierra
    useEffect(() => {
        Animated.timing(horizontalAnim, {
            toValue: OpengroupProfilePopUp ? 0 : -450, // Cambia la altura a 300 si OpenAddPopUp es true, de lo contrario a 0
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(buttonAnim, {
            toValue: OpengroupProfilePopUp ? 1 : 0,
            duration: OpengroupProfilePopUp ? 600 : 200,
            useNativeDriver: false,
        }).start();
    }, [OpengroupProfilePopUp]);

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

    // Obtener la información del grupo
    const getGroupInfo = async () => {
        try {
            const response = await axios.get(`${BACKEND_IP}/api/group/${CurrentGroup}`);
            console.log('Group Info:', response.data);
            setGroupInfo(response.data);
        } catch (error) {
            console.error('Error fetching the group info:', error);
        }
    };

    // Funcion para obtener un uuario a partir de su id

    const getUser = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_IP}/api/user/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching the user:', error);
        }
    }

    // Funcion que a partir del vector de id de usuarios de un grupo, devuelve un vector con los usuarios
    const getUsers = async (users) => {
        let usersInfo = [];
        for (let i = 0; i < users.length; i++) {
            const user = await getUser(users[i]._id);
            usersInfo.push(user);
        }
        return usersInfo;
    }

    useEffect(() => {
        if (CurrentGroup) {
            console.log('CurrentGroup:', CurrentGroup);
            getGroupInfo();
        }
    }   , [CurrentGroup]);

    useEffect(() => {
        if (groupInfo) {
            getUsers(groupInfo.id_usuarios).then((users) => {
                console.log('Users:', users);
                setUsersInfo(users);
            });
        }
    }
    , [groupInfo]);



    useEffect(() => {
        console.log('Invited user:', invitedUser);
    }, [invitedUser]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            setCurrentUser(JSON.parse(userInfo));
        };
        fetchCurrentUser();
    }, []);

    // Funcion para invitar a un usuario a un grupo
    const inviteUser = async () => {
        console.log('Inviting user:', invitedUser);
        try {
            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;
            const response = await axios.post(`${BACKEND_IP}/api/group/invite`, {
                nombre_usuario: invitedUser,
                id_admin: userID,
                id_group: CurrentGroup,
            });
            console.log('User invited:', response.data);
            setIsSuccessModalVisible(true);
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    const removeUser = async (userName) => {
        try {
            const groupName = groupInfo.nombre;
            console.log('Removing user:', userName);
            console.log('Group name:', groupName);
            const userInfo = await AsyncStorage.getItem('userInfo');
            const userID = JSON.parse(userInfo)._id;

            const response = await axios.delete(`${BACKEND_IP}/api/group/deleteUser/${userID}`, {
                data: {
                    nombre_usuario: userName,
                    nombre: groupName,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('User removed:', response.data);
            setUsersInfo(usersInfo.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return (
        <Animated.View style={[styles.container, { left: horizontalAnim }]}>
            {groupInfo ? <Text style={styles.header}>{groupInfo.nombre}</Text> : <Text style={styles.text}>Group...</Text>}
            {groupInfo ? <Text style={styles.description}>{groupInfo.descripcion}</Text> : <Text style={styles.text}>Description...</Text>}
            <View style={styles.userList}>
                <Text style={styles.text}>Users:</Text>
                <FlatList
                    data={usersInfo ? usersInfo : []}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.users}>{item.nombre_usuario}</Text>
                            {currentUser && currentUser._id === groupInfo.id_admin && currentUser.nombre_usuario !== item.nombre_usuario && (
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeUser(item.nombre_usuario, item._id)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                    )}
                />
            </View>  
        
        {currentUser && groupInfo && groupInfo.id_admin && currentUser._id === groupInfo.id_admin && (
        <>
            <Text style={styles.text}>Invite user:</Text>
            <TextInput
                placeholder="Username"
                style={styles.input}
                value={invitedUser}
                onChangeText={setInvitedUser}
            />
            <TouchableOpacity style={styles.logoutButton} onPress={inviteUser}>
                <Text style={styles.buttonText}>Invite</Text>
            </TouchableOpacity>
        </>
    )}
                <SuccessModal
                    visible={isSuccessModalVisible}
                    onClose={() => setIsSuccessModalVisible(false)}
                />

            <Animated.View style={[styles.exitContainer, { opacity: buttonAnim }]}>
                <Pressable
                    style={styles.exitButton}
                    onPress={() => setOpengroupProfilePopUp(!OpengroupProfilePopUp)}
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
    input: {
        width: '60%',
        height: 40,
        margin: 12,
        borderBottomWidth: 2,
        borderColor: '#FFFFFF',
        fontSize: 17,
    },
    userList: {
        width: '80%',
        height: 200,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 25,
    },
    users: {
        color: '#FFFFFF',
        fontSize: 20,
        marginTop: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    bulletPoint: {
        fontSize: 20,
        marginRight: 10,
        color: '#FFFFFF',
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
    header: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
       
    },
    removeButton: {
        marginLeft: 10,
        backgroundColor: '#FF6347',
        padding: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});


