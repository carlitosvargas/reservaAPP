import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { obtenerReservasPorEmpresa } from '../../services/reservaService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

interface Empresa {
  id: number;
  nombre: string;
}

interface MedioTransporte {
  id: number;
  nombre: string;
  patente: string;
  marca: string;
  cantLugares: number;
  Empresa: Empresa;
}

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  MedioTransporte: MedioTransporte;
}

interface Pasajero {
  nombre: string;
  apellido: string;
  dni: number;
  ubicacionOrigen: string;
  ubicacionDestino: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

interface Reserva {
  id: number;
  fechaReserva: string;
  usuarios_id: number;
  viajes_id: number;
  Viaje: Viaje;
  Pasajeros: Pasajero[];
  Usuario: Usuario;
}

const ListarReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [expanded, setExpanded] = useState<{
    [key: number]: { viaje: boolean; transporte: boolean; empresa: boolean; pasajeros: boolean; usuario: boolean };
  }>({});
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await obtenerReservasPorEmpresa(userInfo?.empresa_id);
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  const toggleSection = (
    reservaId: number,
    section: 'viaje' | 'transporte' | 'empresa' | 'pasajeros' | 'usuario'
  ) => {
    setExpanded((prev) => ({
      ...prev,
      [reservaId]: {
        ...prev[reservaId],
        [section]: !prev[reservaId]?.[section],
      },
    }));
  };

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
      <Text style={styles.title}>
        {reservas.length > 0 ? reservas[0].Viaje.MedioTransporte.Empresa.nombre : ''} - Reservas
      </Text>

      {reservas.length === 0 ? (
        <Text style={styles.empty}>No hay reservas para esta empresa.</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>
                N.° Reserva: <Text style={styles.value}>{item.id}</Text>
              </Text>
              <Text style={styles.label}>
                Fecha Reserva: <Text style={styles.value}>{formatDate(item.fechaReserva)}</Text>
              </Text>

              {/* Sección Datos del Usuario */}
              <TouchableOpacity onPress={() => toggleSection(item.id, 'usuario')}>
                <Text style={styles.subTitle}>Datos del Usuario</Text>
              </TouchableOpacity>
              {expanded[item.id]?.usuario && (
                <View style={styles.details}>
                  <Text style={styles.label}>
                    Nombre: <Text style={styles.value}>{item.Usuario?.nombre} {item.Usuario?.apellido}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Email: <Text style={styles.value}>{item.Usuario?.email}</Text>
                  </Text>
                </View>
              )}

              {/* Sección Datos de los Pasajeros */}
              <TouchableOpacity onPress={() => toggleSection(item.id, 'pasajeros')}>
                <Text style={styles.subTitle}>Datos de Pasajeros</Text>
              </TouchableOpacity>
              {expanded[item.id]?.pasajeros && item.Pasajeros?.length > 0 && (
                <View style={styles.details}>
                  {item.Pasajeros.map((pasajero, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                      <Text style={styles.label}>Nombre: <Text style={styles.value}>{pasajero.nombre} {pasajero.apellido}</Text></Text>
                      <Text style={styles.label}>DNI: <Text style={styles.value}>{pasajero.dni}</Text></Text>
                      <Text style={styles.label}>Origen: <Text style={styles.value}>{pasajero.ubicacionOrigen}</Text></Text>
                      <Text style={styles.label}>Destino: <Text style={styles.value}>{pasajero.ubicacionDestino}</Text></Text>
                    </View>
                  ))}
                </View>
              )}
              {expanded[item.id]?.pasajeros && (!item.Pasajeros || item.Pasajeros.length === 0) && (
                <Text style={styles.details}>No hay pasajeros para esta reserva.</Text>
              )}

              {/* Sección Datos del Viaje */}
              <TouchableOpacity onPress={() => toggleSection(item.id, 'viaje')}>
                <Text style={styles.subTitle}>Datos del Viaje</Text>
              </TouchableOpacity>
              {expanded[item.id]?.viaje && (
                <View style={styles.details}>
                  <Text style={styles.label}>Origen: <Text style={styles.value}>{item.Viaje.origenLocalidad}</Text></Text>
                  <Text style={styles.label}>Destino: <Text style={styles.value}>{item.Viaje.destinoLocalidad}</Text></Text>
                  <Text style={styles.label}>Fecha Viaje: <Text style={styles.value}>{formatDate(item.Viaje.fechaViaje)}</Text></Text>
                  <Text style={styles.label}>Horario Salida: <Text style={styles.value}>{formatTime(item.Viaje.horarioSalida)}</Text></Text>
                  <Text style={styles.label}>Precio: <Text style={styles.value}>${item.Viaje.precio}</Text></Text>
                </View>
              )}

              {/* Sección Datos del Transporte */}
              <TouchableOpacity onPress={() => toggleSection(item.id, 'transporte')}>
                <Text style={styles.subTitle}>Datos del Transporte</Text>
              </TouchableOpacity>
              {expanded[item.id]?.transporte && (
                <View style={styles.details}>
                  <Text style={styles.label}>Nombre: <Text style={styles.value}>{item.Viaje.MedioTransporte.nombre}</Text></Text>
                  <Text style={styles.label}>Patente: <Text style={styles.value}>{item.Viaje.MedioTransporte.patente}</Text></Text>
                  <Text style={styles.label}>Marca: <Text style={styles.value}>{item.Viaje.MedioTransporte.marca}</Text></Text>
                  <Text style={styles.label}>Lugares: <Text style={styles.value}>{item.Viaje.MedioTransporte.cantLugares}</Text></Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  card: { padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  label: { fontSize: 14, fontWeight: 'bold' },
  value: { fontWeight: 'normal' },
  subTitle: { marginTop: 8, fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  details: { marginLeft: 10, marginTop: 4 },
});

export default ListarReservas;
