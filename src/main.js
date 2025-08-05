import './style.css'
import { CountdownApp } from './countdown.js'

document.querySelector('#app').innerHTML = `
  <div class="countdown-container">
    <h1>Countdown App</h1>
    <div id="countdown-app"></div>
  </div>
`

const app = new CountdownApp(document.querySelector('#countdown-app'))
app.init()