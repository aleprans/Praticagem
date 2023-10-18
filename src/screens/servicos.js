import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ToastAndroid, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native'
import MaskInput , { Masks } from 'react-native-mask-input'
import Icon from 'react-native-vector-icons/Ionicons'

import Loading from '../components/loading'
import ExecuteQuery from '../sql/index'
import ModalAlert from '../components/modalAlert'

export default function Servicos(){

  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState([])
  const [dadosFilter, setDadosFilter] = useState([])
  const [filterOn, setFilterOn] = useState(false)
  const [deleteModel, setDeleteModel] = useState(false)
  const [filterModel, setFilterModel] = useState(false)
  const [item, setItem] = useState('')
  const [dtIniFilter, setDtIniFilter] = useState('')
  const [dtEndFilter, setDtEndFilter] = useState('')
  const [embFilter, setEmbFilter] = useState('')
  const [equipFilter, setEquipFilter] = useState('')
  const [descrFilter, setDescrFilter] = useState('')
  const refDtend = useRef(null)
  const refembFilter = useRef(null)
  const refequipFilter = useRef(null)
  const refdescFilter = useRef(null)

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', async() => {
      setDados([])
      await allServices()
    })
    return unsubscribe
  },[navigation])

  useEffect(() => {
    if(dtIniFilter == ''  && dtEndFilter == '' && embFilter == '' && equipFilter == '' && descrFilter ==''){
      setDadosFilter(dados)
      setFilterOn(false)
    }else if((dtIniFilter.length == 10 && dtEndFilter.length == 10) || embFilter !== '' || equipFilter !== '' || descrFilter !== '') {
      filtrar()
      setFilterOn(true)
    }
  },[dtIniFilter, dtEndFilter, embFilter, equipFilter, descrFilter])

  async function allServices() {
    setLoading(true)
    const result = await ExecuteQuery("SELECT * FROM servicos ")
    let temp = []
    for(i = 0; i < result.rows.length; i++) {
      temp.push(result.rows.item(i))
    }
    setDados(orderDados([...temp]))
    setDadosFilter(orderDados([...temp]))
    setLoading(false)
  }

  async function deleteItem(status) {
    if(status) {
      const result = await ExecuteQuery("DELETE FROM servicos WHERE id = ?",[item])
      if(result.rowsAffected == 1)
        ToastAndroid.show('Serviço deletado com sucesso!', ToastAndroid.LONG)
      else 
         ToastAndroid.show('Falha ao deletar serviço!', ToastAndroid.LONG)
    }
    setDeleteModel(false)
    await allServices()
  }

  function editItem(item) {
    navigation.navigate('insertServicos', {id:item})
  }

  function converteData(data) {
    const dataOld = data.split('/')
    const dataNew = new Date(parseInt(dataOld[2], 10), parseInt(dataOld[1], 10) - 1, parseInt(dataOld[0], 10))
    return dataNew
  }

  function orderDados(dados) {
    let newDados = [...dados]

    newDados.sort((a, b)=>(converteData(a.data) > converteData(b.data)) ? 1 : (converteData(b.data) > converteData(a.data)) ? -1 : 0)
    return newDados
  }

  async function filtrar(){
    if(dtIniFilter !== "" && dtEndFilter !== "") {
      let dataInicial = converteData(dtIniFilter)
      let dataFinal = converteData(dtEndFilter)
      setDadosFilter(dadosFilter.filter(result => converteData(result.data) >= dataInicial && converteData(result.data) <= dataFinal))}
      if(embFilter !== '') {
      setDadosFilter(dadosFilter.filter(result => result.embarcacao.toLowerCase().indexOf(embFilter.toLowerCase()) > -1))
    }
    if(equipFilter !== '') {
      setDadosFilter(dadosFilter.filter(result => result.equipamento.toLowerCase().indexOf(equipFilter.toLowerCase()) > -1))
    }
    if(descrFilter !== '') {
      setDadosFilter(dadosFilter.filter(result => result.descricao.toLowerCase().indexOf(descrFilter.toLowerCase()) > -1))
    }
  }

  function LimpFilter() {
    setDtIniFilter('')
    setDtEndFilter('')
    setEmbFilter('')
    setEquipFilter('')
    setDescrFilter('')
  }

  function ListItem( { dados }) {
    return (
      <TouchableOpacity
        style={estilos.viewItem}
        onPress={() => editItem(dados.id)}
        onLongPress={() => {
            setDeleteModel(true)
            setItem(dados.id)
          }
        }
      >
        <Modal
          transparent={true}
          visible={deleteModel}
          onRequestClose={()=> setDeleteModel(false)}
          animationType="fade"
        >
          <ModalAlert title={'CONFIRMAÇÃO'} msg={'Confirma exclusão do serviço?'} buttons='2' onClick={deleteItem} />
        </Modal>
        <View style={estilos.item1}>
          <View>
            <Text style={estilos.label}>DATA</Text>
            <Text style={estilos.itemData}>{dados.data}</Text>
          </View>
          <View>
            <Text style={estilos.label}>Embarcação</Text>
            <Text style={estilos.itemData}>{dados.embarcacao}</Text>
          </View>
          <View>
            <Text style={estilos.label}>Equipamento</Text>
            <Text style={estilos.itemData}>{dados.equipamento}</Text>
          </View>
          <View>
            <Text style={estilos.label}>Horimetro</Text>
            <Text style={estilos.itemData}>{dados.horimetro}</Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={estilos.label}>Descrição</Text>
            <Text style={estilos.itemData2}>{dados.descricao}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={estilos.container}>
      {loading ? <Loading loading={loading} /> :
      <>
      <View style={estilos.viewFilter}>
        <Modal
          transparent={true}
          visible={filterModel}
        >
          <TouchableOpacity style={estilos.viewfiltros} onPress={() => setFilterModel(false)}>
            <View style={estilos.filterContext}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 16, marginBottom: 5}}>Filtrar por:</Text>
                <TouchableOpacity
                  onPress={()=> {
                    LimpFilter()
                    setFilterModel(false)
                  }}
                >
                  <Text style={{color: '#00a'}}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>
              <View style={estilos.viewDtFilter} >
                <Text style={estilos.textContext}>Data</Text>
                <View style={{flexDirection: 'row'}}>
                  <MaskInput
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={dtIniFilter}
                    onChangeText={(masked, unmasked)=> setDtIniFilter(masked)}
                    mask={Masks.DATE_DDMMYYYY}
                    style={estilos.inputDtFilter}
                    onSubmitEditing={() => dtIniFilter.length = 10 ? refDtend.current.focus() : ''}
                    blurOnSubmit={false}
                    />
                  <MaskInput
                    keyboardType="numeric"
                    returnKeyType="next"
                    value={dtEndFilter}
                    onChangeText={(masked, unmasked)=> setDtEndFilter(masked)}
                    mask={Masks.DATE_DDMMYYYY}
                    style={estilos.inputDtFilter}
                    ref={refDtend}
                  />
                  <TouchableOpacity 
                    onPress={() => {
                      setDtIniFilter('')
                      setDtEndFilter('')
                      setDadosFilter(dados)
                    }}
                  >
                    <Icon name="close-circle-outline" size={30} color={'#f00'} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={ estilos.viewTextFilter}>
                <Text style={estilos.textContext}>Embarcação</Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="sentences"
                    placeholder="__________________________"
                    style={estilos.inputTextFilter}
                    value={embFilter}
                    onChangeText={(text)=> setEmbFilter(text)}
                    ref={refembFilter}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEmbFilter('')
                      setDadosFilter(dados)}
                    }
                  >
                    <Icon name="close-circle-outline" size={30} color={'#f00'} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={ estilos.viewTextFilter}>
                <Text style={estilos.textContext}>Equipamento</Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="sentences"
                    placeholder="__________________________"
                    style={estilos.inputTextFilter}
                    value={equipFilter}
                    onChangeText={(text)=> setEquipFilter(text)}
                    ref={refequipFilter}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setEquipFilter('')
                      setDadosFilter(dados)}
                    }
                  >
                    <Icon name="close-circle-outline" size={30} color={'#f00'} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={ estilos.viewTextFilter}>
                <Text style={estilos.textContext}>Descrição</Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    autoCapitalize="sentences"
                    placeholder="__________________________"
                    style={estilos.inputTextFilter}
                    value={descrFilter}
                    onChangeText={(text)=> setDescrFilter(text)}
                    ref={refdescFilter}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setDescrFilter('')
                      setDadosFilter(dados)}
                    }
                  >
                    <Icon name="close-circle-outline" size={30} color={'#f00'} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={estilos.btnFilter}
          onPress={() =>{setFilterModel(true)}}
        >
          <Text style={[estilos.textBtnFilter, {color: filterOn ? '#33f' : '#000'}]}>Filtrar</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        maxToRenderPerBatch={10}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        style={estilos.lista}
        data={dadosFilter}
        extraData={dadosFilter}
        renderItem={({ item }) => <ListItem dados={item} />}
        keyExtractor={ item => String(item.id)}
        ListEmptyComponent={<Text style={estilos.listEmpty}>Nenhum serviço encontrado</Text>}
      />
      </>}
    </View>
  )
}

