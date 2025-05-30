import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
      Alert.alert('Por favor, completa todos los campos');
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
    console.log('ver transporte', nuevoTransporte)
      await crearTransporte(nuevoTransporte);
      Alert.alert('Transporte creado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear transporte:', error);
      Alert.alert('Error al crear transporte');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Transporte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Patente"
        value={patente}
        onChangeText={setPatente}
      />

      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={marca}
        onChangeText={setMarca}
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad de lugares"
        value={cantLugares}
        onChangeText={setCantLugares}
        keyboardType="numeric"
      />

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
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
});

export default CrearTransporte;
