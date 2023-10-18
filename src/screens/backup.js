import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import Loading from "../components/loading";
import Api from '../api'
import ExecuteQuery from '../sql/index'

export default function Config() {

  const [loading, setLoading] = useState(false)
  const [notServico, setNotServico] = useState(false)

  const toggleSwitch = () => setNotServico(previousState => !previousState)

  async function exportService() {
    setLoading(true)
    const result = await ExecuteQuery("SELECT * from servicos")
    for(i = 0; i < result.rows.length; i++) {
      await Api.post('/12', {
        embarcacao: result.rows.item(i).embarcacao,
        equipamento: result.rows.item(i).equipamento,
        descricao: result.rows.item(i).descricao,
        horimetro: result.rows.item(i).horimetro,
        data: result.rows.item(i).data
      })
    }
    setLoading(false)
  }
  
  async function exportOvertime() {
    setLoading(true)
    const result = await ExecuteQuery("SELECT * from hrextras")
    for(i = 0; i < result.rows.length; i++) {
      await Api.post('/22', {
        hrinicial: result.rows.item(i).hrinicial,
        hrfinal: result.rows.item(i).hrfinal,
        hrtotal: result.rows.item(i).hrtotal,
        data: result.rows.item(i).data
      })
    }
    setLoading(false)
  }
  
  async function importOvertime() {
    setLoading(true)
    const result = await Api.get('/21')
    for(i = 0; i < result.data.length; i++) {
      await ExecuteQuery("INSERT INTO hrextras (data, hrinicial, hrfinal, hrtotal) VALUES (?, ?, ?, ?)",[
        result.data[i].data,
        result.data[i].hrinicial,
        result.data[i].hrfinal,
        result.data[i].hrtotal
      ])
    }
    setLoading(false)
  }
  
  async function importServices() {
    setLoading(true)
    const result = await Api.get('/11')
    for(i = 0; i < result.data.length; i++) {
      await ExecuteQuery("INSERT INTO hrextras (data, embarcacao, equipamento, descricao, horimetro) VALUES (?, ?, ?, ?, ?)",[
        result.data[i].data,
        result.data[i].embarcacao,
        result.data[i].equipamento,
        result.data[i].descricao,
        result.data[i].horimetro
      ])
    }
    setLoading(false)
  }

  return (
    <View style={estilos.container}>
      {loading ? <Loading loading={loading} /> : <>
      <View style={estilos.btnItem}>
        <Text style={[estilos.textSwitch, {textShadowColor: !notServico ? '#1E90FF' : '#fff'}]}>Serviços</Text>
        <Switch 
          value={notServico}
          onValueChange={toggleSwitch}
          trackColor={{true: '#006400', false: '#00a'}}
          thumbColor={notServico ? '#32cd32' : '#55f'}
        />
        <Text style={[estilos.textSwitch, {textShadowColor: notServico ? '#00ff00' : '#fff'}]}>Horas Extras</Text>
      </View>
      <TouchableOpacity
        style={[estilos.btn]}
        onPress={() => {
          notServico ? importOvertime() : importServices()
        }}
      >
        <View style={estilos.btnItem}>
          <Icon name="cloud-download" size={30} color={notServico ? '#32cd32' : '#1E90FF'} />
          <Text style={[estilos.btnText, {color: notServico ? '#006400' : '#00a' }]}>Importar</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={estilos.btn}
        onPress={() => {
          notServico ? exportOvertime() : exportService()
        }}
      >
        <View style={estilos.btnItem}>
          <Icon name="cloud-upload-outline" size={30} color={notServico ? '#32cd32' : '#1E90FF'} />
          <Text style={[estilos.btnText, {color: notServico ? '#006400' : '#00a' }]}>Exportar</Text>
        </View>
      </TouchableOpacity>
        
      </>}
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  btn: {
    borderColor: '#F00',
    borderWidth: 1,
    borderRadius: 10,
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },

  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },

  btnItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textSwitch: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowRadius: 5
  }
})