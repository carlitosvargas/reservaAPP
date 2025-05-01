export const unstable_settings = {
  initialRouteName: undefined,
};

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { obtenerViajesId } from '../services/viajeServices';
import { crearReserva } from '../services/reservaService';

export default function DetalleViaje() {
  const { id } = useLocalSearchParams();
  const [viaje, setViaje] = useState<any>(null);
  const [pasajeros, setPasajeros] = useState([{ nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' }]);
  const [loading, setLoading] = useState(false);

  const usuarios_id = 1; // Ajustá esto según de dónde saques el usuario logueado

  useEffect(() => {
    if (id) {
      obtenerViajesId(Number(id))
        .then((data) => {
          console.log(data); // Para ver qué datos recibes
          setViaje(data);
        })
        .catch((error) => {
          console.error("Error al obtener el viaje:", error); // Manejo de error en la obtención del viaje
        });
    }
  }, [id]);

  interface Pasajero {
    nombre: string;
    apellido: string;
    dni: string;
    ubicacionOrigen: string;
    ubicacionDestino: string;
  }
  
  const handleChangePasajero = (index: number, field: keyof Pasajero, value: string) => {
    const nuevosPasajeros = [...pasajeros] as Pasajero[]; // Aseguramos que 'pasajeros' es un array de Pasajero
    nuevosPasajeros[index][field] = value;
    setPasajeros(nuevosPasajeros);
  };
  

  const agregarPasajero = () => {
    if (pasajeros.length >= 3) {
      Alert.alert('Límite alcanzado', 'Solo puedes agregar hasta 3 pasajeros.');
      return;
    }
    setPasajeros([...pasajeros, { nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' }]);
  };

  const reservar = async () => {
    if (!viaje) return;
    try {
      setLoading(true);
      const reservaData = {
        usuarios_id,
        viajes_id: viaje.id,
        personas: pasajeros,
      };
      console.log('Datos de la reserva:', reservaData);

      await crearReserva(reservaData);
      Alert.alert('Reserva exitosa', 'Tu reserva fue creada correctamente.');
      setPasajeros([{ nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' }]); // limpiar campos
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear la reserva.');
    } finally {
      setLoading(false);
    }
  };

  if (!viaje) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabecera del viaje */}
      <Text style={styles.title}>Detalle del Viaje</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Origen:</Text>
        <Text style={styles.value}>{viaje.origenLocalidad}</Text>

        <Text style={styles.label}>Destino:</Text>
        <Text style={styles.value}>{viaje.destinoLocalidad}</Text>

        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{new Date(viaje.fechaViaje).toLocaleDateString()}</Text>

        <Text style={styles.label}>Horario de Salida:</Text>
        <Text style={styles.value}>
          {new Date(viaje.horarioSalida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>

        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.value}>${viaje.precio}</Text>

        <Text style={styles.label}>Chofer:</Text>
        <Text style={styles.value}>{viaje.chofer}</Text>
      </View>

      {/* Formulario de pasajeros */}
      <Text style={[styles.title, { marginTop: 30 }]}>Datos de Pasajeros</Text>

      {pasajeros.map((pasajero, index) => (
        <View key={index} style={styles.pasajeroCard}>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={pasajero.nombre}
            onChangeText={(text) => handleChangePasajero(index, 'nombre', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={pasajero.apellido}
            onChangeText={(text) => handleChangePasajero(index, 'apellido', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="DNI"
            keyboardType="numeric"
            value={pasajero.dni}
            onChangeText={(text) => handleChangePasajero(index, 'dni', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ubicación de Origen"
            value={pasajero.ubicacionOrigen}
            onChangeText={(text) => handleChangePasajero(index, 'ubicacionOrigen', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ubicación de Destino"
            value={pasajero.ubicacionDestino}
            onChangeText={(text) => handleChangePasajero(index, 'ubicacionDestino', text)}
          />
        </View>
      ))}

      <TouchableOpacity onPress={agregarPasajero} style={styles.agregarButton}>
        <Text style={styles.agregarButtonText}>Agregar otro pasajero</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={reservar}
        style={[styles.reservarButton, loading && { backgroundColor: '#ccc' }]}
        disabled={loading}
      >
        <Text style={styles.reservarButtonText}>{loading ? 'Reservando...' : 'Reservar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}






const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#007AFF',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  pasajeroCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  input: {
    height: 40,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  agregarButton: {
    backgroundColor: '#00C851',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  agregarButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  reservarButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  reservarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
