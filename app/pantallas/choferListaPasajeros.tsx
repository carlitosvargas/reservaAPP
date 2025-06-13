import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { listarPasajeroPorViaje } from '../../services/reservaService'; // Asegúrate de tener esta función en tu servicio

interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  ubicacionOrigen: string;
  ubicacionDestino: string;
}

export default function ChoferListaPasajeros() {
  const { id } = useLocalSearchParams();
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);

  useEffect(() => {
    const fetchPasajeros = async () => {
      try {
        const data = await listarPasajeroPorViaje(Number(id));
        setPasajeros(data);
      } catch (error) {
        console.error('Error al obtener pasajeros:', error);
      }
    };

    if (id) {
      fetchPasajeros();
    }
  }, [id]);

 return (
  <View style={styles.container}>
    <Text style={styles.title}>Pasajeros del Viaje {id}</Text>
    <FlatList
      data={pasajeros}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>👤 {item.nombre} {item.apellido}</Text>
          <Text style={styles.detail}>🆔 DNI: {item.dni}</Text>
          <Text style={styles.detail}>📍 Origen: {item.ubicacionOrigen}</Text>
          <Text style={styles.detail}>🎯 Destino: {item.ubicacionDestino}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>No hay pasajeros en este viaje.</Text>
      }
    />
  </View>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});

