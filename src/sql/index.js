export default ExecuteQuery = (sql, params = []) => new Promise(( res, rej ) => {
  db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, result) => {
      res(result)
    },
      (error) => {
        rej(error)
      }
    )
  })
})