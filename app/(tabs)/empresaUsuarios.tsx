import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { obtenerUsuariosPorEmpresa, actualizarPerfil } from '../../services/usuarioService';
import { eliminarUsuario } from '../../services/usuarioService';

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
}

const perfiles = [

  //{ key: 2, label: 'Empresa' },
  { key: 3, label: 'Mostrador' },
  { key: 4, label: 'Chofer' },
 
];

export default function UsuariosScreen() {
  const { userInfo } = useAuth();

  if (userInfo?.perfil !== 'usuarioEmpresa') {
    return <Redirect href="/login" />;
  }

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<number | null>(null);

  const ultimaSeleccionRef = useRef<{ usuarioId: number; perfilId: number } | null>(null);

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    try {
      if (!userInfo?.empresa_id) return;
      const data = await obtenerUsuariosPorEmpresa(userInfo.empresa_id);

      // Mostrar solo perfiles Mostrador (3) y Chofer (4)
      const filtrados = data.filter((u:any) => u.perfil_id === 3 || u.perfil_id === 4);
      setUsuarios(filtrados);
      setUsuariosFiltrados(filtrados);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  const toggleExpand = (id: number) => {
    setSeleccionado(seleccionado === id ? null : id);
  };

  const filtrarPorPerfil = (perfilId: number | null) => {
    setFiltro(perfilId);
    const base = usuarios.filter((u) => u.perfil_id === 3 || u.perfil_id === 4);
    if (perfilId === null) {
      setUsuariosFiltrados(base);
    } else {
      setUsuariosFiltrados(base.filter((u) => u.perfil_id === perfilId));
    }
    setSeleccionado(null);
  };

  const obtenerNombrePerfil = (id: number): string => {
    switch (id) {
      
      //case 2: return 'Empresa';
      case 3: return 'Mostrador';
      case 4: return 'Chofer';
      default: return 'Desconocido';
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


        const handleEliminarUsuario = (id: number) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro que deseas eliminar este usuario?',
            [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                try {
                    await eliminarUsuario(id);
                    const nuevosUsuarios = usuarios.filter((u) => u.id !== id);
                    setUsuarios(nuevosUsuarios);
                    setUsuariosFiltrados(nuevosUsuarios.filter(u => filtro === null || u.perfil_id === filtro));
                    Alert.alert('Usuario eliminado con éxito');
                } catch (error) {
                    Alert.alert('Error', 'No se pudo eliminar el usuario');
                }
                },
            },
            ]
        );
        };

  const renderItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.usuarioContainer}>
      <Text style={styles.nombre}>Usuario: {item.usuario}</Text>
      <Text>Nombre: {item.nombre} {item.apellido}</Text>
      <Text>Perfil: {obtenerNombrePerfil(item.perfil_id)}</Text>

      {seleccionado === item.id && (
        <View style={styles.detalles}>
          <Text>DNI: {item.dni}</Text>
          <Text>Teléfono: {item.telefono}</Text>
          <Text>Email: {item.email}</Text>
          <Text style={{ marginTop: 10 }}>Cambiar perfil:</Text>
          <ModalSelector
          
            data={perfiles}
            initValue={obtenerNombrePerfil(item.perfil_id)}
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
            <Button
        title="Eliminar usuario"
        color="red"
        onPress={() => handleEliminarUsuario(item.id)}
/>
        </View>
      )}
          

    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Lista de Usuarios</Text>
      <View style={{ marginBottom: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtros}>
            {[{ label: 'Todos', id: null }, { label: 'Mostrador', id: 3 }, { label: 'Chofer', id: 4 }].map(
              (item) => {
                const activo = filtro === item.id;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.filtroBtn, activo && styles.filtroBtnActivo]}
                    onPress={() => filtrarPorPerfil(item.id)}
                  >
                    <Text style={[styles.filtroTexto, activo && styles.filtroTextoActivo]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
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
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filtroBtnActivo: {
    backgroundColor: '#007AFF',
  },
  filtroTexto: {
    color: '#000',
    fontSize: 14,
  },
  filtroTextoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usuarioContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detalles: {
    marginTop: 10,
  },
});
