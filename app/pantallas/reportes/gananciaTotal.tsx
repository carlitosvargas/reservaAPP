import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { obtenerGananciaTotalPorEmpresa } from '../../../services/reportesService';
//import { ViajeConVentas } from '../../interfaces/GananciaTotalInterface';


export interface DetalleVenta {
  id: number;
  formaPago: string;
  subTotal: number;
  descuento: number;
  precioFinal: number;
}

export interface Venta {
  id: number;
  fecha: string;
  hora: string;
  totalVentas: number;
  DetalleVenta: DetalleVenta[];
}

export interface Reserva {
  id: number;
  usuarios_id: number;
  Ventas: Venta[];
}

export interface MedioTransporte {
  id: number;
  nombre: string;
  patente: string;
  cantLugares: number;
}

export interface ViajeConVentas {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  MedioTransporte: MedioTransporte;
  Reservas: Reserva[];
}

export interface RespuestaGananciaTotal {
  totalGanancia: number;
  viajes: ViajeConVentas[];
}

export default function GananciaTotalScreen() {
  const { userInfo } = useAuth();
  const [viajes, setViajes] = useState<ViajeConVentas[]>([]);
  const [totalGanancia, setTotalGanancia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerGananciaTotalPorEmpresa(userInfo.empresa_id);
        setViajes(data.viajes);
        setTotalGanancia(data.totalGanancia);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error al obtener ganancia total');
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
  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ganancia Total: ${totalGanancia.toLocaleString('es-AR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}</Text>

      <FlatList
        data={viajes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.viajeTitulo}>{item.origenLocalidad} → {item.destinoLocalidad}</Text>
            <Text style={styles.sub}>Transporte: {item.MedioTransporte.nombre} ({item.MedioTransporte.patente})</Text>

            {item.Reservas.map((reserva) => (
              <View key={reserva.id} style={styles.reservaBox}>
                <Text style={styles.label}>Reserva #{reserva.id}</Text>
                {reserva.Ventas.map((venta) => (
                  <View key={venta.id} style={styles.ventaBox}>
                    <Text>Pasajes: {venta.totalVentas}</Text>
                    <Text>Fecha: {formatDate(venta.fecha)} - Hora: {formatTime(venta.hora)}</Text>
                    {venta.DetalleVenta.map((detalle) => (
                      <View key={detalle.id} style={styles.detalleBox}>
                        <Text>Forma de pago: {detalle.formaPago}</Text>
                        <Text>Precio final: ${detalle.precioFinal.toLocaleString('es-AR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
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
  viajeTitulo: { fontSize: 18, fontWeight: 'bold' },
  sub: { fontStyle: 'italic', marginBottom: 6 },
  reservaBox: { marginTop: 10, paddingLeft: 10 },
  ventaBox: { marginTop: 6, paddingLeft: 10 },
  detalleBox: { marginTop: 4, paddingLeft: 10 },
  label: { fontWeight: '600', marginTop: 6 },
  error: { color: 'red', marginTop: 20, textAlign: 'center', fontSize: 16 },
});