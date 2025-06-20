import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { obtenerViajesMasReservadosPorEmpresa } from '../../../services/reportesService';
import { useAuth } from '../../../context/AuthContext';

interface ViajeMasReservado {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  fechaViaje: string;
  horarioSalida: string;
  cantidadReservas: number;
}

export default function ViajesMasReservadosScreen() {
  const { id } = useLocalSearchParams();
  const [viajes, setViajes] = useState<ViajeMasReservado[]>([]);
  const [totalReservas, setTotalReservas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    const cargarViajes = async () => {
      try {
        const respuesta = await obtenerViajesMasReservadosPorEmpresa(userInfo?.empresa_id);
        setViajes(respuesta.viajes);
        setTotalReservas(respuesta.totalReservas);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error al obtener los viajes más reservados');
      } finally {
        setLoading(false);
      }
    };

   
      cargarViajes();
    
  }, [userInfo?.empresa_id]);

  if (loading) {
  
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viajes más Reservados</Text>
      <Text style={styles.subtitle}>Total de reservas: {totalReservas}</Text>

      <FlatList
        data={viajes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text><Text style={styles.label}>Origen:</Text> {item.origenLocalidad}</Text>
            <Text><Text style={styles.label}>Destino:</Text> {item.destinoLocalidad}</Text>
            <Text><Text style={styles.label}>Fecha:</Text> {new Date(item.fechaViaje).toLocaleDateString()}</Text>
            <Text><Text style={styles.label}>Hora de salida:</Text> {item.horarioSalida}</Text>
            <Text><Text style={styles.label}>Reservas:</Text> {item.cantidadReservas}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
