import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

import teamRouter from './routes/team.route'
import nationRouter from './routes/nation.route'
import competitionRouter from './routes/competition.route'
import seasonRouter from './routes/season.route'
import domSeasonRouter from './routes/season.dom.route'
import uefaSeasonRouter from './routes/season.uefa.route'
import matchRouter from './routes/match.route'
import rankingRouter from './routes/ranking.route'
import setupRouter from './routes/setup.route'

/*
import testRouter from './routes/testing'
*/

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/teams', teamRouter)
app.use('/api/nations', nationRouter)
app.use('/api/competitions', competitionRouter)
app.use('/api/seasons', seasonRouter)
app.use('/api/seasons/domestic', domSeasonRouter)
app.use('/api/seasons/uefa', uefaSeasonRouter)
app.use('/api/matches', matchRouter)
app.use('/api/rankings', rankingRouter)
app.use('/api/setup', setupRouter)

/*
app.use('/api/test', testRouter)
*/

app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running!' })
})

// Handle CORB for images
app.get('/api/proxy', async (req: Request, res: Response) => {
  const {url} = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).send('URL query parameter is required')
  }
  const response = await axios.get(url, {responseType: 'arraybuffer'})
  const contentType = response.headers['content-type']
  res.set('Content-Type', contentType)
  res.send(response.data)
})

export default app
