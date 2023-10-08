import { createDrawerNavigator } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import Icon from 'react-native-vector-icons/Ionicons'
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native'

import DrawerCuston from '../components/custonDrawer'

import Servicos from '../screens/servicos'
import HrExtras from '../screens/hrExtras'
import Relatorios from '../screens/relatorios'
import InsertServicos from '../screens/insertService'
import InsertOvertime from '../screens/insertOvertime'

export default function DrawerRoutes(){
  
  const navigation = useNavigation()
  const Drawer = createDrawerNavigator()
  
  
  function LogoInsert(){
    return (
      <Icon name='add-circle' size={40} color='#0f0'/>
    )
  }

  return (
    <Drawer.Navigator
      initialRouteName="servicos"
      backBehavior="none"
      screenOptions={{
        drawerHideStatusBarOnOpen: false,
        drawerStyle: estilos.drawer
      }}
      drawerContent={(props) => <DrawerCuston {...props} />}
    >
      <Drawer.Screen 
        name="servicos" 
        component={Servicos} 
        options={{ 
          headerTitle: (props) => {
            return (
              <View style={estilos.container}>
                <Text style={estilos.text}>SERVIÇOS</Text>
                <TouchableOpacity
                  onPress={()=>navigation.navigate('insertServicos', {id: 0})}
                >
                  <LogoInsert {...props}/>
                </TouchableOpacity>
              </View>
            )
          }
        }}
      />
      
      <Drawer.Screen 
        name="hrExtras" 
        component={HrExtras} 
        options={{ 
          headerTitle: (props) => {
            return (
              <View style={estilos.container}>
                <Text style={estilos.text}>HORAS EXTRAS</Text>
                <TouchableOpacity 
                  onPress={()=> navigation.navigate('insertOvertime', {id: 0})}
                >
                  <LogoInsert {...props} />
                </TouchableOpacity>
              </View>
            )
          }
        }}
      />
      
      <Drawer.Screen 
        name="relatorios" 
        component={Relatorios} 
        options={{ 
          headerTitle: (props) => {
            return (
              <View style={estilos.container}>
                <Text style={estilos.text}>RELATÓRIOS</Text>
                <TouchableOpacity 
                  onPress={()=>console.log('Relatorios')}
                >
                </TouchableOpacity>
              </View>
            )
          }
        }}
      />

      <Drawer.Screen name="insertServicos" component={InsertServicos} options={{headerShown: false}}/>
      <Drawer.Screen name="insertOvertime" component={InsertOvertime} options={{headerShown: false}}/>

    </Drawer.Navigator>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  text: {
    width: '85%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10
  },

  drawer: {
    backgroundColor: '#eee',
  }
})