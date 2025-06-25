import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { obtenerGananciasPorViajePorEmpresa } from '../../../services/reportesService';

export interface MedioTransporte {
  id: number;
  nombre: string;
  patente: string;
  cantLugares: number;
  empresa_id: number;
}

export interface VentaResumen {
  id: number;
  totalVentas: number;
}

export interface ViajeResumen {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  fechaViaje: string;
  horarioSalida: string;
  precio: number;
  medioTransporte: MedioTransporte;
}

export interface ResultadoGananciaViaje {
  viaje: ViajeResumen;
  ventas: VentaResumen[];
  totalGanancia: number;
}
 const formatDate = (fechaISO: string) => {
  const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
export default function GananciasPorViajeScreen() {
  const { userInfo } = useAuth();
  const [viajes, setViajes] = useState<ResultadoGananciaViaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerGananciasPorViajePorEmpresa(userInfo?.empresa_id);
        console.log("data *", data);
        setViajes(data.resultados);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error al obtener datos de ganancias');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ganancias por Viaje</Text>

      <FlatList
        data={viajes}
        keyExtractor={(item) => item.viaje.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.viajeTitulo}>{item.viaje.origenLocalidad} → {item.viaje.destinoLocalidad}</Text>
            <Text>Fecha: {formatDate(item.viaje.fechaViaje)}</Text>
            <Text>Hora: {formatTime(item.viaje.horarioSalida)}</Text>
            <Text>Precio del viaje: ${item.viaje.precio}</Text>
            <Text>Transporte: {item.viaje.medioTransporte.nombre} ({item.viaje.medioTransporte.patente})</Text>
            <Text style={styles.totalGanancia}>Ganancia total: ${item.totalGanancia.toFixed(2)}</Text>

            <View style={styles.ventasBox}>
              <Text style={styles.label}>Ventas:</Text>
              {item.ventas.length === 0 ? (
                <Text style={styles.textoSecundario}>No hay ventas registradas.</Text>
              ) : (
                item.ventas.map(venta => (
                  <Text key={venta.id}>Venta #{venta.id} - Pasajes: {venta.totalVentas}</Text>
                ))
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 16, elevation: 2 },
  viajeTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  ventasBox: { marginTop: 10 },
  totalGanancia: { marginTop: 10, fontWeight: 'bold', fontSize: 16 },
  label: { fontWeight: '600', marginTop: 6 },
  textoSecundario: { fontStyle: 'italic', color: '#555' },
  error: { color: 'red', marginTop: 20, textAlign: 'center', fontSize: 16 },
});