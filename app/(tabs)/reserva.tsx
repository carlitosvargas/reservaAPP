import React, { useEffect, useState } from 'react';
import {View,Text,TextInput,Pressable,StyleSheet,FlatList,useColorScheme,ScrollView,ActivityIndicator,KeyboardAvoidingView,Platform,} from 'react-native';
import { listarViajes } from '../services/viajeServices';
import { useRouter } from 'expo-router';


interface Viaje {
  id: number;
  fechaReserva: Date;    // o Date
  usuarios_id: number;
  viajes_id: number;
  eliminado: string;
}



export default function ReservaScreen() {
  return (
    <View >
      
    
  
      <Text style={styles.Colors}>Pantalla Reserva</Text>
      
    </View>
  );
}
const styles = StyleSheet.create({
  Colors: {
    color:'red'

}});