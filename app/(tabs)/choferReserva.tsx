import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { obtenerViajesPorChofer } from '../../services/viajeServices';
import { useAuth } from '@/context/AuthContext';

interface Empresa {
  id: number;
  nombre: string;
}

interface MedioTransporte {
  id: number;
  nombre: string;
  Empresa: Empresa;
}

interface UsuarioEmpresa {
  Empresa: Empresa;
}

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  UsuarioEmpresa: UsuarioEmpresa;
  MedioTransporte: MedioTransporte;
}

const ChoferReserva = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const data = await obtenerViajesPorChofer(userInfo?.id);
        console.log('ver viajes chofer', data)
        setViajes(data.viajes);
         console.log('ver viajes ', viajes)
      } catch (error) {
        console.error('Error al obtener viajes:', error);
      }
    };

    fetchViajes();
  }, []);

  const formatDate = (fechaISO: string) => {
  const [year, month, day] = fechaISO.split('T')[0].split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  return (
   
  <View style={styles.container}>
    
    <FlatList
      data={viajes}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/pantallas/confirmarReserva',
              params: { id: item.id },
            })
          }
          style={styles.card}
        >
          <Text style={styles.title}>{item.origenLocalidad} ➜ {item.destinoLocalidad}</Text>
          <Text style={styles.detail}>🗓 Salida: {formatDate(item.fechaViaje)} - {formatTime(item.horarioSalida)}</Text>
          <Text style={styles.detail}>💲 Precio: ${item.precio}</Text>
          <Text style={styles.detail}>🚌 Transporte: {item.MedioTransporte?.nombre}</Text>
          <Text style={styles.detail}>🏢 Empresa: {item.MedioTransporte?.Empresa?.nombre || 'N/A'}</Text>
        </TouchableOpacity>
      )}
       ListEmptyComponent={
              <Text style={styles.emptyMessage}>No hay Viajes para este Chofer.</Text>
            }
    />
  </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
   titulo: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16
  },
  detail: {
    fontSize: 14,
   
    marginBottom: 4,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#777',
  },
});

export default ChoferReserva;
