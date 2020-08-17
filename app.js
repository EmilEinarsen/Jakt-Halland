const dotenv = require('dotenv')
const express = require('express')
const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'))
app.set('views', 'src/views/pug')
app.set("view engine", "pug")

app.get('/',
	(req, res) => res.render('index')
)

app.listen(process.env.PORT)

console.log("Port: " + process.env.PORT)