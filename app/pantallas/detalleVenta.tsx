import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { obtenerVentaDetalle } from '../../services/ventaService';
import { obtenerUsuarioPorId } from '../../services/usuarioService';
import { generarHTMLComprobante } from '../../utils/imprimirComprobante';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '@/context/AuthContext';


export default function DetalleVenta() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<DataComprobante | null>(null);
  const [loading, setLoading] = useState(true);

  interface Pasajero {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    ubicacionOrigen: string;
    ubicacionDestino: string;
  }

  interface Usuario {
    id: number;
    usuario: string;
   
    email?: string;
  }

  interface VentaDetalleGeneral {
    id: number;
    origenLocalidad: string;
    destinoLocalidad: string;
    horarioSalida: string;
    fechaViaje: string;
    precio: number;
    chofer: string;
    medioTransporte_id: number;
    pasajeros: Pasajero[];
    fecha: string;
    hora: string;
    totalVentas: number;
    reserva_id: number;
    formaPago: string | null;
    subTotal: number | null;
    descuento: number | null;
    precioFinal: number | null;
    ventas_id: number;
  }

  interface DataComprobante extends VentaDetalleGeneral {
    usuario: Usuario;
  }
 const { userInfo } = useAuth();

useEffect(() => {
  if (id && userInfo?.id) {
    setLoading(true);
    Promise.all([
      obtenerVentaDetalle(Number(id)),
      obtenerUsuarioPorId(userInfo.id)
    ])
      .then(([venta, usuarioArray]) => {
        const usuario = Array.isArray(usuarioArray) ? usuarioArray[0] : usuarioArray;
        setData({ ...venta, usuario, empresa: venta.empresa });

      })
  
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      })
      .finally(() => setLoading(false));
  }
}, [id, userInfo]);

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return ` ${day}/${month}/${year}`;
  };

  

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return ` ${hours}:${minutes}`;
  };

  const handleDownload = async () => {
    if (!data) return;

    const htmlContent = generarHTMLComprobante(data);

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el comprobante.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>No hay detalles disponibles.</Text>
      </View>
    );
  }

  const {
    origenLocalidad,
    destinoLocalidad,
    horarioSalida,
    fechaViaje,
    pasajeros,
    fecha,
    hora,
    subTotal,
    descuento,
    precioFinal,
    formaPago,
    usuario
  } = data;
  


  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.successMessage}>✅ ¡Compra realizada con éxito!</Text>

      <View style={styles.receipt}>
        <Text style={styles.receiptTitle}>RECIBO DE COMPRA</Text>
        <View style={styles.separator} />

        {/* DATOS DEL USUARIO */}
        <Text style={styles.sectionTitle}>🙋 Usuario</Text>
        <Text style={styles.receiptText}>Nombre: {usuario.usuario} </Text>
        <Text style={styles.receiptText}>Email: {usuario.email || 'N/A'}</Text>

        <View style={styles.separator} />

        {/* VIAJE */}
        <Text style={styles.sectionTitle}>🚌 Viaje</Text>
        <View style={styles.viajeBox}>
          <Text style={styles.viajeText}>Origen: {origenLocalidad}</Text>
          <Text style={styles.viajeText}>Destino: {destinoLocalidad}</Text>
          
          <Text style={styles.viajeText}>Fecha: {formatDate(fechaViaje)}</Text>
          <Text style={styles.viajeText}>Hora: {formatTime(horarioSalida)}</Text>
        </View>

        <View style={styles.separator} />

        {/* PASAJEROS */}
        <Text style={styles.sectionTitle}>👤 Pasajeros</Text>
        <FlatList
          data={pasajeros || []}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.pasajeroItem}>
              <Text style={styles.receiptText}>Nombre: {item.nombre} {item.apellido}</Text>
              <Text style={styles.receiptText}>DNI: {item.dni}</Text>
              <Text style={styles.receiptText}>Origen: {item.ubicacionOrigen}</Text>
              <Text style={styles.receiptText}>Destino: {item.ubicacionDestino}</Text>
              <View style={styles.innerSeparator} />
            </View>
          )}
        />

        {/* DETALLE DE VENTA */}
        <Text style={styles.sectionTitle}>🧾 Detalle de Venta</Text>
        <Text style={styles.receiptText}>Fecha Venta: {formatDate(fecha)}</Text>
        <Text style={styles.receiptText}>Hora: {formatTime(hora)}</Text>
        <Text style={styles.subTotal}>Subtotal: ${subTotal}</Text>
        <Text style={styles.receiptText}>Descuento: {descuento}%</Text>
        <Text style={styles.totalFinal}>Total: ${precioFinal}</Text>
        <Text style={styles.receiptText}>Forma de Pago: {formaPago ?? 'N/A'}</Text>

        <View style={styles.separator} />
        <Text style={styles.footer}>¡Gracias por su compra!</Text>
        <Button title="📄 Descargar Comprobante" onPress={handleDownload} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  receipt: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  innerSeparator: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginVertical: 6,
  },
  receiptText: {
    fontSize: 16,
    color: '#333',
  },
  pasajeroItem: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
  viajeBox: {
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  viajeText: {
    fontSize: 16,
    color: '#004080',
    marginBottom: 4,
    fontWeight: '600',
  },
  subTotal: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
  },
  totalFinal: {
    fontSize: 18,
    color: '#d9534f',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
});