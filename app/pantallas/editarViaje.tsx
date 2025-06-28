import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { actualizarViaje, obtenerViajesId } from '../../services/viajeServices';
import { obtenerTransporteId } from '../../services/transporteService';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '@/context/AuthContext';

import { obtenerUsuarioPorId, obtenerUsuariosChoferPorEmpresa } from '../../services/usuarioService';
import { obtenerTransportePorEmpresa, obtenerViajesPorTransporte } from '../../services/transporteService';
import { obtenerLocalidades, obtenerViajesPorChofer } from '../../services/viajeServices';
import Icon from 'react-native-vector-icons/FontAwesome';



type Chofer = {
  id: number;
  nombre: string;
  apellido: string;
  UsuarioEmpresas: {
    id: number;
  }[];
};

type Transporte = {
  id: number;
  nombre: string;
  patente: string;
};




const EditarViaje = () => {
  const [viaje, setViaje] = useState<any>(null);
  const [fechaViaje, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [precio, setPrecio] = useState('');
  const [choferInput, setChoferInput] = useState('');
  const [transporteInput, setTransporteInput] = useState('');
  const [usuarioEmpresa_id, setUsuarioEmpresa] = useState('');
  const [medioTransporte_id, setMedioTransporte] = useState('');

  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [transportes, setTransportes] = useState<Transporte[]>([]);
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState<string[]>([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState<string[]>([]);
  const [sugerenciasChofer, setSugerenciasChofer] = useState<string[]>([]);
  const [sugerenciasTransporte, setSugerenciasTransporte] = useState<string[]>([]);

  const [localidades, setLocalidades] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const origenRef = useRef<HTMLDivElement | null>(null);
  const destinoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.empresa_id) return;
      try {
        const data = await obtenerViajesId(Number(id));
        setViaje(data);

        setOrigen(data.origenLocalidad);
        setDestino(data.destinoLocalidad);
        setPrecio(data.precio.toString());
        setUsuarioEmpresa(data.usuarioEmpresa_id?.toString() ?? '');
        setMedioTransporte(data.medioTransporte_id?.toString() ?? '');

        const fechaParts = data.fechaViaje.split('-');
        const fechaLocal = new Date(
          parseInt(fechaParts[0]),
          parseInt(fechaParts[1]) - 1,
          parseInt(fechaParts[2])
        );
        setFecha(fechaLocal);

        const [h, m] = data.horarioSalida.split(':');
        const nuevaHora = new Date();
        nuevaHora.setHours(parseInt(h));
        nuevaHora.setMinutes(parseInt(m));
        nuevaHora.setSeconds(0);
        setHora(nuevaHora);

        const transporte = await obtenerTransporteId(data?.medioTransporte_id);
        setTransporteInput(`${transporte.nombre} - ${transporte.patente}`);
        

        const choferesData = await obtenerUsuariosChoferPorEmpresa(userInfo.empresa_id);
        setChoferes(choferesData);
        console.log('id de choferes',data.usuarioEmpresa_id)
         console.log(' choferes',choferesData)
        const choferSeleccionado = choferesData.find(
   
        (c: Chofer) => c.UsuarioEmpresas[0]?.id === data.usuarioEmpresa_id
        );
        console.log(' choferes seleccionado',choferSeleccionado)
        if (choferSeleccionado) {
        setChoferInput(`${choferSeleccionado.nombre} ${choferSeleccionado.apellido}`);
        } else {
        setChoferInput(''); // o algún valor por defecto si no se encuentra
        }


      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar el viaje');
      }
    };

    fetchData();

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

    const cargarDatos = async () => {
      if (!userInfo?.empresa_id) return;

      try {
        const c = await obtenerUsuariosChoferPorEmpresa(userInfo.empresa_id);
        setChoferes(c);
      } catch (e) {
        console.error('Error al cargar choferes', e);
      }

      try {
        const t = await obtenerTransportePorEmpresa(userInfo.empresa_id);
        setTransportes(t);
      } catch (e) {
        console.error('Error al cargar transportes', e);
      }
    };
    cargarDatos();

    if (Platform.OS === 'web') {
      const handleClickOutside = (event: MouseEvent) => {
        if (origenRef.current && !origenRef.current.contains(event.target as Node)) {
          setSugerenciasOrigen([]);
        }
        if (destinoRef.current && !destinoRef.current.contains(event.target as Node)) {
          setSugerenciasDestino([]);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userInfo?.empresa_id]);
  if (!viaje) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cargando datos del viaje...</Text>
    </View>
  );
}


  const filtrarSugerencias = (texto: string, tipo: 'origen' | 'destino') => {
    const sugerencias = localidades.filter((l) =>
      l.toLowerCase().startsWith(texto.toLowerCase())
    );
    tipo === 'origen' ? setSugerenciasOrigen(sugerencias) : setSugerenciasDestino(sugerencias);
  };

  const filtrarChoferes = (texto: string) => {
    const sugerencias = choferes
      .filter((c) => `${c.nombre} ${c.apellido} `.toLowerCase().includes(texto.toLowerCase()))
      .map((c) => ` ${c.nombre} ${c.apellido}`);
    setSugerenciasChofer(sugerencias);
  };

  const filtrarTransportes = (texto: string) => {
    const sugerencias = transportes
      .filter((t) => `${t.nombre} - ${t.patente} `.toLowerCase().includes(texto.toLowerCase()))
      .map((t) => ` ${t.nombre} - ${t.patente}`);
    setSugerenciasTransporte(sugerencias);
  };

 const onChangeDate = (_: any, selectedDate?: Date) => {
  setShowDatePicker(false);
  if (selectedDate) {
    // Crear una fecha en hora local (sin desfase UTC)
    const localDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    setFecha(localDate);
  }
};

  const onChangeTime = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    console.log('ver selectime', selectedTime)
    if (selectedTime) setHora(new Date(selectedTime.setSeconds(0)));
  };

  const handleGuardar = async () => {
  if (!origen || !destino || !hora || !fechaViaje || !precio || !usuarioEmpresa_id || !medioTransporte_id) {
    const mensaje = 'Por favor, completa todos los campos';
    if (Platform.OS === 'web') {
      alert(mensaje);
    } else {
      Alert.alert(mensaje);
    }
    return;
  }

  const horarioSalida = hora.toTimeString().split(' ')[0]; // hh:mm:ss
  console.log('hora:', horarioSalida);
  console.log('fecha:', fechaViaje);

  const viajeActualizado = {
    origenLocalidad: origen,
    destinoLocalidad: destino,
    horarioSalida,
    fechaViaje: fechaViaje.toISOString().substring(0, 10),
    precio: parseFloat(precio),
    usuarioEmpresa_id,
    medioTransporte_id,
  };
  console.log('datos:', viajeActualizado);

  try {
    await actualizarViaje(Number(id), viajeActualizado);

    const mensaje = 'Viaje Actualizado correctamente';
    if (Platform.OS === 'web') {
      alert(mensaje);
    } else {
      Alert.alert(mensaje);
    }

    navigation.goBack();
  } catch (e: any) {
    console.error('Error al editar el viaje:', e);

    const errores = e?.response?.data?.errores;

    if (errores && Array.isArray(errores)) {
      const mensajeError = errores.map((err: any) => err.msg).join('\n');
      if (Platform.OS === 'web') {
        alert('Error en los datos:\n' + mensajeError);
      } else {
        Alert.alert('Error en los datos:', mensajeError);
      }
    } else {
      const mensajeError = e?.response?.data?.error || 'Error al editar el viaje';
      if (Platform.OS === 'web') {
        alert('Error: ' + mensajeError);
      } else {
        Alert.alert('Error', mensajeError);
      }
    }
  }
};


  return (
    
  <KeyboardAvoidingView
    style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
      >
       

        <Text style={styles.label}>Origen</Text>
        {Platform.OS === 'web' ? (
                    <div ref={origenRef} style={styles.inputContainerWeb}>
                      <input
                        style={styles.inputWeb}
                        placeholder="Origen"
                        value={origen}
                        onChange={(e) => {
                          setOrigen(e.target.value);
                          filtrarSugerencias(e.target.value, 'origen');
                        }}
                      />
                      {origen.length > 0 && (
                        <button onClick={() => {
                          setOrigen('');
                          setSugerenciasOrigen([]);
                        }} style={styles.clearButton}>✕</button>
                      )}
                      {sugerenciasOrigen.length > 0 && (
                        <div style={styles.suggestionBox}>
                          {sugerenciasOrigen.map((s, idx) => (
                            <div key={idx} onClick={() => {
                              setOrigen(s);
                              setSugerenciasOrigen([]);
                            }} style={styles.suggestion}>{s}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
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
            <Pressable
              onPress={() => {
                setOrigen('');
                setSugerenciasOrigen([]);
              }}
              style={styles.clearIconContainer}
            >
              <Icon name="times-circle" size={20} color="#aaa" />
            </Pressable>
          )}
        </View>
        {sugerenciasOrigen.length > 0 && (
          <View style={styles.suggestionBox}>
            {sugerenciasOrigen.map((s, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setOrigen(s);
                  setSugerenciasOrigen([]);
                }}
              >
                <Text style={styles.suggestion}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}</>
             )}
                  

        <Text style={styles.label}>Destino</Text>

        {Platform.OS === 'web' ? (
            <div ref={destinoRef} style={styles.inputContainerWeb}>
              <input
                style={styles.inputWeb}
                placeholder="Destino"
                value={destino}
                onChange={(e) => {
                  setDestino(e.target.value);
                  filtrarSugerencias(e.target.value, 'destino');
                }}
              />
              {destino.length > 0 && (
                <button onClick={() => {
                  setDestino('');
                  setSugerenciasDestino([]);
                }} style={styles.clearButton}>✕</button>
              )}
              {sugerenciasDestino.length > 0 && (
                <div style={styles.suggestionBox}>
                  {sugerenciasDestino.map((s, idx) => (
                    <div key={idx} onClick={() => {
                      setDestino(s);
                      setSugerenciasDestino([]);
                    }} style={styles.suggestion}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
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
            <Pressable
              onPress={() => {
                setDestino('');
                setSugerenciasDestino([]);
              }}
              style={styles.clearIconContainer}
            >
              <Icon name="times-circle" size={20} color="#aaa" />
            </Pressable>
          )}
        </View>
        {sugerenciasDestino.length > 0 && (
          <View style={styles.suggestionBox}>
            {sugerenciasDestino.map((s, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setDestino(s);
                  setSugerenciasDestino([]);
                }}
              >
                <Text style={styles.suggestion}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}
        </>
          )}

        <Text style={styles.label}>Fecha</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={fechaViaje.toISOString().substring(0, 10)}
              onChange={(e) => setFecha(new Date(e.target.value))}
              style={styles.webInput}
            />
          ) : (
            <>
              <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text> {fechaViaje.getFullYear()}-{(fechaViaje.getMonth() + 1).toString().padStart(2, '0')}-{fechaViaje.getDate().toString().padStart(2, '0')}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={fechaViaje}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Hora</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={hora.toTimeString().substring(0, 5)}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':');
                const nuevaHora = new Date(hora);
                nuevaHora.setHours(parseInt(h));
                nuevaHora.setMinutes(parseInt(m));
                nuevaHora.setSeconds(0);
                setHora(nuevaHora);
              }}
              style={styles.webInput}
            />
          ) : (
            <>
              <Pressable style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Text>{hora.toTimeString().substring(0, 5)}</Text>
              </Pressable>
              {showTimePicker && (
                <DateTimePicker
                  value={hora}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={onChangeTime}
                />
              )}
            </>
          )}
        <Text style={styles.label}>Precio</Text>
          {Platform.OS === 'web' ? (
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              style={{
                padding: 10,
                fontSize: 16,
                width: '100%',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                marginBottom: 10,
                fontFamily: 'sans-serif'
              }}
            />
          ) : (

          <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
          )}

       <Text style={styles.label}>Chofer</Text>
                 <TextInput
                   style={styles.input}
                   placeholder="Buscar chofer"
                   placeholderTextColor="#888"
                   value={choferInput}
                   
                   onChangeText={(text) => {
                     setChoferInput(text);
                     filtrarChoferes(text);
                     
                   }}
                   
                   
                 />
                 
                 {sugerenciasChofer.map((s, i) => (
                <Pressable
                   key={i}
                   onPress={async () => {
                     const chofer = choferes.find(c => ` ${c.nombre} ${c.apellido}` === s);
                     if (chofer) {
                       setChoferInput(s);
                       setUsuarioEmpresa(chofer.UsuarioEmpresas[0]?.id.toString() ?? '');
                       setSugerenciasChofer([]);
        
                       // Llamar al servicio para obtener los viajes del chofer
                      try {
                       console.log('ver choferes.id', chofer.id);
                       const dataChofer = await obtenerViajesPorChofer(chofer.id);
       
                       console.log('ver informacion de la respuesta', dataChofer);
       
                       if (Platform.OS === 'web') {
                       const confirmar = window.confirm(
                         (dataChofer.message || 'Viajes cargados correctamente.') + '\n\n¿Querés ver los viajes?'
                       );
                       if (confirmar) {
                         console.log('Viajes:', dataChofer.viajes);
                         router.push({
                           pathname: '/pantallas/viajesChofer',
                           params: {
                             viajes: JSON.stringify(dataChofer.viajes)
                           }
                         });
                       }
                     } else {
                         Alert.alert(
                           "Información del Chofer",
                           dataChofer.message || 'Viajes cargados correctamente',
                           [
                             {
                               text: "Ver viajes",
                               onPress: () => {
                                 console.log('Viajes:', dataChofer.viajes);
                                 router.push({
                                   pathname: '/pantallas/viajesChofer',
                                   params: {
                                     viajes: JSON.stringify(dataChofer.viajes)
                                   }
                                 });
                               }
                             },
                             {
                               text: "Cerrar",
                               style: "cancel"
                             }
                           ]
                         );
                       }
       
                     } catch (error: any) {
                       console.error('Error:', error);
       
                       const mensajeError =
                         error.response?.data?.error || 'Error al obtener los viajes del chofer.';
       
                       if (Platform.OS === 'web') {
                         window.alert(mensajeError);
                       } else {
                         Alert.alert('Error', mensajeError, [{ text: "Cerrar" }]);
                       }
                     }
       
                     }
                   }}
                 >
                   <Text style={styles.suggestion}>{s}</Text>
                   
                 </Pressable>
                 ))}
       
                 <Text style={styles.label}>Transporte</Text>
                 <TextInput
                   style={styles.input}
                   placeholder="Buscar transporte"
                   placeholderTextColor="#888"
                   value={transporteInput}
                   onChangeText={(text) => {
                     setTransporteInput(text);
                     filtrarTransportes(text);
                   }}
                 />
                 {sugerenciasTransporte.map((s, i) => (
                   <Pressable key={i} onPress={async () => {
                     const transporte = transportes.find(t => ` ${t.nombre} - ${t.patente}` === s);
                     if (transporte) {
                       setTransporteInput(s);
                       setMedioTransporte(transporte.id.toString());
                       setSugerenciasTransporte([]);
       
       
                               try {
                   console.log('ver transporte.id', transporte.id);
                   const dataTransporte = await obtenerViajesPorTransporte(transporte.id);
       
                   console.log('ver informacion de la respuesta', dataTransporte);
       
                   if (Platform.OS === 'web') {
                     const confirmar = window.confirm(
                       (dataTransporte.message || 'Viajes cargados correctamente.') + '\n\n¿Querés ver los viajes?'
                     );
                     if (confirmar) {
                       console.log('Viajes:', dataTransporte.viajes);
                       router.push({
                         pathname: '/pantallas/viajesChofer',
                         params: {
                           viajes: JSON.stringify(dataTransporte.viajes)
                         }
                       });
                     }
                   } else {
                     Alert.alert(
                       "Información del Transporte",
                       dataTransporte.message || 'Viajes cargados correctamente',
                       [
                         {
                           text: "Ver viajes",
                           onPress: () => {
                             console.log('Viajes:', dataTransporte.viajes);
                             router.push({
                               pathname: '/pantallas/viajesChofer',
                               params: {
                                 viajes: JSON.stringify(dataTransporte.viajes)
                               }
                             });
                           }
                         },
                         {
                           text: "Cerrar",
                           style: "cancel"
                         }
                       ]
                     );
                   }
       
                 } catch (error: any) {
                   console.error('Error:', error);
       
                   const mensajeError =
                     error.response?.data?.error || 'Error al obtener los viajes del transporte.';
       
                   if (Platform.OS === 'web') {
                     window.alert(mensajeError);
                   } else {
                     Alert.alert('Error', mensajeError, [{ text: "Cerrar" }]);
                   }
                 }
       
                     }
                   }}>
                     <Text style={styles.suggestion}>{s}</Text>
                   </Pressable>
                 ))}
       

        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>Guardar Viaje</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
};

export default EditarViaje;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 8,
  },
  webInput: {
    padding: 10, marginBottom: 8, borderWidth: 1, borderRadius: 8, width: '100%',
  },
  suggestion: {
    backgroundColor: '#f0f0f0', padding: 10, borderBottomWidth: 1, borderColor: '#ccc',fontFamily: 'Arial',
  },
   button: {
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
  
   clearIcon: {
    marginLeft: 8,
  },
  suggestionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
    

  },

 inputContainerWeb: {
    position: 'relative',
    marginBottom: 12,
  },
  inputWeb: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 18,
  },

  inputContainer: {
  position: 'relative',
  marginBottom: 12,
  },

inputWithIcon: {
  borderWidth: 1,
  borderColor: '#ccc',
  paddingVertical: 10,
   paddingLeft: 10,
  paddingRight: 36, // espacio para el ícono
  borderRadius: 8,
  backgroundColor: '#fff',
  fontSize: 16,
},

clearIconContainer: {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: [{ translateY: -10 }],
  padding: 1,
  zIndex: 1,
},


});