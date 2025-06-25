import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { obtenerViajesPorTransporteDeEmpresa } from '../../../services/reportesService';


interface Viaje {
  id: number;
  fechaViaje: string;
  horarioSalida: string;
  origen: string;
  destino: string;
}

interface TransporteConViajes {
  transporteId: number;
  nombre: string;
  patente: string;
  marca: string;
  cantidadViajes: number;
  viajes: Viaje[];
}


export default function ViajesPorTransporteScreen() {
  const { userInfo } = useAuth();
  const [data, setData] = useState<TransporteConViajes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerViajesPorTransporteDeEmpresa(userInfo.empresa_id);
        setData(respuesta);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error al obtener los viajes');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

   const formatDate = (fechaISO: string) => {
  const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Viajes por Transporte</Text>
      {data.map((transporte) => (
        <View key={transporte.transporteId} style={styles.transporteCard}>
          <Text style={styles.subTitle}>🚍 {transporte.nombre} ({transporte.patente})</Text>
          <Text>Marca: {transporte.marca}</Text>
          <Text>Total de viajes: {transporte.cantidadViajes}</Text>

          {transporte.viajes.map((viaje) => (
            <View key={viaje.id} style={styles.viajeCard}>
              <Text>🧭 Origen: {viaje.origen}</Text>
              <Text>🏁 Destino: {viaje.destino}</Text>
              <Text>📅 Fecha: {formatDate(viaje.fechaViaje)}</Text>
              <Text>🕒 Hora: {formatTime(viaje.horarioSalida)}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  transporteCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  viajeCard: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});