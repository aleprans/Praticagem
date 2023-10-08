import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, StyleSheet, View, Modal, ToastAndroid, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import MaskInput , { Masks, createNumberMask } from 'react-native-mask-input'
import { useNavigation } from "@react-navigation/native";

import ExecuteQuery from '../sql/index'
import Logo from '../assets/logo.png'
import ModalAlert from '../components/modalAlert'


export default function InsertOvertime({ route }) {
  
  const navigation = useNavigation()

  const id = route.params.id
  const animationDataLabel = useSharedValue(1)
  const animationDataInput = useSharedValue(1)
  const animationHrInicialLabel = useSharedValue(1)
  const animationHrInicialInput = useSharedValue(1)
  const animationHrFinalLabel = useSharedValue(1)
  const animationHrFinalInput = useSharedValue(1)

  const animationDataL = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationDataLabel.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationDataI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationDataInput.value, {
          duration: 1000
        })
      }]
    }
  })
 
  const animationHrInicialL = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationHrInicialLabel.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationHrInicialI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationHrInicialInput.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationHrFinalL = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationHrFinalLabel.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationHrFinalI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationHrFinalInput.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const [data, setData] = useState('')
  const [hrInicial, setHrInicial] = useState('')
  const [hrFinal, setHrFinal] = useState('')
  const [hrTotal, setHrTotal] = useState('0')
  const [modalVisible, setModalVisible] = useState(false)
  const [titleModal, setTitleModal] = useState('')
  const [msgModal, setMsgModal] = useState('')
  const [windowHeight, setWindowHeightt] = useState(Dimensions.get('window').height)
  

  useEffect(()=>{
    if(id > 0)
    selectItem()
  },[id])

  useEffect(() => {
    let total = duracao(hrInicial, hrFinal)
    if(total > 0) {
      let horas = Math.floor(total / 60)
      let minutos = total - (horas * 60)
      if(horas < 10) horas = '0'+ horas
      if(minutos < 10) minutos = '0'+ minutos
      setHrTotal(`${horas}.${minutos}`)
    }
  }, [hrInicial, hrFinal])

  function convTime(horario){
    var [hora, minuto] = horario.split(':').map(v => parseInt(v))
    if (!minuto) { // para o caso de não ter os minutos
        minuto = 0
    }
    return minuto + (hora * 60)
  }

  function duracao(hrI, hrF) {
    if(hrF < hrI ){
      let hr2 = (parseInt(hrF.substring(0,2)) + 24)
      hrF = hr2.toString()+ ':' +hrF.substring(3)
    }
    return hrT = (convTime(hrF) - convTime(hrI))
  }

  async function selectItem() {
    const select = await ExecuteQuery("SELECT * FROM hrextras WHERE id = ?", [id])
    setData(select.rows.item(0).data)
    setHrInicial(select.rows.item(0).hrinicial)
    setHrFinal(select.rows.item(0).hrfinal)
    setHrTotal(select.rows.item(0).hrtotal)
  }

  function limpar(){
    setData('')
    setHrInicial('')
    setHrFinal('')
    setHrTotal('0')
  }

  const maskTime = createNumberMask({
    separator: ':',
    precision: 2

  })

  function resultModal(status) {
    if(status) setModalVisible(false)
  }

  async function Salvar() {
    let verifica = verificar()
    let result = {}
    if(verifica) {
      if(id > 0){
        result = await ExecuteQuery("UPDATE hrextras SET data = ?, hrinicial = ?, hrfinal = ?, hrtotal = ?  WHERE id = ?",[data, hrInicial, hrFinal, hrTotal, id])
      }else{
        result = await ExecuteQuery(
          "INSERT INTO hrextras (hrinicial, hrfinal, hrtotal, data) VALUES (?, ?, ?, ?)",
          [hrInicial, hrFinal, hrTotal, data] )
      }
      if(result.rowsAffected == 1) {
        ToastAndroid.show('Dados salvos com sucesso!', ToastAndroid.LONG)
        limpar()
        navigation.navigate('hrExtras')
      }else {
        ToastAndroid.show('Erro ao salvar dados!', ToastAndroid.LONG)
      }
    }
  }

  function verificar(){
    if(data.length < 10 ){
      setTitleModal('ERRO')
      setMsgModal('A data inserida não é válida!\nDigite outra data.')
      setModalVisible(true)
      return false
    }else if(hrInicial.length < 5 || hrFinal.length < 5){
      setTitleModal('ERRO')
      setMsgModal('A hora inserida não é válida!\nDigite outra hora.')
      setModalVisible(true)
      return false
    }
    return true
  }

  return (
    <ScrollView >
      <KeyboardAvoidingView
        behavior="padding"
        style={[estilos.container, {height: windowHeight}]}
      ><Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalAlert title={titleModal} msg={msgModal} buttons='1' onClick={resultModal}/>

      </Modal>
        <View style={estilos.viewTitle}>
          <Image source={Logo} style={estilos.logo}/>
          <Text style={estilos.title}>Cadastro de Horas Extras</Text>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={[animationDataL, estilos.label]}>Data de Execução</Animated.Text>
          <Animated.View style={animationDataI}>
          <MaskInput 
            keyboardType="numeric"
            value={data}
            onChangeText={(masked, unmasked) => {setData(masked)}}
            mask={Masks.DATE_DDMMYYYY}
            style={estilos.input}
            onFocus={()=> {
              animationDataInput.value = 1.5
              animationDataLabel.value = 0.5
            }}
            onBlur={()=> {
              animationDataInput.value = 1
              animationDataLabel.value = 1
            }}
          />
          </Animated.View>
        </View>
        <View style={estilos.item}>
          <Animated.Text style={[animationHrInicialL, estilos.label]}>Hora Inicial</Animated.Text>
          <Animated.View style={animationHrInicialI}>
          <MaskInput 
            keyboardType="numeric"
            value={hrInicial}
            onChangeText={(masked, unmasked) => {setHrInicial(masked)}}
            mask={maskTime}
            maxLength={5}
            style={estilos.input}
            onFocus={() => {
              animationHrInicialLabel.value = 0.5
              animationHrInicialInput.value = 1.5
            }}
            onBlur={() => {
              animationHrInicialLabel.value = 1
              animationHrInicialInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={[animationHrFinalL, estilos.label]}>Hora Final</Animated.Text>
          <Animated.View style={animationHrFinalI}>
          <MaskInput 
            keyboardType="numeric"
            value={hrFinal}
            onChangeText={(masked, unmasked)=> {setHrFinal(masked)}}
            mask={maskTime}
            maxLength={5}
            style={estilos.input}
            onFocus={() => {
              animationHrFinalLabel.value = 0.5
              animationHrFinalInput.value = 1.5
            }}
            onBlur={() => {
              animationHrFinalLabel.value = 1
              animationHrFinalInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.item}>
          <Text style={estilos.label}>Total de horas</Text>
            <Text style={estilos.input2}>{hrTotal}</Text> 
        </View>

        <View style={estilos.viewBtn}>
          <TouchableOpacity
            style={[estilos.btn, estilos.btnCancel]}
            onPress={() => {
              limpar()
              navigation.navigate('hrExtras')
            }
            }
          >
            <Text style={estilos.textBtn}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[estilos.btn, estilos.btnSave]}
            onPress={() => Salvar()}
          >
            <Text style={estilos.textBtn}>Salvar</Text>
          </TouchableOpacity>
          
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },

  viewTitle: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    alignItems: 'center'
  },

  title: {
    flex: 1,
    marginLeft: 30, 
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    color: '#333',
    textShadowColor: 'rgba(256, 0, 0, 0.5)',
    textShadowRadius: 10
  },

  logo: {
    width: 50,
    height: 50,
    marginLeft: 5
  },

  item: {
    width: '95%',
    borderColor: '#f00',
    borderWidth: 1,
    borderRadius:10,
    alignItems: 'center',
    marginVertical: 10
  },

  input: {
    fontSize: 18,
    color: '#000',
    minWidth: 100,
    maxWidth: 200,
    textAlign: 'center'
  },

  input2: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  label: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    width: '100%',
    height: 40,
    paddingTop: 10,
    borderRadius: 10
  },

  viewBtn: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },

  btn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnCancel: {
    backgroundColor: 'rgba(256, 0, 0, 0.5)'
  },

  btnSave: {
    backgroundColor: 'rgba(0, 256, 0, 0.5)'
  },

  textBtn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowRadius: 15
  },

  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.8)',
  },

  containerModal: {
    width: 300,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginTop: '65%',
    borderRadius: 15,
    borderColor: '#f00',
    borderWidth: 2,
  },

  titleModal: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
    textShadowColor: 'rgba(256, 0, 0, 0.5)',
    textShadowRadius: 10
  },

  textModal: {
    fontSize: 18,
    textAlign: 'center'
  },

  btnModal: {
    alignSelf: 'center',
    marginTop: 20,
    borderColor: '#f00',
    backgroundColor: '#ddd'
  },

  textBtnModal: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#555'
  }
})