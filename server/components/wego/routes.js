import { Router } from 'express'
import { getHotels } from './controllers'

const routes = new Router()
routes.get('/hotels', getHotels)

export default routes
