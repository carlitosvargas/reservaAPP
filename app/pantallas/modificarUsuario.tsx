import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { obtenerUsuarioPorId, actualizarUsuario } from '../../services/usuarioService'; 
import { useAuth } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import BackButton from '../../components/BackButton';

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
     
     

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={usuario.nombre ?? ''}
        onChangeText={text => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={usuario.apellido ?? ''}
        onChangeText={text => handleChange('apellido', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Emali"
        value={usuario.email ?? ''}
        onChangeText={text => handleChange('email', text)}
        
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={usuario.telefono ?? ''}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario.usuario ?? ''}
        onChangeText={text => handleChange('usuario', text)}
      />

          {perfilId == 1 && (
              <View style={styles.pickerContainer}>
          <Picker
            selectedValue={usuario.perfil_id}
            onValueChange={(itemValue) =>
              setUsuario((prev) => ({ ...prev, perfil_id: itemValue }))
            }
            mode="dropdown" // importante para iOS
            style={styles.picker}
          >
            <Picker.Item label="Seleccione un perfil" value="" />
            <Picker.Item label="Administrador" value="1" />
            <Picker.Item label="Empresa" value="2" />
            <Picker.Item label="Mostrador" value="3" />
            <Picker.Item label="Chofer" value="4" />
            <Picker.Item label="Cliente" value="5" />
          </Picker>
        </View>

    )}


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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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
});
