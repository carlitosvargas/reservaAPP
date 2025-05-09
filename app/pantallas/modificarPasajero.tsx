import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { obtenerPasajeroPorId, actualizarReserva } from '../services/reservaService'; // Asegúrate de tener estos servicios
import { useAuth } from '../context/AuthContext';

export default function ModificarPasajero() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [pasajero, setPasajero] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    ubicacionOrigen: '',
    ubicacionDestino: '',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerPasajeroPorId(Number(id)); // Debes implementar este servicio
        setPasajero(datos);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el pasajero');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setPasajero(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    try {
      await actualizarReserva(Number(id), pasajero); 
      Alert.alert('Éxito', 'Pasajero actualizado correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el pasajero');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modificar Pasajero</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={pasajero.nombre}
        onChangeText={text => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={pasajero.apellido}
        onChangeText={text => handleChange('apellido', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={pasajero.dni}
        onChangeText={text => handleChange('dni', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Ubicación Origen"
        value={pasajero.ubicacionOrigen}
        onChangeText={text => handleChange('ubicacionOrigen', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Ubicación Destino"
        value={pasajero.ubicacionDestino}
        onChangeText={text => handleChange('ubicacionDestino', text)}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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
