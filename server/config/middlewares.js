import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
const app = express()

const middlewaresConfig = () => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(morgan('dev'))
}

export { middlewaresConfig }