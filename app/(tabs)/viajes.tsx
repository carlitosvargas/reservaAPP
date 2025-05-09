import React, { useEffect, useState } from 'react';
import { View,Text,TextInput,Pressable,StyleSheet,FlatList,useColorScheme,ScrollView,ActivityIndicator,KeyboardAvoidingView,Platform,} from 'react-native';
import { listarViajes } from '../services/viajeServices';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';


interface Viaje {
    id: number;
    origenLocalidad: string;
    destinoLocalidad: string;
    horarioSalida: string; // o Date si lo tratás como objeto
    fechaViaje: Date;    // o Date
    precio: number;
    chofer: string;
    medioTransporte_id: number;
    eliminado: string;
  }
  
  
  export default function ViajesScreen() {

    const router = useRouter();


    const [viajes, setViajes] = useState<Viaje[]>([]);
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    
  
    const buscarViajes = async () => {
      if (!origen || !destino) {
        setMensaje('Por favor ingresá ambos campos.');
        return;
      }
  
      setLoading(true);
      setMensaje('');
  
      try {
        const data = await listarViajes(origen, destino);
        setViajes(data);
        if (data.length === 0) {
          setMensaje('No se encontraron viajes disponibles.');
        }
      } catch (error) {
        console.error('Error al obtener viajes:', error);
        setMensaje('Ocurrió un error al buscar los viajes.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Botón "Volver" con icono de flecha en la esquina superior izquierda */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color="#333" /> {/* Icono de flecha */}
        </Pressable>

          <Text style={styles.title}>Buscar Viajes</Text>
  
          <TextInput
            style={styles.input}
            placeholder="Origen"
            value={origen}
            onChangeText={setOrigen}
          />
          <TextInput
            style={styles.input}
            placeholder="Destino"
            value={destino}
            onChangeText={setDestino}
          />
  
          <Pressable style={styles.button} onPress={buscarViajes}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
  
          {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
  
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            viajes.map((item) => (
              <Pressable key={item.id} onPress={() => router.push({pathname:'/pantallas/realizarReserva',params:{id:item.id}})}
              style={styles.card}>
                <Text style={styles.cardTitle}>Viaje #{item.id}</Text>
                <Text>Origen: {item.origenLocalidad}</Text>
                <Text>Destino: {item.destinoLocalidad}</Text>
                <Text>Fecha: {new Date(item.fechaViaje).toLocaleDateString()}</Text>
                <Text>Hora de Salida: {item.horarioSalida}</Text>
                <Text>Precio: ${item.precio}</Text>
                <Text>Chofer: {item.chofer}</Text>
              </Pressable>
            ))
          )}
          
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }




  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#007AFF',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    mensaje: {
      textAlign: 'center',
      color: '#ff3333',
      marginBottom: 16,
    },
    card: {
      backgroundColor: '#f2f2f2',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
    },
    cardTitle: {
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#007AFF',
    },
      // Estilos para el botón "Volver" en la esquina superior izquierda
     backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ccc',
    zIndex: 1, // Asegura que el botón esté encima de otros elementos
  },
  backButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  });