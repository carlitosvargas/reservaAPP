import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { obtenerTransportePorEmpresa, eliminarTransporte } from '../../services/transporteService';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

interface Empresa {
  nombre: string;
}

interface MedioTransporte {
  id: number;
  nombre: string;
  patente: string;
  marca: string;
  cantLugares: number;
  Empresa: Empresa;
}

const ListarTransportes = () => {
  const [transportes, setTransportes] = useState<MedioTransporte[]>([]);
  const { userInfo } = useAuth();
  const navigation = useNavigation();

  const esMostrador = userInfo?.perfil === 'usuarioMostrador';

  useEffect(() => {
    const fetchTransportes = async () => {
      try {
        if (userInfo?.empresa_id) {
          const data = await obtenerTransportePorEmpresa(userInfo?.empresa_id);
          setTransportes(data);
        }
      } catch (error) {
        console.error('Error al obtener transportes:', error);
      }
    };

    fetchTransportes();
  }, []);

  const handleEliminar = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas dar de baja este transporte?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarTransporte(id);
              setTransportes(transportes.filter((t) => t.id !== id));
              Alert.alert('Transporte eliminado correctamente');
            } catch (error: any) {
               console.error('Error al eliminar transporte:', error.response?.data);

            const mensajeError = error.response?.data?.error || 'Error al eliminar el transporte.';
            
            Alert.alert('Error', mensajeError);
            }
          },
        },
      ]
    );
  };

  const handleEditar = (id: number) => {
    router.push({pathname:'/pantallas/editarTransporte',params: { id: id },})
  };

  const handleAgregar = () => {
    router.push({pathname:'/pantallas/crearTransporte'})
  };

  return (
    <View style={styles.container}>
      {esMostrador && (
        <TouchableOpacity style={styles.agregarButton} onPress={handleAgregar}>
          <Text style={styles.agregarButtonText}>+ Agregar Transporte</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {transportes.length > 0 ? `${transportes[0].Empresa.nombre} - Transportes` : 'Transportes'}
      </Text>

      {transportes.length === 0 ? (
        <Text style={styles.empty}>No hay transportes activos para esta empresa.</Text>
      ) : (
        <FlatList
          data={transportes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>
                Nombre: <Text style={styles.value}>{item.nombre}</Text>
              </Text>
              <Text style={styles.label}>
                Patente: <Text style={styles.value}>{item.patente}</Text>
              </Text>
              <Text style={styles.label}>
                Marca: <Text style={styles.value}>{item.marca}</Text>
              </Text>
              <Text style={styles.label}>
                Cantidad de lugares: <Text style={styles.value}>{item.cantLugares}</Text>
              </Text>
              

              {esMostrador && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item.id)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminar(item.id)}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  agregarButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  agregarButtonText: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  card: { padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  label: { fontSize: 14, fontWeight: 'bold' },
  value: { fontWeight: 'normal' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  editButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 },
  deleteButton: { backgroundColor: '#F44336', padding: 8, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ListarTransportes;
