//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';


//Components




export default function UserCalendar() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>UserCalendar</Text>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});