const estilos = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center'
  },

  lista: {
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 15
  },

  viewItem: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#cecece',
    padding: 5,
    marginTop: 20,
    borderRadius: 10,
    borderColor: '#f00',
    borderWidth: 1
  },
  
  item1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },

  label: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#000'
  },

  itemData: {
    color: '#000',
    marginHorizontal: 5,
    alignSelf: 'center',
    maxWidth: 80
  },

  itemData2 : {
    color: '#000',
    marginHorizontal: 5,
    alignSelf: 'center',
  },

  listEmpty: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '50%'
  },

  viewFilter: {
    width: '100%',
    alignItems: 'flex-end'
  },

  btnFilter: {
    width: 100,
    height: 30,
    marginTop: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#ddd'
  },

  textBtnFilter: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },

  viewfiltros: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  filterContext: {
    alignSelf: 'flex-end',
    marginTop: 90,
    padding: 10,
    backgroundColor: '#eee'
  },

  viewDtFilter: {
    flexDirection: 'column',
    borderColor: '#aaa',
    borderRadius: 10,
    borderWidth: 1
  },

  textContext: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  inputDtFilter: {
    width: 100,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: '#ddd'
  },

  viewTextFilter: {
    marginTop: 5,
    borderColor: '#aaa',
    borderRadius: 10,
    borderWidth: 1,
  },

  inputTextFilter: {
    backgroundColor: '#ddd',
    paddingHorizontal: 8,
    fontSize: 16,
    textAlign: 'center'
  }

})