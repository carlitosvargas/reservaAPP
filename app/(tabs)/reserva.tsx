import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { obtenerReservas } from '../services/reservaService';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  chofer: string;
  medioTransporte_id: number;
}

interface Reserva {
  id: number;
  fechaReserva: string;
  viaje: Viaje;
}

const MisReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchReservas = async () => {
      if (!userInfo?.id) {
        setError('No se pudo obtener el ID del usuario');
        setLoading(false);
        return;
      }

      try {
        const reservasData = await obtenerReservas(userInfo.id);
        console.log('datos que trae mi reserva', reservasData);
        setReservas(reservasData);
      } catch (error) {
        setError('Hubo un problema al obtener las reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            onPress={() => router.push({ pathname: '/pantallas/detalleReserva', params: { id: item.viaje.id} })}
            style={styles.reservaItem}
          >
            <Text style={styles.title}>Reserva #{item.id}</Text>
            <Text>Fecha de Reserva: {item.fechaReserva}</Text>
            <Text>Origen: {item.viaje.origenLocalidad}</Text>
            <Text>Destino: {item.viaje.destinoLocalidad}</Text>
            <Text>Fecha del Viaje: {item.viaje.fechaViaje}</Text>
            <Text>Hora de Salida: {item.viaje.horarioSalida}</Text>
            <Text>Chofer: {item.viaje.chofer}</Text>
            <Text>Precio: ${item.viaje.precio}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  reservaItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
});

export default MisReservas;
