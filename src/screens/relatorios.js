import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import ReportServices from './reportServices';
import ReportOvertime from './reportOvertime';

const Tab = createBottomTabNavigator()
export default function Reports(){
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#DCDCDC',
          borderColor: '#f00',
          borderWidth: 1,
          height: 70
        }
      }}
    >
      <Tab.Screen 
        name='reportServices' 
        component={ReportServices} 
        options={() => ({
          tabBarIcon: ({ focused, size, color }) => {
            return <Icon name={ focused ? 'construct' : 'construct-outline'} size={size} color={'#555'}/>
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor:"#ccc",
          tabBarLabel: ({focused})=> <Text style={focused ? estilos.tabTextActive : estilos.tabText}>SERVIÇOS</Text>
          
        })
      }  
      />
      <Tab.Screen 
        name='reportOvertime' 
        component={ReportOvertime} 
        options={() => ({
          tabBarIcon: ({ focused, size, color }) => {
            return <Icon name={ focused ? 'cash' : 'cash-outline'} size={size} color={'#555'} />
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor:"#ccc",
          tabBarLabel: ({focused})=> <Text style={focused ? estilos.tabTextActive : estilos.tabText}>HORAS EXTRAS</Text>
        })
        }
        />
    </Tab.Navigator>
  )
}

const estilos = StyleSheet.create({
  tabText: {
    fontSize: 12
  },

  tabTextActive: {
    fontSize: 16,
    fontWeight: 'bold'
    // textShadowColor: '#f00',
    // textShadowRadius: 5
  }
})