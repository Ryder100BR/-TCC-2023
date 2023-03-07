const express = require('express')
const {server: api} = require('./src/api/index') 
const app = express()
const cors = require ('cors')
const port = 3000

app.get('/', (req, res) => {
  app.use(express.json())
  app.use(cors())
  app.use('/api', api)
  res.send('Servidor Backend - Daniel Ferrari Dashboards')
})

app.listen(port, () => {
  console.log(`Servidor na porta: ${port} ${new Date()}`)
})