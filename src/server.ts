import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import { mealsRoutes } from './routes/mealsRoutes'
import { env } from './env'
import cookie from '@fastify/cookie'


const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})


app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server is Running!')
})
