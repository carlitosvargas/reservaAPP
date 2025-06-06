import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerViajesPorEmpresa,eliminarViaje } from '../../services/viajeServices';
import { useAuth } from '../../context/AuthContext';

interface MedioTransporte {
  id: number;
  nombre: string;
  patente: string;
  marca: string;
  cantLugares: number;
  Empresa: {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
  };
}

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: string;
  precio: number;
  usuarioEmpresa_id: number;
  MedioTransporte: MedioTransporte;
}

const ViajesEmpresa = () => {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');

  const { userInfo } = useAuth();
  const router = useRouter();

  const esMostrador = userInfo?.perfil === 'usuarioMostrador';

  useEffect(() => {
    const fetchViajes = async () => {
      try {
        if (!userInfo?.empresa_id) {
          setError('No se pudo obtener el ID de la empresa');
          return;
        }

        const data = await obtenerViajesPorEmpresa(userInfo?.empresa_id);
        setViajes(data);
        if (data.length > 0) {
          setNombreEmpresa(data[0].MedioTransporte.Empresa.nombre);
        }
      } catch (err) {
        setError('Error al obtener los viajes');
      } finally {
        setLoading(false);
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

  const handleAgregar = () => {
    router.push({pathname:'/pantallas/crearViaje'})
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  const handleVerReservas = (viajeId: number) => {
    router.push({
      pathname: '/pantallas/listarReservasPorViaje',params: { id: viajeId },
    });
  };

  const handleEditar = (id: number) => {
  //router.push({ pathname: '/pantallas/editarViaje', params: { id } });
};

const handleEliminar = (id: number) => {
  const confirmar = Platform.OS === 'web'
    ? window.confirm('¿Estás seguro de que deseas eliminar este viaje?')
    : null;

  const continuar = Platform.OS === 'web' ? confirmar : true;

  if (continuar) {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este viaje?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sí, eliminar',
            style: 'destructive',
            onPress: () => eliminarViajes(id),
          },
        ]
      );
    } else {
      eliminarViajes(id);
    }
  }
};

const eliminarViajes = async (id: number) => {
  try {
    // reemplazá esto por tu servicio real
    await eliminarViaje(id);
    setViajes((prev) => prev.filter((v) => v.id !== id));

    Platform.OS === 'web'
      ? alert('Viaje eliminado correctamente')
      : Alert.alert('Viaje eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar viaje:', error);
    Platform.OS === 'web'
      ? alert('Error al eliminar viaje')
      : Alert.alert('Error', 'No se pudo eliminar el viaje');
  }
};


  const renderViaje = (viaje: Viaje) => (
  <View key={viaje.id} style={styles.reservaItem}>
    <Text style={styles.title}>Origen: {viaje.origenLocalidad}</Text>
    <Text style={styles.title}>Destino: {viaje.destinoLocalidad}</Text>
    <Text>Fecha del Viaje: {formatDate(viaje.fechaViaje)}</Text>
    <Text>Hora de Salida: {formatTime(viaje.horarioSalida)}</Text>
    <Text>Precio: ${viaje.precio}</Text>
    <Text>Transporte: {viaje.MedioTransporte.nombre} ({viaje.MedioTransporte.patente})</Text>
    <Text>Empresa: {viaje.MedioTransporte.Empresa.nombre}</Text>

    <Pressable
      onPress={() => handleVerReservas(viaje.id)}
      style={styles.botonDetalle}
    >
      <Ionicons name="eye-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
      <Text style={styles.textoBotonDetalle}>Ver Reservas</Text>
    </Pressable>

    {esMostrador && (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditar(viaje.id)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleEliminar(viaje.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
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
      {esMostrador && (
              <TouchableOpacity style={styles.agregarButton} onPress={handleAgregar}>
                <Text style={styles.agregarButtonText}>+ Agregar Viaje</Text>
              </TouchableOpacity>
            )}
      <Text style={styles.sectionTitle}>{nombreEmpresa} - Viajes</Text>
      {viajes.map(renderViaje)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
   agregarButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  agregarButtonText: 
  { 
    color: '#fff',
    fontWeight: 'bold'
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#333',
  },
  botonDetalle: {
    marginTop: 10,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 5,
  },
  textoBotonDetalle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
editButton: {
  backgroundColor: '#4CAF50',
  padding: 8,
  borderRadius: 5,
  flex: 1,
  marginRight: 5,
},
deleteButton: {
  backgroundColor: '#F44336',
  padding: 8,
  borderRadius: 5,
  flex: 1,
  marginLeft: 5,
},
buttonText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: 'bold',
},

});

export default ViajesEmpresa;
