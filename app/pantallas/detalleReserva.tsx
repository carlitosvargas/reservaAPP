import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator,TouchableOpacity, Alert, Platform, ToastAndroid  } from 'react-native';
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
  const usuarios_id = userInfo?.id;




useEffect(() => {
  if (id) {
    setLoading(true);
    obtenerPasajerosPorViaje(Number(idReserva))
      .then((data) => {
        setPasajeros(data);
      })
      .catch((error) => {
        setEsError(true);
        setMensajeReserva('Error al obtener los pasajeros');
      })
      .finally(() => {
        setLoading(false);
      });
  }
}, [id, updated]); // se vuelve a ejecutar si `updated` cambia

const handleEliminar = (idPasajero: number) => {
  const cantidadPasajeros = pasajeros.length;

  const mensaje = cantidadPasajeros === 1
    ? 'Este es el último pasajero. Si lo eliminás, se eliminará la reserva completa. ¿Deseás continuar?'
    : '¿Estás seguro de que querés eliminar este pasajero?';

  if (Platform.OS === 'web') {
    const confirmacion = window.confirm(mensaje);
    if (confirmacion) {
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

// Elimina y redirige si era el último
const eliminarYActualizar = async (idPasajero: number, cantidadPasajeros: number) => {
  try {
    await eliminarPasajero(idPasajero);

    // Mostrar mensaje de éxito
    if (Platform.OS === 'web') {
      alert('Pasajero eliminado correctamente'); 
    } else {
      Alert.alert('Pasajero eliminado correctamente');
      
    }

    // Si era el último pasajero
    if (cantidadPasajeros === 1) {
      // Si querés, también podés eliminar la reserva acá
      // await eliminarReserva(idReserva);

      // Redirige a otra pantalla
      router.replace('/(tabs)/reserva');
      return;
    }

    // Si no era el último: actualiza la lista
      router.push({ pathname: '/pantallas/detalleReserva', params: { id: id, tieneVenta: tieneVenta, idReserva: idReserva } })
     
  } catch (error) {
    console.error('Error al eliminar pasajero:', error);

    if (Platform.OS === 'web') {
       alert('Error al eliminar pasajero');
    } else {
      Alert.alert('Error al eliminar pasajero');
     
    }
  }
};



  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (esError) {
    return (
      <View style={styles.container}>
        <Text>{mensajeReserva}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      
      <Text style={styles.subTitle}>Pasajeros:</Text>
      <FlatList
        data={pasajeros}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.pasajeroItem}>
            <View style={{ flex: 1 }}>
              <Text>Nombre: {item.nombre} {item.apellido}</Text>
              <Text>DNI: {item.dni}</Text>
              <Text>Ubicación Origen: {item.ubicacionOrigen}</Text>
              <Text>Ubicación Destino: {item.ubicacionDestino}</Text>
            </View>
           

        {!reservaConfirmada && (
          <View style={styles.botonesRow}>
            <TouchableOpacity
              style={styles.botonEditar}
              onPress={() =>
                router.push({
                  pathname: '/pantallas/modificarPasajero',
                  params: { id: item.id, idReserva: idReserva, idViaje: id },
                })
              }
            >
              <Text style={styles.botonTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() => handleEliminar(item.id)} 
            >
              <Text style={styles.botonTexto}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
             
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },

  pasajeroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  botonEditar: {
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
    
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  botonesRow: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: 10, // Si tu versión de RN no soporta gap, usá marginRight en los botones
  marginTop: 10,
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




});



