import { Slot , Stack} from 'expo-router';
import { AuthProvider } from '../../context/AuthContext';


export default function PantallaLayout() {

  
  return (
    <AuthProvider>
     
        <Slot />
    
    </AuthProvider>
  );
}
