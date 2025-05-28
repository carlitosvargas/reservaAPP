import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
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

const ViajesChofer = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const data = await obtenerViajesPorChofer(userInfo?.id);
        setViajes(data);
      } catch (error) {
        console.error('Error al obtener viajes:', error);
      }
    };

    fetchViajes();
  }, []);

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
    <FlatList
      data={viajes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>  router.push({ pathname: '/pantallas/choferListaPasajeros', params: { id: item.id } })}
          style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
        >
          <Text>Origen: {item.origenLocalidad}</Text>
          <Text>Destino: {item.destinoLocalidad}</Text>
          <Text>Salida: {formatDate(item.fechaViaje)} - {formatTime(item.horarioSalida)}</Text>
          <Text>Precio: ${item.precio}</Text>
          <Text>Transporte: {item.MedioTransporte?.nombre}</Text>
          <Text>Empresa del Transporte: {item.MedioTransporte?.Empresa?.nombre || 'N/A'}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default ViajesChofer;
