import React, { useEffect, useState } from "react";
import { TextInput, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, StyleSheet, View, Modal, ToastAndroid } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'
import MaskInput , { Masks } from 'react-native-mask-input'
import { useNavigation } from "@react-navigation/native";

import ExecuteQuery from '../sql/index'
import Logo from '../assets/logo.png'
import ModalAlert from '../components/modalAlert'


export default function InsertService({ route }) {
  
  const navigation = useNavigation()

  const id = route.params.id
  const animationDataInput = useSharedValue(1)
  const animationEmbInput = useSharedValue(1)
  const animationEquipInput = useSharedValue(1)
  const animationHorimInput = useSharedValue(1)
  const animationDescrInput = useSharedValue(1)
  
  const animationDataI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationDataInput.value, {
          duration: 1000
        })
      }]
    }
  })
 
  const animationEmbI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationEmbInput.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationEquipI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationEquipInput.value, {
          duration: 1000
        })
      }]
    }
  })
  
  const animationHorimI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationHorimInput.value, {
          duration: 1000
        })
      }]
    }
  })

  const animationDescrI = useAnimatedStyle(() => {
    return {
      transform:[{
        scale: withTiming(animationDescrInput.value, {
          duration: 1000
        })
      }]
    }
  })
    
  const [data, setData] = useState('')
  const [embarcacao, setEmbarcacao] = useState('')
  const [equipamento, setEquipamento] = useState('')
  const [horimetro, setHorimetro] = useState('')
  const [descricao, setDescricao] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [titleModal, setTitleModal] = useState('')
  const [msgModal, setMsgModal] = useState('')
  

  useEffect(()=>{
    if(id > 0)
    selectItem()
  },[id])

  async function selectItem() {
    const select = await ExecuteQuery("SELECT * FROM servicos WHERE id = ?", [id])
    setData(select.rows.item(0).data)
    setEmbarcacao(select.rows.item(0).embarcacao)
    setEquipamento(select.rows.item(0).equipamento)
    setDescricao(select.rows.item(0).descricao)
    setHorimetro(select.rows.item(0).horimetro)
  }

  function limpar(){
    setData('')
    setEmbarcacao('')
    setEquipamento('')
    setHorimetro('')
    setDescricao('')
  }

  function resultModal(status) {
    if(status) setModalVisible(false)
  }

  async function Salvar() {
    let verifica = verificar()
    let result = {}
    if(verifica) {
      if(id > 0){
        result = await ExecuteQuery("UPDATE servicos SET data = ?, embarcacao = ?, equipamento = ?, descricao = ?, horimetro = ?  WHERE id = ?",[data, embarcacao, equipamento, descricao, horimetro, id])
      }else{
        result = await ExecuteQuery(
          "INSERT INTO servicos (embarcacao, equipamento, descricao, horimetro, data) VALUES (?, ?, ?, ?, ?)",
          [embarcacao, equipamento, descricao, horimetro, data] )
      }
      if(result.rowsAffected == 1) {
        ToastAndroid.show('Dados salvos com sucesso!', ToastAndroid.LONG)
        limpar()
        navigation.navigate('servicos')
      }else {
        ToastAndroid.show('Erro ao salvar dados!', ToastAndroid.LONG)
      }
    }
  }

  function verificar(){
    if(data.length < 10){
      setTitleModal('ERRO')
      setMsgModal('A data inserida não é válida!\nDigite outra data.')
      setModalVisible(true)
      return false
    }else if(embarcacao == ''){
      setTitleModal('ERRO')
      setMsgModal('O nome da embarcação é obrigatório!!\nDigite o nome da embarcação.')
      setModalVisible(true)
      return false
    }else if(equipamento == ''){
      setTitleModal('ERRO')
      setMsgModal('Obrigatório informar o equipamento!\nDigite o equipamento.')
      setModalVisible(true)
      return false
    }else if(horimetro == ''){
      setTitleModal('ERRO')
      setMsgModal('Obrigatório informar o horimetro!\nDigite o horimetro.')
      setModalVisible(true)
      return false
    }else if(descricao == ''){
      setTitleModal('ERRO')
      setMsgModal('Obrigatório informar a descrição do serviço!\nDigite a descrição.')
      setModalVisible(true)
      return false
    } return true
  }

  return (
    <ScrollView >
      <KeyboardAvoidingView
        behavior="padding"
        style={estilos.container}
      >
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalAlert title={titleModal} msg={msgModal} buttons='1' onClick={resultModal}/>

      </Modal>
        <View style={estilos.viewTitle}>
          <Image source={Logo} style={estilos.logo}/>
          <Text style={estilos.title}>Cadastro de Serviços</Text>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={estilos.label}>Data de Execução</Animated.Text>
          <Animated.View style={animationDataI}>
          <MaskInput 
            keyboardType="numeric"
            value={data}
            onChangeText={(masked, unmasked) => {setData(masked)}}
            mask={Masks.DATE_DDMMYYYY}
            style={estilos.input}
            onFocus={()=> {
              animationDataInput.value = 1.5
            }}
            onBlur={()=> {
              animationDataInput.value = 1
            }}
          />
          </Animated.View>
        </View>
        <View style={estilos.item}>
          <Animated.Text style={estilos.label}>Embarcação</Animated.Text>
          <Animated.View style={animationEmbI}>
          <TextInput 
            value={embarcacao}
            onChangeText={setEmbarcacao}
            autoCapitalize="sentences"
            style={estilos.input}
            onFocus={() => {
              animationEmbInput.value = 1.5
            }}
            onBlur={() => {
              animationEmbInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={estilos.label}>Equipamento</Animated.Text>
          <Animated.View style={animationEquipI}>
          <TextInput 
            value={equipamento}
            onChangeText={setEquipamento}
            autoCapitalize='sentences'
            style={estilos.input}
            onFocus={() => {
              animationEquipInput.value = 1.5
            }}
            onBlur={() => {
              animationEquipInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={estilos.label}>Horimetro</Animated.Text>
          <Animated.View style={animationHorimI}>
          <TextInput 
            keyboardType="numeric"
            placeholder="0"
            value={horimetro}
            onChangeText={setHorimetro}
            style={estilos.input}
            onFocus={() => {
              animationHorimInput.value = 1.5
            }}
            onBlur={() => {
              animationHorimInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.item}>
          <Animated.Text style={estilos.label}>Descrição</Animated.Text>
          <Animated.View style={animationDescrI}>
          <TextInput 
            value={descricao}
            onChangeText={setDescricao}
            autoCapitalize="sentences"
            style={estilos.input}
            onFocus={() => {
              animationDescrInput.value = 1.5
            }}
            onBlur={() => {
              animationDescrInput.value = 1
            }}
          />
          </Animated.View>
        </View>

        <View style={estilos.viewBtn}>
          <TouchableOpacity
            style={[estilos.btn, estilos.btnCancel]}
            onPress={() => {
              limpar()
              navigation.navigate('servicos')
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
    alignItems: 'center'
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