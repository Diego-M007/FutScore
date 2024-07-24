import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Importando as páginas que aparecerão

import Routes from "./src/routes/Routes";
// Const para o uso do Stack (rotas)
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
