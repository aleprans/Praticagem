import React, { useState } from "react";
import { View, Text, Image, StyleSheet} from 'react-native'
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Logo from '../assets/logo.png'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Drawer(props){

  const [servFocus, setServfocus] = useState(true)
  const [horaFocus, setHorafocus] = useState(false)
  const [reportFocus, setReportfocus] = useState(false)


  return (
    <DrawerContentScrollView {...props} >
      <View style={estilo.header}>
        <View style={estilo.viewLogo}>
          <Image source={Logo} style={estilo.logo}/>
        </View>
        <View style={estilo.viewTextHeader} >
          <Text style={estilo.textHeader}>Praticagem</Text>
          <Text>São Sebastião</Text>
        </View>
      </View>
      <DrawerItem
        style={[estilo.item, {borderColor: servFocus ? '#f00' : '#000'}]}
        label={({focused, color}) =>
          <Text style={{ fontWeight: focused ? 'bold': 'normal', fontSize: focused ? 18 : 15 }}>
            Servicos
          </Text>
        }
        onPress={() => {
          props.navigation.navigate('servicos')
          setServfocus(true)
          setHorafocus(false)
          setReportfocus(false)
        }}
        focused={servFocus}
        icon={({ focused, color, size}) =>
          <Icon
            name={focused ? 'construct' : 'construct-outline'}
            size={size}
            color={'#777'}
          />
        }
        activeBackgroundColor="#ccc"
        activeTintColor="#000"
      />
      <DrawerItem
        style={[estilo.item, {borderColor: horaFocus ? '#f00' : '#000'}]}
        label={({focused, color}) =>
          <Text style={{ fontWeight: focused ? 'bold': 'normal', fontSize: focused ? 18 : 15 }}>
            Horas Extras
          </Text>
        }
        onPress={() => {
          props.navigation.navigate('hrExtras')
          setServfocus(false)
          setHorafocus(true)
          setReportfocus(false)
        }}
        focused={horaFocus}
        icon={({ focused, color, size}) =>
          <Icon
            name={focused ? 'cash' : 'cash-outline'}
            size={size}
            color={'#777'}
          />
        }
        activeBackgroundColor="#ccc"
        activeTintColor="#000"
      />
      <View style={estilo.separador}/>
      <DrawerItem
        style={[estilo.item, {borderColor: reportFocus ? '#f00' : '#000'}]}
        label={({focused, color}) =>
          <Text style={{ fontWeight: focused ? 'bold': 'normal', fontSize: focused ? 18 : 15 }}>
            Relatórios
          </Text>
        }
        onPress={() => {
          props.navigation.navigate('relatorios')
          setServfocus(false)
          setHorafocus(false)
          setReportfocus(true)
        }}
        focused={reportFocus}
        icon={({ focused, color, size}) =>
          <Icon
            name={focused ? 'print' : 'print-outline'}
            size={size}
            color={'#777'}
          />
        }
        activeBackgroundColor="#ccc"
        activeTintColor="#000"
      />
    </DrawerContentScrollView>
  )
}

const estilo = StyleSheet.create({
 
  header: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
    marginBottom: 10,
    backgroundColor: '#fff'
  },

  item: {
    borderStyle: 'solid', 
    borderWidth: 1,
    borderRadius: 15,
    },

  viewLogo: {
    width: 80,
    height: 80,
    paddingHorizontal: 10,
  },  

  logo: {
    width: 80,
    height: 80,
  },

  separador: {
    width: '90%', 
    height: 2, 
    marginHorizontal: 10,
    marginVertical: 10, 
    backgroundColor: '#000'
  },

  viewTextHeader: {
    flex: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: '#fff'
  },

  textHeader: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})