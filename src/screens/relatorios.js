import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'

import ReportServices from './reportServices';
import ReportOvertime from './reportOvertime';

const Tab = createBottomTabNavigator()
export default function Reports(){
  return (
    <Tab.Navigator
      screenOptions={({headerShown: false})}
    >
      <Tab.Screen 
        name='reportServices' 
        component={ReportServices} 
        options={() => ({
          tabBarIcon: ({ focused, size, color }) => {
            return <Icon name={ focused ? 'construct' : 'construct-outline'} size={size} color={color} />
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor:"#ccc",
          tabBarLabel: 'SERVIÇOS'
        })
      }  
      />
      <Tab.Screen 
        name='reportOvertime' 
        component={ReportOvertime} 
        options={() => ({
          tabBarIcon: ({ focused, size, color }) => {
            return <Icon name={ focused ? 'cash' : 'cash-outline'} size={size} color={color} />
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor:"#ccc",
          tabBarLabel: 'HORAS EXTRAS'
        })
        }
        />
    </Tab.Navigator>
  )
}