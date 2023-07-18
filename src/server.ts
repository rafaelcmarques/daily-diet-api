import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import { mealsRoutes } from './routes/mealsRoutes'


const app = fastify()

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})


app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server is Running!')
})
