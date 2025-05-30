import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import BackButton from '@/components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilesScreen() {
  const router = useRouter();
  const { isLoggedIn, logout, isLoading, userInfo } = useAuth();
 

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
       const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);
    console.log('Contenido de AsyncStorage perfil:', allData);
  };



  return (
    <View style={styles.container}>
 
      <Text style={styles.title}>Hola {userInfo?.nombre}!</Text>

      <View style={styles.profileBox}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{userInfo?.nombre}</Text>

        
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push({pathname:'/pantallas/modificarUsuario',params:{id:userInfo.id}})}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push({pathname:'/pantallas/actualizarContrasenia',params:{id:userInfo.id}})}>
        <Text style={styles.buttonText}>Cambiar Contraseña</Text>
      </TouchableOpacity>

     {userInfo?.perfil == "usuarioEmpresa" && (
        <TouchableOpacity style={styles.button} onPress={() => router.push({pathname:'/pantallas/modificarEmpresa',params:{id:userInfo.empresa_id}})}>
        <Text style={styles.buttonText}>Editar Empresa</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});