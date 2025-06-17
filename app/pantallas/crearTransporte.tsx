import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { crearTransporte } from '../../services/transporteService';

const CrearTransporte = () => {
  const [nombre, setNombre] = useState('');
  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [cantLugares, setCantLugares] = useState('');
  const { userInfo } = useAuth();
  const navigation = useNavigation();

  const handleGuardar = async () => {
  if (!nombre || !patente || !marca || !cantLugares) {
    const mensaje = 'Por favor, completa todos los campos';
    if (Platform.OS === 'web') {
      alert(mensaje);
    } else {
      Alert.alert(mensaje);
    }
    return;
  }

  try {
    const nuevoTransporte = {
      nombre,
      patente,
      marca,
      cantLugares: parseInt(cantLugares),
      empresa_id: userInfo?.empresa_id,
    };

    console.log('ver transporte', nuevoTransporte);
    await crearTransporte(nuevoTransporte);

    const mensaje = 'Transporte creado correctamente';
    if (Platform.OS === 'web') {
      alert(mensaje);
    } else {
      Alert.alert(mensaje);
    }

    navigation.goBack();
  } catch (error: any) {
    const errores = error?.response?.data?.errores;

    if (errores && Array.isArray(errores)) {
      const mensajeError = errores.map((err: any) => err.msg).join('\n');
      if (Platform.OS === 'web') {
        alert(mensajeError);
      } else {
        Alert.alert( mensajeError);
      }
    } else {
      const mensajeError = error?.response?.data?.error || 'Error al crear el transporte.';
      if (Platform.OS === 'web') {
        alert('Error: ' + mensajeError);
      } else {
        Alert.alert('Error', mensajeError);
      }
    }
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Transporte</Text>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />
      </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Patente</Text>
      <TextInput
        style={styles.input}
        placeholder="Patente"
        placeholderTextColor="#888"
        value={patente}
        onChangeText={setPatente}
      />
      </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor="#888"
        value={marca}
        onChangeText={setMarca}
      />
       </View>


      <View style={styles.inputGroup}>
      <Text style={styles.label}>Cantidad de Lugares</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad de lugares"
        placeholderTextColor="#888" 
        value={cantLugares}
        onChangeText={setCantLugares}
        keyboardType="numeric"
      />
      </View>
      <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
        <Text style={styles.botonTexto}>Guardar Transporte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  botonGuardar: {
      backgroundColor: '#4c68d7',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, 
      transform: [{ scale: 1 }],
      transitionDuration: '200ms', 
    },
botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  inputGroup: {
  marginBottom: 8,
},
label: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 4,
  color: '#333',
},

});

export default CrearTransporte;