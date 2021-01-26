import { NetherWartBot as Start } from './bots'
import { app } from './app'

const bots = []

// bots.push({ name: 'username', pass: 'password' })
bots.push({ name: 'HerbaKing', pass: process.env.DEFAULT_PASS })

app(bots, Start)
