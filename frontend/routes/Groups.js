//Imports
import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View , ScrollView , FlatList } from 'react-native';


//Components
import AddPopUp from '../components/AddPopUp';



export default function Groups() {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.header}>Groups</Text>
            <AddPopUp />
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