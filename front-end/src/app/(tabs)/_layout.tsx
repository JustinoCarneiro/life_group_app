import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones para as abas

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // Cor do ícone ativo
        headerShown: false, // Vamos esconder o cabeçalho aqui para controlar em cada ecrã
      }}>
      <Tabs.Screen
        name="inicio" // Corresponde ao ficheiro inicio.tsx
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="hierarquia" // Corresponde ao ficheiro hierarquia.tsx
        options={{
          title: 'Hierarquia',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="list" color={color} />,
        }}
      />
       <Tabs.Screen
        name="perfil" // Corresponde ao ficheiro perfil.tsx
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}