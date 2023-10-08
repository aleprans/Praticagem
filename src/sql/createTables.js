import ExecuteQuery from './index'

export default async function createTables() {

  await ExecuteQuery("CREATE TABLE IF NOT EXISTS servicos"
    +" (id INTEGER PRIMARY KEY AUTOINCREMENT,"
    +" embarcacao TEXT,"
    +" equipamento TEXT,"
    +" descricao TEXT,"
    +" horimetro TEXT,"
    +" data TEXT)"
  )

  await ExecuteQuery("CREATE TABLE IF NOT EXISTS hrextras"
    +" (id INTEGER PRIMARY KEY AUTOINCREMENT,"
    +" hrinicial TEXT,"
    +" hrfinal TEXT,"
    +" hrtotal TEXT,"
    +" data TEXT)"
  )
}