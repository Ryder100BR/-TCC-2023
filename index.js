const express = require('express')
const {server: api} = require('./src/api/index') 
const app = express()
const cors = require ('cors')
const port = process.env.port || 8080
const {routes} = require("./src/routes/index");


app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/api', api)

app.listen(port, () => {
  console.log(`Servidor na porta: ${port} ${new Date()}`)
})