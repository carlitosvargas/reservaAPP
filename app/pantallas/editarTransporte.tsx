import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { editarTransporte, obtenerTransporteId } from '../../services/transporteService';
import { useLocalSearchParams } from 'expo-router';

const EditarTransporte = () => {
  const [transporte, setTransporte] = useState({
    nombre: '',
    patente: '',
    marca: '',
    cantLugares: '',
  });

  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { userInfo } = useAuth(); // Aunque no se usa, lo dejo por si lo necesitás

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const transporteData = await obtenerTransporteId(Number(id));

        if (!transporteData) {
        Alert.alert('No se encontró el transporte');
        return;
        }

        setTransporte({
        nombre: transporteData.nombre ?? '',
        patente: transporteData.patente ?? '',
        marca: transporteData.marca ?? '',
        cantLugares: transporteData.cantLugares?.toString() ?? '',
        });

      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el transporte');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setTransporte(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    if (!transporte.nombre || !transporte.cantLugares) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      const nuevoTransporte = {
        nombre: transporte.nombre,
        cantLugares: parseInt(transporte.cantLugares),
      };

      await editarTransporte(Number(id), nuevoTransporte);
      Alert.alert('Éxito', 'Transporte actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error al editar transporte:', error);
      Alert.alert('Error', 'No se pudo actualizar el transporte');
    }
  };

  return (
    <View style={styles.container}>

         <View style={styles.inputGroup}>
         <Text style={styles.label}>Nombre</Text>
         <TextInput
         style={styles.input}
         placeholder="Nombre"
         placeholderTextColor="#888"
         value={transporte.nombre}
         onChangeText={text => handleChange('nombre', text)}
        />
        </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Patente</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        placeholder="Patente"
        placeholderTextColor="#888"
        value={transporte.patente}
        editable={false}
      />
      </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Marca</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        placeholder="Marca"
        placeholderTextColor="#888"
        value={transporte.marca}
        editable={false}
      />
      </View>

      <View style={styles.inputGroup}>
      <Text style={styles.label}>Cnatidad de Lugares</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad de Lugares"
        placeholderTextColor="#888"
        value={transporte.cantLugares}
        onChangeText={text => handleChange('cantLugares', text)}
        keyboardType="numeric"
      />
       </View> 
      <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
        <Text style={styles.botonTexto}>Actualizar Transporte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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

export default EditarTransporte;
