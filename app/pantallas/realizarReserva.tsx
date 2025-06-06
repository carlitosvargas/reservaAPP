import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { obtenerViajesId } from '../../services/viajeServices';
import { crearReserva } from '../../services/reservaService';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';

interface Pasajero {
  nombre: string;
  apellido: string;
  dni: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
}

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  fechaViaje: string;
  horarioSalida: string;
  precio: number;
  chofer: string;
}

export default function DetalleViaje() {
  const { id } = useLocalSearchParams();
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([
    { nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [mensajeReserva, setMensajeReserva] = useState('');
  const [esError, setEsError] = useState(false);
  const router = useRouter();
  const { userInfo } = useAuth();

  const usuarios_id = userInfo?.id;

  useEffect(() => {
    if (id) {
      obtenerViajesId(Number(id))
        .then((data) => setViaje(data))
        .catch((error) => console.error("Error al obtener el viaje:", error));
    }
  }, [id]);

  const handleChangePasajero = (index: number, field: keyof Pasajero, value: string) => {
    const nuevosPasajeros = [...pasajeros];
    nuevosPasajeros[index][field] = value;
    setPasajeros(nuevosPasajeros);
    setMensajeReserva('');
    setEsError(false);
  };

  const agregarPasajero = () => {
    if (pasajeros.length >= 3) {
      Alert.alert('Límite alcanzado', 'Solo puedes agregar hasta 3 pasajeros.');
      return;
    }
    setPasajeros([...pasajeros, { nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' }]);
  };

  const validarPasajeros = () => {
    for (const p of pasajeros) {
      if (!p.nombre || !p.apellido || !p.dni || !p.ubicacionOrigen || !p.ubicacionDestino) {
        return false;
      }
    }
    return true;
  };

  const reservar = async () => {
    if (!viaje) return;
    if (!validarPasajeros()) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos de los pasajeros.');
      return;
    }

    try {
      setLoading(true);
      const reservaData = {
        usuarios_id,
        viajes_id: viaje.id,
        personas: pasajeros,
      };

      const response = await crearReserva(reservaData);
      const mensaje = response?.mensaje || 'Tu reserva fue creada en Mis Reservas pendiente de pago.';
      

      Alert.alert('Reserva exitosa', mensaje, [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/reserva'),
        },
      ]);

      setPasajeros([{ nombre: '', apellido: '', dni: '', ubicacionOrigen: '', ubicacionDestino: '' }]);
    } catch (error: any) {
      const mensaje = error?.response?.data?.mensaje || 'Hubo un problema al crear la reserva.';
      setEsError(true);
      setMensajeReserva(mensaje);
      Alert.alert('Error', mensaje);
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
     

      <Text style={styles.title}>Detalle del Viaje</Text>

      <View style={styles.card}>
  <View style={styles.infoRow}>
    <View style={styles.infoBox}>
      <Text style={styles.label}>Origen</Text>
      <Text style={styles.value}>{viaje.origenLocalidad}</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.label}>Destino</Text>
      <Text style={styles.value}>{viaje.destinoLocalidad}</Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.label}>Fecha</Text>
      <Text style={styles.value}>{new Date(viaje.fechaViaje).toLocaleDateString()}</Text>
    </View>
  </View>

  <View style={styles.infoRow}>
    <View style={styles.infoBox}>
      <Text style={styles.label}>Horario</Text>
      <Text style={styles.value}>
        {viaje.horarioSalida}
      </Text>
    </View>
    <View style={styles.infoBox}>
      <Text style={styles.label}>Precio</Text>
      <Text style={styles.value}>${viaje.precio}</Text>
    </View>
    <View style={styles.infoBox}>
      
    </View>
  </View>
</View>


      <Text style={[styles.title, { marginTop: 30 }]}>Datos de Pasajeros</Text>

      {pasajeros.map((pasajero, index) => (
        <View key={index} style={styles.pasajeroCard}>
          <View style={styles.inputGroup}>
          <Text style={styles.label1}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#888"
            value={pasajero.nombre}
            onChangeText={(text) => handleChangePasajero(index, 'nombre', text)}
          />
          </View>
          <View style={styles.inputGroup}>
          <Text style={styles.label1}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#888"
            value={pasajero.apellido}
            onChangeText={(text) => handleChangePasajero(index, 'apellido', text)}
          />
          </View>

          <View style={styles.inputGroup}>
          <Text style={styles.label1}>DNI</Text>
          <TextInput
            style={styles.input}
            placeholder="DNI"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={pasajero.dni}
            onChangeText={(text) => handleChangePasajero(index, 'dni', text)}
          />
          </View>
          <View style={styles.inputGroup}>
          <Text style={styles.label1}>Ubicación de Origen</Text>
          <TextInput
            style={styles.input}
            placeholder="Ubicación de Origen"
            placeholderTextColor="#888"
            value={pasajero.ubicacionOrigen}
            onChangeText={(text) => handleChangePasajero(index, 'ubicacionOrigen', text)}
          />
          </View>
          <View style={styles.inputGroup}>
          <Text style={styles.label1}>Ubicación de Destino</Text>
          <TextInput
            style={styles.input}
            placeholder="Ubicación de Destino"
            placeholderTextColor="#888"
            value={pasajero.ubicacionDestino}
            onChangeText={(text) => handleChangePasajero(index, 'ubicacionDestino', text)}
          />
          </View>
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

      {mensajeReserva !== '' && (
        <Text
          style={{
            marginTop: 15,
            textAlign: 'center',
            color: esError ? 'red' : '#00C851',
            fontWeight: 'bold',
          }}
        >
          {mensajeReserva}
        </Text>
      )}
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
  volverButton: {
    marginBottom: 10,
  },
  volverText: {
    color: '#007AFF',
    fontSize: 16,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    marginHorizontal: 4,
  },
    inputGroup: {
  marginBottom: 8,
},
label1: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 4,
  color: '#333',
},
  
});
