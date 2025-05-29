import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { listarReservasPorViaje } from '../../services/reservaService';

interface Usuario {
  nombre: string;
  apellido: string;
}

interface Pasajero {
  nombre: string;
  apellido: string;
}

interface Reserva {
  id: number;
  fechaReserva: string;
  usuarios_id: number;
  Usuario?: Usuario;
  Pasajeros?: Pasajero[];
}

const ReservasPorViaje = () => {
  const { id } = useLocalSearchParams();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        if (!id) return;
        const data = await listarReservasPorViaje(Number(id));
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (reservas.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No hay reservas para este viaje.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={reservas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.reservaItem}>
          <Text style={styles.reservaTitulo}>Reserva #{item.id}</Text>
          <Text>Fecha de reserva: {item.fechaReserva}</Text>

          {item.Usuario && (
            <Text>Realizada por: {item.Usuario.nombre} {item.Usuario.apellido}</Text>
          )}

          {item.Pasajeros && item.Pasajeros.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontWeight: 'bold' }}>Pasajeros:</Text>
              {item.Pasajeros.map((pasajero, index) => (
                <Text key={index}>- {pasajero.nombre} {pasajero.apellido}</Text>
              ))}
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  reservaItem: { padding: 12, marginBottom: 10, backgroundColor: '#eee', borderRadius: 8 },
  reservaTitulo: { fontWeight: 'bold', fontSize: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ReservasPorViaje;
