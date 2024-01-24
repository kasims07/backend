const express = require('express')
const app = express()
require('dotenv').config()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login', (req, res) => {
    res.send('Kasim is good')
})

app.get('/hader', (req, res) => {
  res.send('<h2> kasim is very good </h2>')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port`)
})