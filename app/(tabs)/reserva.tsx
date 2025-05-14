import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { obtenerReservas } from '../../services/reservaService';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  chofer: string;
  medioTransporte_id: number;
}

interface Reserva {
  id: number;
  fechaReserva: string;
  viaje: Viaje;
}

const MisReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchReservas = async () => {
      if (!userInfo?.id) {
        setError('No se pudo obtener el ID del usuario');
        setLoading(false);
        return;
      }

      try {
        const reservasData = await obtenerReservas(userInfo.id);
        setReservas(reservasData);
      } catch (error) {
        setError('Hubo un problema al obtener las reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setExpandedId(id);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const animatedHeight = (id: number) => {
    return expandedId === id
      ? animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 200],
        })
      : 0;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleCenter}>Mis Reservas</Text>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleExpand(item.id)} style={styles.reservaItem}>
            <Text style={styles.title}>Origen: {item.viaje.origenLocalidad}</Text>
            <Text style={styles.title}>Destino: {item.viaje.destinoLocalidad}</Text>

            <Animated.View style={{ overflow: 'hidden', height: animatedHeight(item.id) }}>
              <Text>Reserva #{item.id}</Text>
              <Text>Fecha de Reserva: {item.fechaReserva}</Text>
              <Text>Fecha del Viaje: {item.viaje.fechaViaje}</Text>
              <Text>Hora de Salida: {item.viaje.horarioSalida}</Text>
              <Text>Chofer: {item.viaje.chofer}</Text>
              <Text>Precio: ${item.viaje.precio}</Text>

              <Pressable
                onPress={() =>
                  router.push({ pathname: '/pantallas/detalleReserva', params: { id: item.viaje.id } })
                }
                style={styles.botonDetalle}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.textoBotonDetalle}>Ver Detalle</Text>
              </Pressable>
            </Animated.View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  reservaItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleCenter: {
    color: 'black',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonDetalle: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  textoBotonDetalle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MisReservas;
