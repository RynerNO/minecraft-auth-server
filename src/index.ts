import express from 'express'
import cors from 'cors';
import router from './router/index'
import { log } from './helpers'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from '@src/config'
import axios from 'axios'
mongoose.connect(config.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
    log('Mongoose conncted')
})
const app = express();
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))
app.use(router)

function herokuAntiSleep() {
    const port = config.PORT 
    const herokuhost = config.HEROKU_HOST
    console.log(port)
    setInterval(() => {
        axios.get(`${herokuhost}`);
        axios.get(`http://localhost:${port}`)
        axios.post(`http://localhost:${port}`, {
            'adsadasda': 'adsadasd'
        })
    }, 1200000)
}


app.listen(config.PORT, () => {
    herokuAntiSleep()
    log(`API is listening on port ${config.PORT}.`)
})

export default app;