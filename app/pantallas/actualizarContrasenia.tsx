import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { actualizarContraseña } from '../../services/usuarioService';

export default function ModificarUsuario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');

  const handleGuardar = async () => {
    if (!contraseñaActual || !nuevaContraseña || !repetirContraseña) {
      Alert.alert('Error', 'Por favor, completá todos los campos');
      return;
    }

    if (nuevaContraseña !== repetirContraseña) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const payload = {
        contraseñaActual,
        nuevaContraseña
      };

      await actualizarContraseña(Number(id), payload);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      router.push('/(tabs)/perfil');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Contraseña Actual"
        secureTextEntry
        value={contraseñaActual}
        onChangeText={setContraseñaActual}
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva Contraseña"
        secureTextEntry
        value={nuevaContraseña}
        onChangeText={setNuevaContraseña}
      />

      <TextInput
        style={styles.input}
        placeholder="Repetir Nueva Contraseña"
        secureTextEntry
        value={repetirContraseña}
        onChangeText={setRepetirContraseña}
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
