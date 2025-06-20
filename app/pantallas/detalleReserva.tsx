import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator,TouchableOpacity  } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { obtenerPasajerosPorViaje } from '../../services/viajeServices'; // Asegúrate de que esta función esté definida


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
          <TouchableOpacity
            style={styles.botonEditar}
            onPress={() => router.push({ pathname: '/pantallas/modificarPasajero', params: { id: item.id, idViaje: id } })}
          >
            <Text style={styles.botonTexto}>Editar</Text>
          </TouchableOpacity>
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

});



