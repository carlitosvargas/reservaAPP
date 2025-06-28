import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { listarReservasYPasajerosPorViaje } from '../../services/reservaService';
import { existeReservaVenta } from '../../services/ventaService';

export interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
}

export interface ReservaConPasajeros {
  reservaId: number;
  fechaReserva: string;
  estado: string;
  pasajeros: Pasajero[];
  tieneVenta?: boolean;
}

export default function ReservasYPasajerosScreen() {
  const { id } = useLocalSearchParams();
  const [reservasPendientes, setReservasPendientes] = useState<ReservaConPasajeros[]>([]);
  const [reservasConfirmadas, setReservasConfirmadas] = useState<ReservaConPasajeros[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await listarReservasYPasajerosPorViaje(Number(id));

        const reservasConVenta = await Promise.all(
          data.map(async (reserva: ReservaConPasajeros) => {
            const tieneVenta = await existeReservaVenta(reserva.reservaId);
            return { ...reserva, tieneVenta };
          })
        );

        setReservasPendientes(reservasConVenta.filter(r => !r.tieneVenta));
        setReservasConfirmadas(reservasConVenta.filter(r => r.tieneVenta));
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Error al obtener reservas');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const formatDate = (fechaISO: string) => {
    const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  const renderReserva = (item: ReservaConPasajeros) => (
    <View key={item.reservaId} style={styles.card}>
      <Text style={styles.reservaId}>Reserva #{item.reservaId}</Text>
   

      {!item.tieneVenta && (
        <TouchableOpacity
          style={styles.botonConfirmar}
          onPress={() =>
            router.push({
              pathname: '/pantallas/ventaReserva',
              params: { id: item.reservaId }
            })
          }
        >
          <Text style={styles.botonTexto}>Confirmar</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subTitle}>Pasajeros:</Text>
      {item.pasajeros.map((p) => (
        <View key={p.id} style={styles.pasajeroBox}>
          <Text style={styles.pasajeroNombre}>{p.nombre} {p.apellido}</Text>
          <Text>DNI: {p.dni}</Text>
          <Text>Desde: {p.ubicacionOrigen}</Text>
          <Text>Hasta: {p.ubicacionDestino}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reservas del Viaje</Text>

      {reservasPendientes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Reservas pendientes de confirmación</Text>
          {reservasPendientes.map(renderReserva)}
        </>
      )}

      {reservasConfirmadas.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Reservas confirmadas</Text>
          {reservasConfirmadas.map(renderReserva)}
        </>
      )}

      {reservasPendientes.length === 0 && reservasConfirmadas.length === 0 && (
        <Text style={styles.error}>No hay reservas registradas para este viaje.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: '#333' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2
  },
  reservaId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subTitle: {
    marginTop: 8,
    fontWeight: '600'
  },
  pasajeroBox: {
    marginTop: 6,
    backgroundColor: '#eef1f6',
    padding: 10,
    borderRadius: 8
  },
  pasajeroNombre: {
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  botonConfirmar: {
    backgroundColor: '#4c68d7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
});
