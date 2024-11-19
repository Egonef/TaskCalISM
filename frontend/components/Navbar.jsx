//Imports
import React, { useRef, useContext } from 'react';
import { StyleSheet, Text, View, Pressable , Platform , Animated} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import 'react-native-gesture-handler';
import { GlobalContext } from '../GlobalContext';

//Components
import Homesvg from '../components/SvgComponents/Home/Homesvg';
import HomesvgShadow from '../components/SvgComponents/Home/Homesvg2';
import Calendarsvg from '../components/SvgComponents/Calendar/Calendarsvg';
import CalendarsvgShadow from '../components/SvgComponents/Calendar/Calendarsvg2';
import Addsvg from '../components/SvgComponents/Add/Addsvg';
import AddsvgShadow from '../components/SvgComponents/Add/Addsvg2';
import Groupssvg from '../components/SvgComponents/Groups/Groupssvg';
import GroupssvgShadow from '../components/SvgComponents/Groups/Groupssvg2';
import Notificationssvg from '../components/SvgComponents/Notifications/Notificationssvg';
import NotificationssvgShadow from '../components/SvgComponents/Notifications/Notificationssvg2';
import AddPopUp from './AddPopUp';


export default function Navbar() {
    //Para cambiar de pantalla
    const navigation = useNavigation();

    //Animaciones
    const homeAnim = useRef(new Animated.Value(0)).current;
    const calendarAnim = useRef(new Animated.Value(0)).current;
    const addAnim = useRef(new Animated.Value(0)).current;
    const groupsAnim = useRef(new Animated.Value(0)).current;
    const notificationsAnim = useRef(new Animated.Value(0)).current;

    //Para abrir el popUp
    const { OpenAddPopUp , setOpenAddPopUp } = useContext(GlobalContext);

    const handlePressIn = (anim) => {
        Animated.spring(anim, {
            toValue: 4,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (anim) => {
        Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };


    return (
        <View style={styles.container}>
            
            <Shadow
                distance={40}
                startColor={'#eac7ae3d'}
                finalColor={'#00000000'}
                offset={[0, -3]}
                containerViewStyle={{ width: '100%' }}
            >
                <View style={styles.navbar}>
                    <Pressable
                        style={styles.navbutton}
                        onPress={() => navigation.navigate('Home')}
                        onPressIn={() => handlePressIn(homeAnim)}
                        onPressOut={() => handlePressOut(homeAnim)}
                    >
                        <Animated.View style={{ transform: [{ translateY: homeAnim }] }}>
                            <Homesvg style={styles.icon} />
                        </Animated.View>
                    </Pressable>
                    <Pressable
                        style={styles.navbutton}
                        onPress={() => navigation.navigate('Calendar')}
                        onPressIn={() => handlePressIn(calendarAnim)}
                        onPressOut={() => handlePressOut(calendarAnim)}
                    >
                        <Animated.View style={{ transform: [{ translateY: calendarAnim }] }}>
                            <Calendarsvg style={styles.icon} />
                        </Animated.View>
                    </Pressable>
                    <Pressable
                        style={styles.navbutton}
                        onPress={() => { OpenAddPopUp === false ? setOpenAddPopUp(true) : setOpenAddPopUp(false) }}
                        onPressIn={() => handlePressIn(addAnim)}
                        onPressOut={() => handlePressOut(addAnim)}
                    >
                        <Animated.View style={{ transform: [{ translateY: addAnim }] }}>
                            <Addsvg style={styles.iconAdd} />
                        </Animated.View>
                    </Pressable>
                    <Pressable
                        style={styles.navbutton}
                        onPress={() => navigation.navigate('Groups')}
                        onPressIn={() => handlePressIn(groupsAnim)}
                        onPressOut={() => handlePressOut(groupsAnim)}
                    >
                        <Animated.View style={{ transform: [{ translateY: groupsAnim }] }}>
                            <Groupssvg style={styles.icon} />
                        </Animated.View>
                    </Pressable>
                    <Pressable
                        style={styles.navbutton}
                        onPress={() => navigation.navigate('Notifications')}
                        onPressIn={() => handlePressIn(notificationsAnim)}
                        onPressOut={() => handlePressOut(notificationsAnim)}
                    >
                        <Animated.View style={{ transform: [{ translateY: notificationsAnim }] }}>
                            <Notificationssvg style={styles.icon} />
                        </Animated.View>
                    </Pressable>
                </View>
            </Shadow>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'transparent',
    },
    navbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: 80,
        backgroundColor: '#F1F1F1',
    },
    navbutton: {
        padding: 5,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 110,
        height: 80,
    },
    text: {
        fontSize: 16,
    },
    icon: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 30,
                transform: [{ translateY: -8 }],
            },
            android: {
                width: 35,
                height: 35,
                transform: [{ translateY: 0 }],
            }
        }),
    },
    iconShadow: {
        ...Platform.select({
            ios: {
                width: 30,
                height: 30,
                position: 'absolute',
                transform: [{ translateY: -4 }],
                zIndex: -1,
            },
            android: {
                width: 35,
                height: 35,
                position: 'absolute',
                transform: [{ translateY: 4 }],
                zIndex: -1,
            }
        }),
    },
    iconAdd: {
        width: 50,
        height: 50,
        transform: [{ translateY: -10 }],
    },
    iconShadowAdd: {
        width: 50,
        height: 50,
        position: 'absolute',
        transform: [{ translateY: -6 }],
        zIndex: -1,
    }
});