import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Alert(props) {
  
  return (
    <View style={estilos.modal}>
      <TouchableOpacity style={{flex: 1, zIndex: 9}} onPress={()=>props.onClick(true)}/>
      <View style={estilos.containerModal}>
        <Text style={estilos.titleModal}>{props.title}</Text>
        <View style={{width: '90%', height: 2, backgroundColor: '#000', alignSelf: 'center', marginVertical: 20}}/>
        <Text style={estilos.textModal}>{props.msg}</Text>
        <View style={estilos.viewButtons}>
          {props.buttons > '1' && 
          <TouchableOpacity
            style={[estilos.btn, estilos.btnModal]}
            onPress={() => {props.onClick(false)}}
          >
            <Text style={estilos.textBtnModal}>Cancelar</Text>
          </TouchableOpacity>
          }
          <TouchableOpacity
            style={[estilos.btn, estilos.btnModal]}
            onPress={() => {props.onClick(true)}}
          >
            <Text style={estilos.textBtnModal}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const estilos = StyleSheet.create({
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
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

  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.8)',
  },

  containerModal: {
    position: 'absolute',
    width: 300,
    marginTop: '50%',
    paddingBottom: 20,
    backgroundColor: '#fff',
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