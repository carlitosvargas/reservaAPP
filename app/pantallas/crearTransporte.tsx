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
    } catch (error:any) {
      const errores = error.response?.data?.errores;

  if (errores && Array.isArray(errores)) {
    // el middleware me envia un array errores con los mensajes de error
    const mensajeError = errores.map((err: any) => err.msg).join('\n');
    Alert.alert('Error en los datos:', mensajeError);
  } else {
    const mensajeError = error.response?.data?.error || 'Error al crear el transporte.';
    
    Alert.alert('Error:', mensajeError);
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
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
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