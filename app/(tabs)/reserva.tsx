import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,ActivityIndicator,Pressable,Animated,TouchableOpacity,ScrollView,Alert,} from 'react-native';
import { obtenerReservas, eliminarReserva } from '../../services/reservaService';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { existeReservaVenta } from '../../services/ventaService';

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  usuarioEmpresa_id: number;
  medioTransporte_id: number;
}

interface Reserva {
  id: number;
  fechaReserva: string;
  viaje: Viaje;
  tieneVenta?: boolean;
}

const MisReservas = () => {
  const [reservasPendientes, setReservasPendientes] = useState<Reserva[]>([]);
  const [reservasPagadas, setReservasPagadas] = useState<Reserva[]>([]);
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

        const reservasConVenta = await Promise.all(
          reservasData.map(async (reserva: Reserva) => {
            const tieneVenta = await existeReservaVenta(reserva.id);
            return { ...reserva, tieneVenta };
          })
        );

        setReservasPendientes(reservasConVenta.filter(r => !r.tieneVenta));
        setReservasPagadas(reservasConVenta.filter(r => r.tieneVenta));
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

  const handleEliminarReserva = async (id: number) => {//cuando elimina la reserva tambien avisa que fue eliminada con exito
  Alert.alert(
    'Confirmar eliminación',
    '¿Estás seguro que deseas eliminar esta reserva?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarReserva(Number(id));
            setReservasPendientes(prev => {
              const nuevasReservas = prev.filter(reserva => reserva.id !== id);
              if (nuevasReservas.length === 0) {
                Alert.alert('Reserva eliminada con éxito', 'Aún no hay reservas pendientes de pago');
              } else {
                Alert.alert('Reserva eliminada con éxito');
              }
              return nuevasReservas;
            });
          } catch (error) {
            setError('No se pudo eliminar la reserva');
          }
        },
      },
    ]
  );
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

  const renderReserva = (item: Reserva) => (
    <Pressable key={item.id} onPress={() => toggleExpand(item.id)} style={styles.reservaItem}>
      <Text style={styles.title}>Origen: {item.viaje.origenLocalidad}</Text>
      <Text style={styles.title}>Destino: {item.viaje.destinoLocalidad}</Text>

      <Animated.View style={{ overflow: 'hidden', height: animatedHeight(item.id) }}>
        <Text>Reserva #{item.id}</Text>
        <Text>Fecha de Reserva: {formatDate(item.fechaReserva)}</Text>
        <Text>Fecha del Viaje: {formatDate(item.viaje.fechaViaje)}</Text>
        <Text>Hora de Salida: {formatTime(item.viaje.horarioSalida)}</Text>
        <Text>Chofer: {item.viaje.usuarioEmpresa_id}</Text>
        <Text>Precio: ${item.viaje.precio}</Text>

        <View style={styles.botonesContainer}>
          <Pressable
            onPress={() =>
             router.push({ pathname: '/pantallas/detalleReserva', params: { id: item.viaje.id, tieneVenta: item.tieneVenta?.toString() } })

            }
            style={styles.botonDetalle}
          >
           
            <Text style={styles.textoBotonDetalle}>Ver Detalle</Text>
          </Pressable>

          {!item.tieneVenta ? (
            <>
              <TouchableOpacity
                style={styles.botonConfirmar}
                onPress={() =>
                  router.push({ pathname: '/pantallas/ventaReserva', params: { id: item.id } })
                }
              >
              
                <Text style={styles.botonTexto}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => handleEliminarReserva(item.id)}
              >
                <Text style={styles.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Pressable
              style={styles.botonVerCompra}
              onPress={() =>
                router.push({ pathname: '/pantallas/detalleVenta', params: { id: item.id } })
              }
            >  
              <Text style={styles.textoBotonDetalle}>Ver Compra</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );

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
  <ScrollView style={styles.container}>
    {reservasPendientes.length === 0 && reservasPagadas.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
        Aún no hay reservas
      </Text>
    ) : (
      <>
        {reservasPendientes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reservas pendientes de confirmación</Text>
            {reservasPendientes.map(renderReserva)}
          </>
        )}

        {reservasPagadas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reservas confirmadas</Text>
            {reservasPagadas.map(renderReserva)}
          </>
        )}
      </>
    )}
  </ScrollView>
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
  textoBotonDetalle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonTexto: {
   color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
  letterSpacing: 0.5,
  },
  botonesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
    flexWrap: 'wrap',
  },
  botonDetalle: {
    backgroundColor: '#4c68d7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botonConfirmar: {
    backgroundColor: '#4c68d7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botonVerCompra: {
    backgroundColor: '#4c68d7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botonEliminar: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#333',
  },
});

export default MisReservas;
