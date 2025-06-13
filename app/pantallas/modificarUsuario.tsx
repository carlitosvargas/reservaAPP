import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { obtenerUsuarioPorId, actualizarUsuario } from '../../services/usuarioService'; 
import { useAuth } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function ModificarUsuario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userInfo } = useAuth();
  const [perfilId, setPerfilId] = useState<any | null>(null);
  

  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    usuario: '',
    contrsenia: '',
    perfil_id:'',
  });


useEffect(() => {
  const cargarDatos = async () => {
    try {

      const datos = await obtenerUsuarioPorId(Number(id)); 
      const usuarioData = datos[0];

      setPerfilId(usuarioData.perfil_id); 
    
      

      setUsuario({
        nombre: usuarioData.nombre ?? '',
        apellido: usuarioData.apellido ?? '',
        email: usuarioData.email ?? '',
        telefono: usuarioData.telefono?.toString() ?? '',
        usuario: usuarioData.usuario ?? '',
        contrsenia: usuario.contrsenia ?? '',
        perfil_id: usuarioData.perfil_id?.toString() ?? '',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el usuario');
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
}, []);



  const handleChange = (campo: string, valor: string) => {
    setUsuario(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    try {
      await actualizarUsuario(Number(id), usuario); 
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      router.push('/(tabs)/perfil');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el Perfil');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <View style={styles.inputGroup}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={usuario.nombre ?? ''}
        onChangeText={text => handleChange('nombre', text)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#888"
        value={usuario.apellido ?? ''}
        onChangeText={text => handleChange('apellido', text)}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={usuario.email ?? ''}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#888"
        value={usuario.telefono ?? ''}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="numeric"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor="#888"
        value={usuario.usuario ?? ''}
        onChangeText={text => handleChange('usuario', text)}
      />
    </View>
            

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
     backgroundColor: 'white'
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
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
 
  inputLike: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 15,
  paddingHorizontal: 8,
  height: 50,
  justifyContent: 'center',
  backgroundColor: '#fff',
},

pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 15,
  overflow: 'hidden',
},

picker: {
  height: 50,
  width: '100%',
  color: '#000',
},
inputGroup: {
  marginBottom: 8,
},
label: {
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 4,
  color: '#333',
},

});
