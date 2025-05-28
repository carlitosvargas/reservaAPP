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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Nombre: {item.nombre} {item.apellido}</Text>
            <Text>DNI: {item.dni}</Text>
            <Text>Origen: {item.ubicacionOrigen}</Text>
            <Text>Destino: {item.ubicacionDestino}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay pasajeros en este viaje.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});
