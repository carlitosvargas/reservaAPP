import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { obtenerUsuarios, actualizarPerfil } from '../../services/usuarioService';
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
  { key: 1, label: 'Administrador' },
  { key: 2, label: 'Empresa' },
  { key: 3, label: 'Mostrador' },
  { key: 4, label: 'Chofer' },
  { key: 5, label: 'Cliente' },
];

export default function UsuariosScreen() {

 const {  userInfo } = useAuth();
 
   if (userInfo?.perfil !== 'usuarioAdministrador') {
    return <Redirect href="/login" />;
  }
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<number | null>(null);

  // 👉 Ref para evitar doble ejecución
  const ultimaSeleccionRef = useRef<{ usuarioId: number; perfilId: number } | null>(null);

  useEffect(() => {
    obtenerUsuario();
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

  const toggleExpand = (id: number) => {
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
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Lista de Usuarios</Text>

      <View style={styles.filtros}>
        <Button title="Todos" onPress={() => filtrarPorPerfil(null)} />
        <Button title="Administrador" onPress={() => filtrarPorPerfil(1)} />
        <Button title="Empresa" onPress={() => filtrarPorPerfil(2)} />
        <Button title="Mostrador" onPress={() => filtrarPorPerfil(3)} />
        <Button title="Chofer" onPress={() => filtrarPorPerfil(4)} />
        <Button title="Cliente" onPress={() => filtrarPorPerfil(5)} />
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
    justifyContent: 'space-around',
    marginBottom: 15,
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
