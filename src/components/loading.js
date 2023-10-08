import { View, StyleSheet, ActivityIndicator } from "react-native";

function loading(loading) {
  if(loading) {
    return (
      <View style={estilo.viewLoading} >
        <ActivityIndicator
          size={90}
          color='#9a9a9a'
          animating={true}
        />
      </View>
    )
  }
}

export default loading
const estilo = StyleSheet.create({
  viewLoading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd'
  }
})