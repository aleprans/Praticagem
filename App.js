import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'

import SQLite from 'react-native-sqlite-storage'
import createTables from './src/sql/createTables'
import Routes from './src/routes'

global.db = SQLite.openDatabase({
  name: 'Praticagem',
  location: 'default'
}, () => {}, error => {console.log('error: '+error)})

createTables()

export default function App(){
  
  return(
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  )
}