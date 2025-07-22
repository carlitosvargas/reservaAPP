import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { obtenerPasajerosPorViaje } from '../../services/viajeServices';
import { eliminarPasajero } from '../../services/reservaService';

interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
}

export default function DetalleReserva() {
  const { id, updated, tieneVenta, idReserva } = useLocalSearchParams();
  const reservaConfirmada = tieneVenta === 'true';

  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensajeReserva, setMensajeReserva] = useState('');
  const [esError, setEsError] = useState(false);
  const router = useRouter();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (id) {
      setLoading(true);
      obtenerPasajerosPorViaje(Number(idReserva))
        .then((data) => {
          setPasajeros(data);
        })
        .catch(() => {
          setEsError(true);
          setMensajeReserva('Error al obtener los pasajeros');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, updated]);

  const handleEliminar = (idPasajero: number) => {
    const cantidadPasajeros = pasajeros.length;

    const mensaje =
      cantidadPasajeros === 1
        ? 'Este es el último pasajero. Si lo eliminás, se eliminará la reserva completa. ¿Deseás continuar?'
        : '¿Estás seguro de que querés eliminar este pasajero?';

    if (Platform.OS === 'web') {
      if (window.confirm(mensaje)) {
        eliminarYActualizar(idPasajero, cantidadPasajeros);
      }
    } else {
      Alert.alert(
        'Confirmar eliminación',
        mensaje,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => eliminarYActualizar(idPasajero, cantidadPasajeros),
          },
        ]
      );
    }
  };

  const eliminarYActualizar = async (
    idPasajero: number,
    cantidadPasajeros: number
  ) => {
    try {
      await eliminarPasajero(idPasajero);
      if (cantidadPasajeros === 1) {
        router.replace('/(tabs)/reserva');
      } else {
        router.push({
          pathname: '/pantallas/detalleReserva',
          params: { id, tieneVenta, idReserva },
        });
      }
    } catch (error) {
      Alert.alert('Error al eliminar pasajero');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4c68d7" />
      </View>
    );
  }

  if (esError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{mensajeReserva}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subTitle}>Pasajeros:</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1 }]}>Nombre</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Apellido</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>DNI</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Origen</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Destino</Text>
          {!reservaConfirmada && (
            <Text style={[styles.headerCell, { flex: 0.6 }]}>Acciones</Text>
          )}
        </View>

        {pasajeros.map((item) => (
      <View key={item.id} style={styles.tableRow}>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.nombre}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.apellido}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.dni}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.ubicacionOrigen}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.ubicacionDestino}</Text>
        </View>

        {!reservaConfirmada && (
          <View style={[styles.cell, styles.actions, { flex: 0.6 }]}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: '/pantallas/modificarPasajero',
                  params: {
                    id: item.id,
                    idReserva: idReserva,
                    idViaje: id,
                  },
                })
              }
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleEliminar(item.id)}
            >
              <Text style={styles.actionText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f7fa',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4c68d7',
    paddingVertical: 10,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
 cell: {
  justifyContent: 'center',
  alignItems: 'center',
},
cellText: {
  textAlign: 'center',
  color: '#444',
},

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4c68d7',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
