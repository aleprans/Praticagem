import { View, Text, PermissionsAndroid, TouchableOpacity } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function ReportServices() {

  async function createPDF(){
    try{
      const options = {
        html: '<H1>TESTE</H1>',
        fileName: 'test',
        directory: 'Documents'
      }

      var file = await RNHTMLtoPDF.convert(options)
      console.log(file)
    }catch (erro){
      console.log(erro.message)
    }
    // const dir = file.filePath.substring(0, 66)
    // if(!FileSystem.exists(dir)) {
    //   console.log("Diretorio não existe")
    //   return
    // }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permitir acesso ao armazenmento',
        message: 'Para gravação do PDF é preciso liberar o acesso ao armazenamento.',
        buttonNeutral: 'Pergunte-me depois',
        buttonNegative: 'Negar',
        buttonPositive: 'Permitir'
      }
    )
    // if(granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   await FileSystem.cpExternal(file.filePath, `Teste.pdf`, 'downloads')
    // }else console.log('falhou')
  }

  return(
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={() => createPDF()}>
        <Text>Relatorio de Servicos</Text>
      </TouchableOpacity>
    </View>
  )
}