import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TelaPerfil() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Utilizador</Text>
      <Text>Aqui o utilizador poderá gerir os seus dados.</Text>
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