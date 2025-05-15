import { Slot , Stack} from 'expo-router';
import { AuthProvider } from '../../context/AuthContext';


export default function PantallaLayout() {

  
  return (
    <AuthProvider>
     
        <Stack screenOptions={{
          headerShown: false, //oculta el nombre de los archivos
        }}/>
    
    </AuthProvider>
  );
}
