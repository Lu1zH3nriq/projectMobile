import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from './screens/Login';
import Home from './screens/Home';
import Cursos from './screens/Cursos';
import CadastrarCursos from './screens/CadastrarCurso';
import Alunos from './screens/Alunos';
import CadastrarAlunos from './screens/CadastrarAlunos';
import Projetos from './screens/Projetos';
import CadastrarProjetos from './screens/CadastrarProjetos';
import Usuarios from './screens/Usuarios';
import CadastrarUsuarios from './screens/CadastrarUsuarios';




export default function App() {

  const Stack = createStackNavigator();
  
  function MyStack(){
    return(
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F05A28', 
          },
          headerTintColor: '#00427C', 
        }}
      >
        <Stack.Screen name='Entrar' component={Login} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Cursos' component={Cursos} />
        <Stack.Screen name='Cadastrar Curso' component={CadastrarCursos} />
        <Stack.Screen name='Alunos' component={Alunos} />
        <Stack.Screen name='Cadastrar Alunos' component={CadastrarAlunos} />
        <Stack.Screen name='Projetos' component={Projetos} />
        <Stack.Screen name='Cadastrar Projetos' component={CadastrarProjetos} />
        <Stack.Screen name='Usuarios' component={Usuarios} />
        <Stack.Screen name='Cadastrar Usuarios' component={CadastrarUsuarios} />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <MyStack />
    </NavigationContainer>
  );
}


