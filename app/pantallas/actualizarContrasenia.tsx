import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { actualizarContraseña } from '../../services/usuarioService';

//errores
type Errores = {
  contrasenia?: string;
  nueva?: string;
  repetir?: string;
};


export default function ModificarContrasenia() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');
  const [errores, setErrores] = useState<Errores>({});

  const handleGuardar = async () => {
  const nuevosErrores: Errores = {};

  // Validación de campos vacíos
  if (!contraseñaActual) {
    nuevosErrores.contrasenia = 'La contraseña actual es obligatoria';
  }

  if (!nuevaContraseña) {
    nuevosErrores.nueva = 'La nueva contraseña es obligatoria';
  }

  if (!repetirContraseña) {
    nuevosErrores.repetir = 'Debes repetir la nueva contraseña';
  }

  // Validación de coincidencia
  if (nuevaContraseña && repetirContraseña && nuevaContraseña !== repetirContraseña) {
    nuevosErrores.repetir = 'Las contraseñas no coinciden';
  }

  if (Object.keys(nuevosErrores).length > 0) {
    setErrores(nuevosErrores);
    return;
  }

  // Si todo está bien, limpiamos errores y continuamos
  setErrores({});

  try {
    const payload = {
      contraseñaActual,
      nuevaContraseña,
    };

    await actualizarContraseña(Number(id), payload);

    Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    router.push('/login');
  } catch (error: any) {
    const erroresFormateados: Errores = {};

    if (error.error) {
      erroresFormateados.contrasenia = error.error;
    } else if (error.mensaje) {
      erroresFormateados.contrasenia = error.mensaje;
    } else if (Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        erroresFormateados[err.path as keyof Errores] = err.msg;
      });
    } else {
      erroresFormateados.contrasenia = 'No se pudo actualizar la contraseña';
    }

    setErrores(erroresFormateados);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
     {errores.contrasenia && <Text style={styles.errorText}>{errores.contrasenia}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Contraseña Actual"
        secureTextEntry
        value={contraseñaActual}
        onChangeText={setContraseñaActual}
      />

      {errores.nueva && <Text style={styles.errorText}>{errores.nueva}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Nueva Contraseña"
        secureTextEntry
        value={nuevaContraseña}
        onChangeText={setNuevaContraseña}
      />

      {errores.repetir && <Text style={styles.errorText}>{errores.repetir}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Repetir Nueva Contraseña"
        secureTextEntry
        value={repetirContraseña}
        onChangeText={setRepetirContraseña}
      />


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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
