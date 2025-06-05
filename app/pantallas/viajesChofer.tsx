import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  fechaViaje: string;
  horarioSalida: string;
  precio: number;
}

export default function ChoferListaViajes() {
  const { viajes } = useLocalSearchParams();


  // Convertimos el string de JSON a un array real
  let listaViajes: Viaje[] = [];

  try {
    listaViajes = viajes ? JSON.parse(viajes as string) : [];
  } catch (error) {
    console.error("Error al parsear los viajes:", error);
  }
   const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  

 return (
    <View style={styles.container}>
      <Text style={styles.title}>Viajes asignados</Text>
      <FlatList
        data={listaViajes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Origen: {item.origenLocalidad}</Text>
            <Text>Destino: {item.destinoLocalidad}</Text>
            <Text>Fecha: {formatDate(item.fechaViaje)}</Text>
            <Text>Horario: {formatTime(item.horarioSalida)}</Text>
            
          </View>
        )}
        ListEmptyComponent={<Text>No hay viajes disponibles.</Text>}
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