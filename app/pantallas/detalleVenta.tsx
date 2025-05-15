import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import BackButton from '../../components/BackButton';
import { obtenerVentaDetalle } from '../../services/ventaService';

export default function DetalleVenta() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      obtenerVentaDetalle(Number(id))
        .then(setData)
        .catch((error) => {
          console.error('Error al obtener detalle general:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  const { venta, detalle, viaje, pasajeros } = data;

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.successMessage}>✅ ¡Compra realizada con éxito!</Text>

      <View style={styles.receipt}>
        <Text style={styles.receiptTitle}>RECIBO DE COMPRA</Text>
        <View style={styles.separator} />

        {/* Viaje */}
        <Text style={styles.sectionTitle}>🚌 Viaje</Text>
        <Text style={styles.receiptText}>Origen: {viaje.origenLocalidad}</Text>
        <Text style={styles.receiptText}>Destino: {viaje.destinoLocalidad}</Text>
        <Text style={styles.receiptText}>Fecha: {viaje.fechaViaje}</Text>
        <Text style={styles.receiptText}>Hora: {viaje.horarioSalida}</Text>
        <View style={styles.separator} />

        {/* Pasajeros */}
        <Text style={styles.sectionTitle}>👤 Pasajeros</Text>
        <FlatList
          data={pasajeros}
          keyExtractor={(item) => item.id.toString()}
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

        {/* Venta */}
        <Text style={styles.sectionTitle}>🧾 Detalle de Venta</Text>
        <Text style={styles.receiptText}>Fecha Venta: {venta.fecha}</Text>
        <Text style={styles.receiptText}>Hora: {venta.hora}</Text>
        <Text style={styles.receiptText}>Subtotal: ${detalle.subTotal}</Text>
        <Text style={styles.receiptText}>Descuento: {detalle.descuento}%</Text>
        <Text style={styles.receiptText}>Total: ${detalle.precioFinal}</Text>
        <Text style={styles.receiptText}>Forma de Pago: {detalle.formaPago ?? 'N/A'}</Text>

        <View style={styles.separator} />
        <Text style={styles.footer}>¡Gracias por su compra!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
