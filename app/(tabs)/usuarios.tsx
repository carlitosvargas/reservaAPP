import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { obtenerUsuarios, actualizarPerfil } from '../../services/usuarioService';
import { obtenerEmpresas, asociarUsuarioEmpresa, obtenerUsuarioEmpresaAsociado, desasociarUsuarioEmpresa} from '../../services/empresaService';
import { useAuth } from '../../context/AuthContext';
import { Redirect } from 'expo-router';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  usuario: string;
  contrasenia: string;
  perfil_id: number;
  empresa_id?: number | null;
}

interface Empresa {
  id: number;
  nombre: string;
}

const perfiles = [
  { key: 1, label: 'Administrador' },
  { key: 2, label: 'Empresa' },
  { key: 3, label: 'Mostrador' },
  { key: 4, label: 'Chofer' },
  { key: 5, label: 'Cliente' },
];

export default function UsuariosScreen() {
  const { userInfo } = useAuth();

  if (userInfo?.perfil !== 'usuarioAdministrador') {
    return <Redirect href="/login" />;
  }

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<number | null>(null);
  const [empresaAsociadaMap, setEmpresaAsociadaMap] = useState<{ [key: number]: number | null }>({});
  const [erroresAsociacion, setErroresAsociacion] = useState<{ [key: number]: string | null }>({});



  const ultimaSeleccionRef = useRef<{ usuarioId: number; perfilId: number } | null>(null);

  useEffect(() => {
    obtenerUsuario();
    obtenerEmpresa();
  }, []);

  const obtenerUsuario = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerEmpresa = async () => {
    try {
      const data = await obtenerEmpresas();
      
      setEmpresas(data);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
    }
  };


const obtenerEmpresaAsociadaDelUsuario = async (usuarioId: number) => {
  try {
    const empresaId = await obtenerUsuarioEmpresaAsociado(usuarioId);
    
    return empresaId;
  } catch (error) {
    
    return null;
  }
};

const toggleExpand = async (id: number) => {
  if (!empresaAsociadaMap[id]) {
    const empresaId = await obtenerEmpresaAsociadaDelUsuario(id);
    setEmpresaAsociadaMap((prev) => ({ ...prev, [id]: empresaId }));
  }
  setSeleccionado(seleccionado === id ? null : id);
};



  const filtrarPorPerfil = (perfilId: number | null) => {
    setFiltro(perfilId);
    if (perfilId === null) {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtrados = usuarios.filter((u) => u.perfil_id === perfilId);
      setUsuariosFiltrados(filtrados);
    }
    setSeleccionado(null);
  };

  const obtenerNombrePerfil = (id: number): string => {
    switch (id) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Empresa';
      case 3:
        return 'Mostrador';
      case 4:
        return 'Chofer';
      case 5:
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  };

  const cambiarPerfilUsuario = async (usuarioId: number, nuevoPerfilId: number) => {
    try {
      await actualizarPerfil(usuarioId, nuevoPerfilId);

      const nuevosUsuarios = usuarios.map((u) =>
        u.id === usuarioId ? { ...u, perfil_id: nuevoPerfilId } : u
      );
      setUsuarios(nuevosUsuarios);

      if (filtro === null) {
        setUsuariosFiltrados(nuevosUsuarios);
      } else {
        setUsuariosFiltrados(nuevosUsuarios.filter((u) => u.perfil_id === filtro));
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

const asociarEmpresaUsuario = async (usuarioId: number, empresaId: number) => {
  try {
    
    await asociarUsuarioEmpresa(usuarioId, empresaId);

    const nuevosUsuarios = usuarios.map((u) =>
      u.id === usuarioId ? { ...u, empresa_id: empresaId } : u
    );
    setUsuarios(nuevosUsuarios);

    if (filtro === null) {
      setUsuariosFiltrados(nuevosUsuarios);
    } else {
      setUsuariosFiltrados(nuevosUsuarios.filter((u) => u.perfil_id === filtro));
    }

    setErroresAsociacion((prev) => ({ ...prev, [usuarioId]: null }));
    setEmpresaAsociadaMap((prev) => ({ ...prev, [usuarioId]: empresaId })); 

  } catch (error: any) {
    const mensajeError = error.response?.data?.mensaje || 'Error al asociar empresa';
    setErroresAsociacion(prev => ({ ...prev, [usuarioId]: mensajeError }));
    console.error('Error al asociar empresa:', mensajeError);
  
  }
};


  const desasociarUsuario = async (usuarioId: number) => {
  try {
    await desasociarUsuarioEmpresa(usuarioId); 

    // Actualiza el estado de los usuarios y el mapa de empresas asociadas
    const nuevosUsuarios = usuarios.map((u) =>
      u.id === usuarioId ? { ...u, empresa_id: null } : u
    );
    setUsuarios(nuevosUsuarios);
    setEmpresaAsociadaMap((prev) => ({ ...prev, [usuarioId]: null }));
   setErroresAsociacion((prev) => ({ ...prev, [usuarioId]: null }));
    if (filtro === null) {
      setUsuariosFiltrados(nuevosUsuarios);
    } else {
      setUsuariosFiltrados(nuevosUsuarios.filter((u) => u.perfil_id === filtro));
    }
  } catch (error) {
    console.error('Error al desasociar empresa:', error);
  }
};


  const renderItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity
      onPress={() => toggleExpand(item.id)}
      style={styles.usuarioContainer}
    >
      <Text style={styles.nombre}>Usuario: {item.usuario}</Text>
      <Text>Nombre: {item.nombre} {item.apellido}</Text>
      <Text>Perfil: {obtenerNombrePerfil(item.perfil_id)}</Text>

      {seleccionado === item.id && (
        <View style={styles.detalles}>
          <Text>DNI: {item.dni}</Text>
          <Text>Teléfono: {item.telefono}</Text>
          <Text>Email: {item.email}</Text>

          <Text style={styles.cambiarPerfilTexto}>Cambiar Perfil:</Text>
          <ModalSelector
            data={perfiles}
            initValue={obtenerNombrePerfil(item.perfil_id)}
            initValueTextStyle={{ color: '#007AFF', fontWeight: 'bold' }}
            onChange={(option) => {
              const yaSeleccionado =
                ultimaSeleccionRef.current &&
                ultimaSeleccionRef.current.usuarioId === item.id &&
                ultimaSeleccionRef.current.perfilId === option.key;

              if (!yaSeleccionado) {
                ultimaSeleccionRef.current = { usuarioId: item.id, perfilId: option.key };
                cambiarPerfilUsuario(item.id, option.key);
              }
            }}
          />

         {[1, 2, 3, 4].includes(item.perfil_id) && (
          <>
            <Text style={[styles.cambiarPerfilTexto, { marginTop: 10 }]}>
              {empresaAsociadaMap[item.id] ? 'Asociado a:' : 'Asociar Empresa:'}
            </Text>

            <ModalSelector
              data={empresas
                .filter((empresa) => empresa.id !== empresaAsociadaMap[item.id]) 
                .map((empresa) => ({
                  key: empresa.id,
                  label: empresa.nombre,
                }))
              }
              initValue={
                empresaAsociadaMap[item.id]
                  ? empresas.find((e) => e.id ===  empresaAsociadaMap[item.id])?.nombre || 'Seleccione una empresa'
                  : 'Seleccione una empresa'
              }
              initValueTextStyle={{ color: '#007AFF', fontWeight: 'bold' }}
              onChange={(option) => {
                asociarEmpresaUsuario(item.id, option.key);
                //setEmpresaAsociadaMap((prev) => ({ ...prev, [item.id]: option.key }));
              }}
            />
          </>
        )}
        {erroresAsociacion[item.id] && (
          <Text style={{ color: 'red', marginTop: 5 }}>{erroresAsociacion[item.id]}</Text>
        )}

         {empresaAsociadaMap[item.id] && (
          <TouchableOpacity
            onPress={() => desasociarUsuario(item.id)}
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 5,
              alignSelf: 'flex-start',
              backgroundColor: '#F44336',
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
              
            }}
          >
            <Text style={{ color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 16,
                          letterSpacing: 0.5, }}>Desasociar Empresa</Text>
          </TouchableOpacity>
        )}


        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>

      <View style={{ marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtros }>
            {[
              { label: 'Todos', id: null },
              { label: 'Administrador', id: 1 },
              { label: 'Empresa', id: 2 },
              { label: 'Mostrador', id: 3 },
              { label: 'Chofer', id: 4 },
              { label: 'Cliente', id: 5 },
            ].map((item) => {
              const activo = filtro === item.id;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.filtroBtn, activo && styles.filtroBtnActivo, { marginTop: 16 }]}
                  onPress={() => filtrarPorPerfil(item.id)}
                >
                  <Text style={[styles.filtroTexto, activo && styles.filtroTextoActivo]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {cargando ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filtroBtn: {
     backgroundColor: '#4c68d7',
    paddingVertical: 10,
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
  filtroBtnActivo: {
    backgroundColor: '#b2babb',
  },
  filtroTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  filtroTextoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usuarioContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  detalles: {
    marginTop: 10,
  },
  cambiarPerfilTexto: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },

  deleteBotton:{
     backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  }
});
