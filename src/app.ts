import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import { mealsRoutes } from './routes/mealsRoutes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
