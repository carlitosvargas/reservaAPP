import Colors from '@/constants/Colors';
import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function PrincipalScreen() {
  return (
    <View >
      <Text style={styles.Colors}>Pantalla Principal</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  Colors: {
    color:'red'

}});