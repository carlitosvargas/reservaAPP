import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';


export default function HomeScreen() {
  return (
    <View >
      
      <Text style={styles.Colors}>Pantalla HOME</Text>
      
    </View>
  );
}
const styles = StyleSheet.create({
  Colors: {
    color:'red'

}});