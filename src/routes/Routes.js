import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, Text } from "react-native";

// Importando as páginas que aparecerão
import Partidas from "../pages/Partidas";
import Torneios from "../pages/Torneios";
import Perfil from "../pages/Perfil";
import Favoritos from "../pages/Favoritos";
import Splash from "../pages/splash";
import Login from "../pages/Login";
import DetalhesDoJogo from "../pages/DetalhesDoJogo";
import SpinRoleta from "../pages/SpinRoleta";
import PaginaLiga from "../pages/PaginaLiga";

// Importando Icons
import { FontAwesome } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import PaginaTime from "../pages/PaginaTime";

// Const para o uso do Stack (rotas)
const Tab = createBottomTabNavigator();

function CustomTabBarIcon({ iconName, label, color }) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginTop: "15%",
      }}
    >
      <FontAwesome name={iconName} size={23} color={color} />
      <Text style={{ color, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export default function Routes() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#2f9fa6",
        tabBarInactiveTintColor: "#67ced4",
        tabBarStyle: {
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 10,
          backgroundColor: "#2C2C2E",
          borderTopColor: "#2f9fa6",
          borderTopWidth: 1,
        },
      }}
    >
      <Tab.Screen
        name="Splash"
        component={Splash}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Jogos do Dia"
        component={Partidas}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <CustomTabBarIcon
              iconName="soccer-ball-o"
              label="Partidas"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tab.Screen
        name="DetalhesDoJogo"
        component={DetalhesDoJogo}
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="PaginaLiga"
        component={PaginaLiga}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="PaginaTime"
        component={PaginaTime}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tab.Screen
        name="Torneios"
        component={Torneios}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <CustomTabBarIcon
              iconName="trophy"
              label="Torneios"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <CustomTabBarIcon iconName="star" label="Favoritos" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <CustomTabBarIcon
              iconName="user-circle-o"
              label="Perfil"
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SpinRoleta"
        component={SpinRoleta}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginTop: "15%",
              }}
            >
              <Entypo name="book" size={24} color={color} />
              <Text style={{ color, fontSize: 12 }}>Álbum</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
