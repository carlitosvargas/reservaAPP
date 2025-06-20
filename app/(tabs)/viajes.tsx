import React, { useEffect, useState, useRef  } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Keyboard, TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import { listarViajes, obtenerLocalidades } from '../../services/viajeServices';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Viaje {
  id: number;
  origenLocalidad: string;
  destinoLocalidad: string;
  horarioSalida: string;
  fechaViaje: Date;
  precio: number;
  usuarioEmpresa_id: number;
  medioTransporte_id: number;
  eliminado: string;
}

export default function ViajesScreen() {
  const router = useRouter();

  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<string[]>([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState<string[]>([]);
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const origenRef = useRef<HTMLDivElement | null>(null);
  const destinoRef = useRef<HTMLDivElement | null>(null);

  
  useEffect(() => {
    const cargarLocalidades = async () => {
      try {
        const data = await obtenerLocalidades();
        const nombres = data.map((l: any) => l.nombre);
        setLocalidades(nombres);
      } catch (error) {
        console.error('Error al cargar localidades', error);
      }
    };
    cargarLocalidades();
 
   if (Platform.OS !== 'web') return;

  const handleClickOutside = (event: { target: any; }) => {
    if (origenRef.current && !origenRef.current.contains(event.target)) {
      setSugerenciasOrigen([]);
    }
    if (destinoRef.current && !destinoRef.current.contains(event.target)) {
      setSugerenciasDestino([]);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  }; }, []);

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
      setMensaje('No se encontraron viajes disponibles !!');
    } finally {
      setLoading(false);
    }
  };

  const filtrarSugerencias = (texto: string, tipo: 'origen' | 'destino') => {
    const sugerencias = localidades.filter((l) =>
      l.toLowerCase().startsWith(texto.toLowerCase())
    );
    tipo === 'origen' ? setSugerenciasOrigen(sugerencias) : setSugerenciasDestino(sugerencias);
  };

  const renderViaje = (item: Viaje) => (
    <Pressable
      key={item.id}
      onPress={() => router.push({ pathname: '/pantallas/realizarReserva', params: { id: item.id } })}
      style={styles.card}
    >
      <Text style={styles.cardTitle}>Viaje #{item.id}</Text>
      <Text>Origen: {item.origenLocalidad}</Text>
      <Text>Destino: {item.destinoLocalidad}</Text>
      <Text>Fecha: {new Date(item.fechaViaje).toLocaleDateString()}</Text>
      <Text>Hora de Salida: {item.horarioSalida}</Text>
      <Text>Precio: ${item.precio}</Text>
      
    </Pressable>
  );
  return (
  <>
    {Platform.OS === 'web' ? (
      // ✅ Web version (pantalla más amplia)
      <View  style={stylesWeb.container}>
        <Text style={stylesWeb.title}>Buscar pasajes</Text>
        <View style={stylesWeb.inputsRow}>
          {/* Origen */}
          <div ref={origenRef} style={stylesWeb.inputContainer}>
            <TextInput
              style={stylesWeb.input}
              placeholder="Origen"
              value={origen}
              onChangeText={(text) => {
                setOrigen(text);
                filtrarSugerencias(text, 'origen');
              }}
           
            />
            {origen.length > 0 && (
              <Pressable onPress={() => {
                setOrigen('');
                setSugerenciasOrigen([]);
              }}>
                <Icon name="times-circle" size={20} color="#aaa" />
              </Pressable>
            )}
            {sugerenciasOrigen.length > 0 && (
              <View style={stylesWeb.suggestionBox}>
                {sugerenciasOrigen.map((s, idx) => (
                  <Pressable key={idx} onPress={() => {
                    setOrigen(s);
                    setSugerenciasOrigen([]);
                  }}>
                    <Text style={stylesWeb.suggestion}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </div>

          {/* Destino */}
          <div ref={destinoRef} style={stylesWeb.inputContainer}>
            <TextInput
              style={stylesWeb.input}
              placeholder="Destino"
              value={destino}
              onChangeText={(text) => {
                setDestino(text);
                filtrarSugerencias(text, 'destino');
              }}
            

            />
            {destino.length > 0 && (
              <Pressable onPress={() => {
                setDestino('');
                setSugerenciasDestino([]);
              }}>
                <Icon name="times-circle" size={20} color="#aaa" />
              </Pressable>
            )}
            {sugerenciasDestino.length > 0 && (
              <View style={stylesWeb.suggestionBox}>
                {sugerenciasDestino.map((s, idx) => (
                  <Pressable key={idx} onPress={() => {
                    setDestino(s);
                    setSugerenciasDestino([]);
                  }}>
                    <Text style={stylesWeb.suggestion}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </div>

          <Pressable style={stylesWeb.button} onPress={buscarViajes}>
            <Text style={stylesWeb.buttonText}>Buscar</Text>
          </Pressable>
        </View>

        {mensaje ? <Text style={stylesWeb.mensaje}>{mensaje}</Text> : null}

        <View style={{ flex: 1, width: '100%', marginTop: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={viajes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderViaje(item)}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    ) : (
      // ✅ Mobile version (tu código original)
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 16 }}>
              {/* Buscador fijo */}
        <View style={styles.searchSection}>
          {/* Origen */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Origen"
              placeholderTextColor="#888"
              value={origen}
              onChangeText={(text) => {
                setOrigen(text);
                filtrarSugerencias(text, 'origen');
              }}
              onBlur={() => setSugerenciasOrigen([])}
            />
            {origen.length > 0 && (
              <Pressable onPress={() => {
                setOrigen('');
                setSugerenciasOrigen([]);
              }}>
                <Icon name="times-circle" size={20} color="#aaa" style={styles.clearIcon} />
              </Pressable>

            )}
          </View>
          {sugerenciasOrigen.length > 0 && (
            <View style={styles.suggestionBox}>
              {sugerenciasOrigen.map((s, idx) => (
                <Pressable key={idx} onPress={() => {
                  setOrigen(s);
                  setSugerenciasOrigen([]);
                }}>
                  <Text style={styles.suggestion}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Destino */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Destino"
              placeholderTextColor="#888"
              value={destino}
              onChangeText={(text) => {
                setDestino(text);
                filtrarSugerencias(text, 'destino');
              }}
              onBlur={() => setSugerenciasDestino([])}
            />
            {destino.length > 0 && (
              <Pressable onPress={() => {
                setDestino('');
                setSugerenciasDestino([]);
              }}>
                <Icon name="times-circle" size={20} color="#aaa" style={styles.clearIcon} />
              </Pressable>
            )}
          </View>
          {sugerenciasDestino.length > 0 && (
            <View style={styles.suggestionBox}>
              {sugerenciasDestino.map((s, idx) => (
                <Pressable key={idx} onPress={() => {
                  setDestino(s);
                  setSugerenciasDestino([]);
                }}>
                  <Text style={styles.suggestion}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable style={styles.button} onPress={buscarViajes}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>

          {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
        </View>

        {/* Lista de viajes scrollable */}
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={viajes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderViaje(item)}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )}
  </>
);

}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchSection: {
  marginBottom: 16,
},

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  clearIcon: {
    marginLeft: 8,
  },
  suggestionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    color: '#007AFF',
  },
  button: {
    padding: 14,
    marginBottom: 16,
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
    elevation: 5, 
    transform: [{ scale: 1 }],
    transitionDuration: '200ms', 
  },
  buttonText: {
   color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  letterSpacing: 0.5,
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
});

const stylesWeb = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  inputContainer: {
    
    width: 250,
    position: 'relative',
  },
  input: {
    height: 45,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  suggestionBox: {
    position: 'absolute',
    top: 48,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
  },
  suggestion: {
    padding: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mensaje: {
    marginTop: 16,
    color: 'red',
    fontWeight: '500',
  },
});