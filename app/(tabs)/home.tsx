import Colors from '@/constants/Colors';
import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import Pestaña from './_layout';
import { Tabs } from 'expo-router';

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