import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TelaInicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard (Início)</Text>
      <Text>Aqui ficarão as estatísticas e gráficos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});