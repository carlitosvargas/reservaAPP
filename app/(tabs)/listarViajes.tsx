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
  TextInput,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { obtenerViajesPorEmpresa,eliminarViaje } from '../../services/viajeServices';
import { useAuth } from '../../context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

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
  const [busqueda, setBusqueda] = useState('');
  
      // Estados para filtro por fechas
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  
  const [showPickerDesde, setShowPickerDesde] = useState(false);
  const [showPickerHasta, setShowPickerHasta] = useState(false);

  const [mostrarOpcionesReporte, setMostrarOpcionesReporte] = useState(false);

  const toggleOpcionesReporte = () => {
    setMostrarOpcionesReporte(prev => !prev);
    }

 const [mostrarMenuCompleto, setMostrarMenuCompleto] = useState(false);

const toggleMenu = () => {
  setMostrarMenuCompleto(!mostrarMenuCompleto);
};



  const esMostrador = userInfo?.perfil === 'usuarioMostrador';
  const esEmpresa = userInfo?.perfil === 'usuarioEmpresa';

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

  useFocusEffect(
  useCallback(() => {

    setBusqueda('');
    setFechaDesde(null);
    setFechaHasta(null);
  }, [])
);

const hayFiltrosActivos = busqueda !== '' || fechaDesde !== null || fechaHasta !== null;


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

  const handleAgregar = () => {
    router.push({pathname:'/pantallas/crearViaje'})
  };

  const handleReportes = (tipo: string) => {
  switch (tipo) {
    case 'reservas':
      router.push({ pathname: '/pantallas/reportes/reportesReservas' });
      break;
    case 'usuarios':
      router.push({ pathname: '/pantallas/reportes/reportesReservas' });
      break;
    case 'pasajeros':
      router.push({ pathname: '/pantallas/reportes/reportesReservas' });
      break;
    default:
      console.warn('Tipo de reporte no reconocido:', tipo);
  }
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

 // Filtrado combinado (busqueda texto + filtro fechas)
  const viajesFiltrados = viajes.filter((viaje) => {
    const texto = busqueda.toLowerCase();

    // Busca coincidencia texto
    const textoCoincide =
      viaje.id.toString().includes(texto) ||
      formatDate(viaje.fechaViaje).toLowerCase().includes(texto) ||
      formatTime(viaje.horarioSalida).toLowerCase().includes(texto) ||
      viaje.origenLocalidad.toLowerCase().includes(texto) ||
      viaje.destinoLocalidad.toLowerCase().includes(texto) ||
      viaje.MedioTransporte.nombre.toLowerCase().includes(texto) ||
      viaje.MedioTransporte.patente.toLowerCase().includes(texto);
    
    // Si no coincide texto, lo ignoramos directamente
    if (!textoCoincide) return false;

    // Ahora filtramos por fechas, si están definidas
    const fechaViajeDate = new Date(viaje.fechaViaje);

    // Queremos que la  fechaViaje este dentro del rango de fechaDesde y fechaHasta

    const dentroRangoDesde = fechaDesde ? (fechaViajeDate >= fechaDesde) : true;
    const dentroRangoHasta = fechaHasta ? ( fechaViajeDate <= fechaHasta) : true;

    return dentroRangoDesde && dentroRangoHasta;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setFechaDesde(null);
    setFechaHasta(null);
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


    <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => handleVerReservas(viaje.id)}
          style={[styles.botonDetalle, { marginRight: 5, flex: 1 }]}
        >
          
          <Text style={styles.textoBotonDetalle}>Ver Reservas</Text>
        </Pressable>

        {esMostrador && (
          <>
            <TouchableOpacity
              style={[styles.editButton, { marginRight: 5 }]}
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
          </>
        )}
      </View>

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
      <View style={styles.filaBotones}>
      {esMostrador && (
              <TouchableOpacity style={styles.agregarButton} onPress={handleAgregar}>
                <Text style={styles.agregarButtonText}>+ Agregar Viaje</Text>
              </TouchableOpacity>
            )}
           
     {hayFiltrosActivos && (
              <TouchableOpacity onPress={limpiarFiltros} style={styles.limpiarFiltrosButton}>
                <Text style={styles.limpiarFiltrosText}>Limpiar filtros</Text>
              </TouchableOpacity>
    )}


 <>
  {esEmpresa && (
    <View style={{ position: 'relative' }}>
      {Platform.OS === 'web' ? (
        // 🌐 Web: Menú tipo cascada
        <>
          <TouchableOpacity style={styles.agregarButton} onPress={toggleOpcionesReporte}>
            <Text style={styles.agregarButtonText}>Reportes</Text>
          </TouchableOpacity>

          {mostrarOpcionesReporte && (
      <View style={styles.menuOpcionesweb}>
        <TouchableOpacity style={styles.opcionReporteweb} onPress={() => handleReportes('reservas')}>
          <Text style={styles.opcionTextoweb}>Reporte de Reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opcionReporteweb} onPress={() => handleReportes('usuarios')}>
          <Text style={styles.opcionTextoweb}>Reporte de Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.opcionReporteweb} onPress={() => handleReportes('pasajeros')}>
          <Text style={styles.opcionTextoweb}>Reporte de Pasajeros</Text>
        </TouchableOpacity>
      </View>
    )}
        </>
      ) : (
        // 📱 Dispositivo móvil: Menú desplegable táctil
        <>
          <TouchableOpacity style={styles.agregarButton} onPress={toggleOpcionesReporte}>
            <Text style={styles.agregarButtonText}>Reportes</Text>
          </TouchableOpacity>

          {mostrarOpcionesReporte && (
            <View style={styles.menuOpciones}>
              <TouchableOpacity style={styles.opcionReporte} onPress={() => handleReportes('reservas')}>
                <Text style={styles.opcionTexto}>Reservas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opcionReporte} onPress={() => handleReportes('usuarios')}>
                <Text style={styles.opcionTexto}>Usuarios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.opcionReporte} onPress={() => handleReportes('pasajeros')}>
                <Text style={styles.opcionTexto}>Pasajeros</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  )}
</>




    </View>
      <Text style={styles.sectionTitle}>{nombreEmpresa} - Viajes</Text>
     
       {/* Input búsqueda */}
      <TextInput
        style={styles.input}
        placeholder="Buscar por fecha, origen, destino, transporte..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

     {/* Filtros de fecha */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        {/* Fecha Desde */}
        <View style={{ flex: 1, marginRight: 8 }}>
          {Platform.OS === 'web' ? (
            <>
              <Text style={styles.fechaLabel}>Fecha Desde:</Text>
              <input
                type="date"
                value={fechaDesde ? fechaDesde.toISOString().split('T')[0] : ""}
                onChange={(e) => setFechaDesde(new Date(e.target.value))}
                style={styles.dateInputWeb}
              />
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.fechaButton} onPress={() => setShowPickerDesde(true)}>
                <Text style={styles.fechaButtonText}>
                  {fechaDesde ? formatDate(fechaDesde.toISOString()) : "Fecha desde"}
                </Text>
              </TouchableOpacity>
              {showPickerDesde && (
                <DateTimePicker
                  value={fechaDesde || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_event, selectedDate) => {
                    setShowPickerDesde(false);
                    if (selectedDate) setFechaDesde(selectedDate);
                  }}
                />
              )}
            </>
          )}
        </View>

        {/* Fecha Hasta */}
        <View style={{ flex: 1, marginLeft: 8 }}>
          {Platform.OS === 'web' ? (
            <>
              <Text style={styles.fechaLabel}>Fecha Hasta:</Text>
              <input
                type="date"
                value={fechaHasta ? fechaHasta.toISOString().split('T')[0] : ""}
                onChange={(e) => setFechaHasta(new Date(e.target.value))}
                style={styles.dateInputWeb}
              />
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.fechaButton} onPress={() => setShowPickerHasta(true)}>
                <Text style={styles.fechaButtonText}>
                  {fechaHasta ? formatDate(fechaHasta.toISOString()) : "Fecha hasta"}
                </Text>
              </TouchableOpacity>
              {showPickerHasta && (
                <DateTimePicker
                  value={fechaHasta || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_event, selectedDate) => {
                    setShowPickerHasta(false);
                    if (selectedDate) setFechaHasta(selectedDate);
                  }}
                />
              )}
            </>
          )}
        </View>
      </View>

      {viajesFiltrados.map(renderViaje)}
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
  sectionTitle: {
   fontSize: 22, fontWeight: 'bold', marginBottom: 12
  },
  

  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},


buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  letterSpacing: 0.5,
},
 input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },

  filtrosHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
  marginTop: 10,
},


limpiarFiltrosText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

filaBotones: {
  flexDirection: 'row-reverse', 
  justifyContent: 'flex-start', 
  gap: 8, 
  marginBottom: 12,
},


agregarButton: {
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
agregarButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  letterSpacing: 0.5,
},
editButton: {
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

deleteButton: {
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

limpiarFiltrosButton: {
  backgroundColor: '#b2babb',
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

textoBotonDetalle: {
   color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},
fechaButton: {
  backgroundColor: '#4c68d7',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,
  marginBottom: 8,
},

fechaButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
  letterSpacing: 0.3,
},

fechaLabel: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 4,
  color: '#333',
},

dateInputWeb: {
  width: '100%',
  padding: 8,
  fontSize: 16,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 5,
  backgroundColor: '#fff',
  boxSizing: 'border-box', // importante en web para evitar overflow
},
menuOpciones: {
  position: 'absolute',
  top: '100%', // justo debajo del botón
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)', // fondo negro semitransparente
  padding: 10,
  borderRadius: 8,
  zIndex: 999, // que quede encima de todo
},
opcionReporte: {
  paddingVertical: 10,
  backgroundColor: '#4c68d7', // fondo blanco semiopaco para cada opción
  marginVertical: 5,
  borderRadius: 5,
},

opcionTexto: {
  fontSize: 14,
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},


//-------------

menuOpcionesweb: {
  backgroundColor: '#f9f9f9',
  padding: 10,
  borderRadius: 8,
  marginTop: 5, // separa del botón "Reportes"
  elevation: 2, // sombra en Android
  shadowColor: '#000', // sombra en iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
opcionReporteweb: {
  paddingVertical: 8,
},
opcionTextoweb: {
  fontSize: 16,
  color: '#333',
}


});

export default ViajesEmpresa;
