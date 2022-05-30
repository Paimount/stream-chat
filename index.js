
import dotenv from 'dotenv'
import { AuthorizationCode } from 'simple-oauth2'
import express from 'express'
import { WebSocket } from 'ws'
import cryptoRandomString from 'crypto-random-string'

// Load settings
dotenv.config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const NTFY_SERVER = process.env.NTFY_SERVER
const PORT = 3000
const REDIRECT_URL = `http://localhost:${PORT}/callback`

// Initialize
const app = express()
const oauthClient = new AuthorizationCode({
  client: {
    id: CLIENT_ID,
    secret: CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://api.restream.io/',
    authorizePath: '/login'
  }
})
let oauthState = ''

// Route
app.get('/', login)
app.get('/callback', callback)
app.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT}/ to redirect Restream login page.`)
})

// Redirect to Restream login form
function login (req, res) {
  oauthState = cryptoRandomString({ length: 16 })
  res.redirect(oauthClient.authorizeURL({
    redirect_uri: REDIRECT_URL,
    state: oauthState
  }))
}

// Callback after restream login
async function callback (req, res) {
  if (req.query.state !== oauthState) {
    console.error(`OAuth2 request state and response state is not the same value! (Req: ${oauthState}, Res: ${req.query.state})`)
    process.exit()
  }

  // Exchange response code for access token
  let accessToken
  try {
    accessToken = await oauthClient.getToken({
      code: req.query.code,
      redirect_uri: REDIRECT_URL,
      scope: req.query.scope
    })
  } catch (error) {
    console.error('Aceess Token Error', error.message)
    process.exit()
  }

  // Observe twitch/youtube chat
  const token = accessToken.token.access_token
  const url = `wss://chat.api.restream.io/ws?accessToken=${token}`
  const connection = new WebSocket(url)
  connection.onmessage = (message) => {
    const data = JSON.parse(message.data.toString())

    // 4: twitch, 5: youtube
    // https://developers.restream.io/docs#chat-event-sources
    if (data.action === 'event' && (data.payload.eventTypeId === 4 || data.payload.eventTypeId === 5)) {
      const name = data.payload.eventPayload.author.displayName
      const text = data.payload.eventPayload.text

      // Send chat to ntfy
      console.log(NTFY_SERVER)
      fetch(NTFY_SERVER, {
        method: 'POST',
        body: `${name}: ${text}`
      })

      console.log(`${name}: ${text}`)
    }
  }

  console.log('Waiting for new chat...')
  res.send('Close this window and continue in the terminal.')

  // TODO: Refresh token
  // TODO: Revoke token
}
