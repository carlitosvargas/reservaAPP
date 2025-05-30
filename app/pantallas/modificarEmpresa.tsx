import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { obtenerEmpresaPorId, actualizarEmpresa } from '../../services/empresaService';


export default function ModificarEmpresa() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [empresa, setEmpresa] = useState({
    nombre: '',
    direccion: '',
    cuit: '',
    telefono: '',
    email: '',
    localidad_id: '',
  });

  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerEmpresaPorId(Number(id));
        const empresaData = datos[0];

        setEmpresa({
          nombre: empresaData.nombre ?? '',
          direccion: empresaData.direccion ?? '',
          cuit: empresaData.cuit ?? '',
          telefono: empresaData.telefono?.toString() ?? '',
          email: empresaData.email ?? '',
          localidad_id: empresaData.localidad_id?.toString() ?? '',
        });

       
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la empresa');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setEmpresa(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await actualizarEmpresa(Number(id), empresa);
      Alert.alert('Éxito', 'Empresa actualizada correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la empresa');
    } finally {
      setGuardando(false);
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
        value={empresa.nombre ?? ""}
        onChangeText={text => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={empresa.direccion}
        onChangeText={text => handleChange('direccion', text)}
      />

      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        placeholder="CUIT"
        value={empresa.cuit}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={empresa.telefono}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={empresa.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={empresa.localidad_id}
          onValueChange={(itemValue) => handleChange('localidad_id', itemValue)}
          mode="dropdown"
          style={styles.picker}
        >
          <Picker.Item label="Seleccione una localidad" value="" />
          {localidades.map((loc: any) => (
            <Picker.Item key={loc.id} label={loc.nombre} value={loc.id.toString()} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={guardando}>
        <Text style={styles.buttonText}>{guardando ? "Guardando..." : "Guardar Cambios"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
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
