import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './src/routes/auth.routes.js'
import itemsRoutes from './src/routes/items.routes.js'
import transactionsRoutes from './src/routes/transactions.routes.js'
import issuesRoutes from './src/routes/issues.routes.js'
import usersRoutes from './src/routes/users.routes.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'SCIS API running' }))

app.use('/auth', authRoutes)
app.use('/items', itemsRoutes)
app.use('/transactions', transactionsRoutes)
app.use('/issues', issuesRoutes)
app.use('/users', usersRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`SCIS API listening on :${port}`))
