import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';

const { width } = Dimensions.get('window');

export default function Navbar() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Shadow
                distance={10}
                startColor={'#00000020'}
                finalColor={'#00000000'}
                offset={[0, -3]}
                containerViewStyle={{ width: '100%' }}
            >
                <View style={styles.navbar}>
                    <Pressable style={styles.navbutton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.text}>Home</Text>
                    </Pressable>
                    <Pressable style={styles.navbutton} onPress={() => navigation.navigate('Calendar')}>
                        <Text style={styles.text}>Calendar</Text>
                    </Pressable>
                    <Pressable style={styles.navbutton} onPress={() => navigation.navigate('Avisos')}>
                        <Text style={styles.text}>Add</Text>
                    </Pressable>
                    <Pressable style={styles.navbutton} onPress={() => navigation.navigate('Groups')}>
                        <Text style={styles.text}>Groups</Text>
                    </Pressable>
                    <Pressable style={styles.navbutton} onPress={() => navigation.navigate('Notifications')}>
                        <Text style={styles.text}>Notif</Text>
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
});