class PolyrhythmCalculator extends HTMLElement {
  _timeSignature = { upper: 4, lower: 4 }
  _subdivision = 2
  _phrase = 16
  _barCount = 16
  _mode = 'subdivision'
  _buffer = ''

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
<header>Polyrhythm Calculator</header>
<div id="screen">
  <label aria-label="time signature"><span>TS</span><span>—</span><output id="time-signature">4/4</output></label>
  <label aria-label="phrase"><span>P</span><span>—</span><output id="phrase">16</output></label>
  <label aria-label="full repetitions"><span class="highlight">full reps</span><output id="full-reps">0</output></label>
  <label aria-label="subdivision"><span>S</span><span>—</span><output id="subdivision">2</output></label>
  <label aria-label="bar count"><span>BC</span><span>—</span><output id="bar-count">4</output></label>
  <label><span class="highlight">remainder</span><output id="remainder">0</output></label>
</div>
<div id="mode-buttons">
  <button value="time-signature">Time Signature</button>
  <button value="phrase">Phrase</button>
  <button value="subdivision">Subdivision</button>
  <button value="bar-count">Bar Count</button>
</div>
<div id="other-buttons">
  <div id="numbers">
    <button value="7">7</button>
    <button value="8">8</button>
    <button value="9">9</button>
    <button value="4">4</button>
    <button value="5">5</button>
    <button value="6">6</button>
    <button value="1">1</button>
    <button value="2">2</button>
    <button value="3">3</button>
    <button value="0">0</button>   
    <button id="go">GO</button>
  </div>
  <div id="subdivisions">
    <button value="1">𝅘𝅥</button>
    <button value="2">𝅘𝅥𝅮𝅘𝅥𝅮</button>
    <button value="3">3<br>𝅘𝅥𝅮𝅘𝅥𝅮𝅘𝅥𝅮</button>
    <button value="4">𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯</button>
    <button value="5">5<br>𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯</button>
    <button value="6">6<br>𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯</button>
    <button value="7">7<br>𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯𝅘𝅥𝅯</button>
    <button value="8">𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰𝅘𝅥𝅰</button>
  </div>
</div>
<style>
* {
  box-sizing: border-box;
  margin: auto;
  padding: 0;
  background-blend-mode: color-burn;
  background-size: cover;
}

:host {
  --main-light: #fdd8b4;
  --main-dark: #030400;
  --highlighter: #FFF411;
  --contrast: #759d92;
  --handwritten-font: 'Yahfie Heavy', sans-serif;
  --seven-segment-font: 'Digital7', monospace;
  --paper-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 224'%3E%3Cfilter id='pf' height='1' width='1' y='0' x='0'%3E%3CfeTurbulence numOctaves='8' seed='1234567' type='fractalNoise' baseFrequency='0.01'%3E%3C/feTurbulence%3E%3CfeDiffuseLighting lighting-color='%23eee' surfaceScale='1' kernelUnitLength='0.01' diffuseConstant='0.935'%3E%3CfeDistantLight elevation='45' azimuth='10'/%3E%3C/feDiffuseLighting%3E%3CfeBlend in='SourceGraphic' mode='color'/%3E%3C/filter%3E%3Crect width='1024' height='1024' filter='url(%23pf)'/%3E%3C/svg%3E%0A");
  width: 100%;
  max-width: 72vh;
  height: 98vh;
  display: grid;
  border-radius: 5vh;
  grid-template-rows: 2fr 3fr 3fr 7fr;
  box-shadow: 2vh 2vh 4vh #000000dd;
  background: var(--paper-svg) var(--main-light);
  background-blend-mode: color-burn;

}

:host > header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper-svg) var(--contrast);
  border: medium solid var(--main-dark);
  border-top-left-radius: 5vh;
  border-top-right-radius: 5vh;
  width: 100%;
  height: 100%;
  max-width: 72vh;
  text-align: center;
  font-size: 5vh;
  font-family: var(--handwritten-font);
  font-variant: small-caps;
}

#screen {
  background: #4040400e;
  border: medium solid var(--main-dark);
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  border-bottom-style: double;
  border-bottom-width: 1ch;
  margin: auto 1em;
  padding: 0 1em;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  box-shadow: inset 0.5vh 0.5vh 1vh #00000088;
}

#screen label {
  display: flex;
  flex-direction: row;
  margin: 0;
  align-items: center;
  justify-content: space-evenly;
}

#screen label *:not(.highlight) {
  font-family: var(--seven-segment-font);
  font-size: 5vh;
  margin: 0;
}

.highlight + output {
  min-width: 2ch;
  text-align: right;
}

#mode-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.4em;
  margin: 0 1em;
}

#mode-buttons > button {
  background: var(--paper-svg) var(--highlighter);
  border-radius: 3em;
  padding: 0.2em 0.5em;
  min-width: 16ch;
  max-width: 45vw;
  font-variant: small-caps;
  font-size: 3.5vh;
  margin: 3% auto;
}

#other-buttons {
  display: flex;
  margin: 0 1em 1em 1em;
}

#numbers {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5em;
  flex: 0 2 33vh;
  margin-right: 0;
}

#numbers > button {
  border-radius: 100%;
  background: var(--paper-svg) var(--main-dark);
  background-blend-mode: multiply;
  color: var(--main-light);
  font-size: 6vh;
  width: 10vh;
  height: 10vh;
  font-family: sans-serif;
}

#subdivisions {
  border-radius: 0.5em;
  background: var(--paper-svg) var(--main-dark);
  background-blend-mode: multiply;
  color: var(--main-light);
  display: grid;
  width: 100%;
  height: 100%;
  max-height: 50vh;
  padding: 0.2em 0.3em;
  grid-template-columns: 1fr 1fr;
  gap: 0.15em;
  flex: 0 1 20vh;
}

#subdivisions > button {
  border-radius: 0.5em;
  color: var(--main-dark);
  background: var(--main-light) var(--paper-svg);
  height: 4em;
  max-height: 7vh;
  width: 100%;
  grid-column: 1 / 3;
  font-size: 3vh;
  line-height: 0.9;
}

#subdivisions > button:nth-child(1),
#subdivisions > button:nth-child(3) {
  grid-column: 1 / 2;
}
#subdivisions > button:nth-child(2),
#subdivisions > button:nth-child(4) {
  grid-column: 2 / 3;
}

span.highlight {
  background: var(--highlighter);
  color: var(--main-dark);
  border: medium solid var(--main-dark);
  font-size: 3vh;
  font-family: var(--handwritten-font);
  padding: 0.15em;
}

button {
  border-width: medium;
  font-family: var(--handwritten-font);
  cursor: pointer;
  min-width: min-content;
  box-shadow: 0.25vh 0.2vh 0.4vh #000000bb;
}

button#go {
  background-color: #F42238;
  color: var(--main-dark);
  font-family: var(--handwritten-font);
  font-size: 5vh;
  font-weight: bold;
  padding-top: 0.2em;
  border-width: thick;
  grid-area: 4;
}

button:active {
  box-shadow: inset 0 0 2ch #606060cc;
}
</style>
`
    for (const modeButton of this.shadowRoot.querySelectorAll(
      '#mode-buttons > button'
    )) {
      modeButton.addEventListener('click', (event) => {
        this._buffer = ''
        this.mode = event.target.value
      })
    }

    function kebabCaseToCamelCase(kebab) {
      return kebab.includes('-')
        ? kebab
            .split('-')
            .map((word, i) =>
              i ? word[0].toUpperCase() + word.slice(1) : word
            )
            .join('')
        : kebab
    }

    for (const numberButton of this.shadowRoot.querySelectorAll(
      '#numbers > button:not(#go)'
    )) {
      numberButton.addEventListener('click', (event) => {
        this._buffer += event.target.value
        this[kebabCaseToCamelCase(this.mode)] = this._buffer
      })
    }

    for (const subdivisionButton of this.shadowRoot.querySelectorAll(
      '#subdivisions>button'
    )) {
      subdivisionButton.addEventListener('click', (event) => {
        this._buffer = ''
        this.subdivision = event.target.value
      })
    }

    this.shadowRoot
      .querySelector('button#go')
      .addEventListener('click', (event) => {
        if (event.shiftKey || event.ctrlKey) {
          this.random()
        } else {
          this.go()
        }
      })
  }

  get [Symbol.toStringTag]() {
    return 'PolyrhythmCalculator'
  }

  get modes() {
    return ['time-signature', 'subdivision', 'phrase', 'bar-count']
  }

  get mode() {
    return this._mode
  }

  set mode(value) {
    if (!this.modes.includes(value)) {
      throw Error(`Cannot set the mode to ${value}`)
    }
    this._buffer = ''
    this._mode = value
  }

  get barCount() {
    return this._barCount
  }

  set barCount(value) {
    if (value > 0) {
      this._barCount = Number(value)
      this.shadowRoot.querySelector('output#bar-count').innerText = value
    } else {
      console.warn(`Can't set bar count to ${value}.`)
    }
  }

  get phrase() {
    return this._phrase
  }

  set phrase(value) {
    const phrase = Math.floor(value)
    if (Number.isNaN(phrase)) {
      throw Error(`Can't set phrase to ${value}.`)
    }
    this._phrase = phrase
    this.shadowRoot.querySelector('#phrase').innerText = phrase
  }

  get subdivision() {
    return this._subdivision
  }

  set subdivision(value) {
    const subdivision = Math.floor(value)
    if (subdivision >= 1 && subdivision <= 8) {
      this._subdivision = subdivision
      this.shadowRoot.querySelector('#subdivision').innerText = subdivision
    }
  }

  get timeSignature() {
    return this._timeSignature
  }

  set timeSignature(value) {
    if (!value || value === '0') {
      return
    }
    if (typeof value.upper === 'number' && value.lower === 'number') {
      this._timeSignature = value
    } else if (typeof value === 'string') {
      const str = value.trim()
      if (!Number.isNaN(parseInt(str))) {
        if (
          (str.endsWith('4') && str != 4) ||
          (str.endsWith('8') && str != 8)
        ) {
          this._timeSignature = {
            upper: parseInt(str.slice(0, -1)),
            lower: parseInt(str.slice(-1)),
          }
        } else if (
          (str.endsWith('16') && str != 16) ||
          (str.endsWith('32') && str != 32)
        ) {
          this._timeSignature = {
            upper: parseInt(str.slice(0, -2)),
            lower: parseInt(str.slice(-2)),
          }
        } else {
          this._timeSignature = {
            upper: parseInt(str),
            lower: 4,
          }
        }
      }
    } else if (typeof value === 'number') {
      this.timeSignature = value.toString()
    }

    this.shadowRoot.querySelector(
      '#time-signature'
    ).innerText = `${this._timeSignature.upper}/${this._timeSignature.lower}`
  }

  get beatCount() {
    return this.timeSignature.upper * this.subdivision * this.barCount
  }

  get fullReps() {
    return Math.floor(this.beatCount / this.phrase)
  }

  set fullReps(value) {
    this.shadowRoot.querySelector('output#full-reps').value = value
  }

  get remainder() {
    return this.beatCount % this.phrase
  }

  set remainder(value) {
    this.shadowRoot.querySelector('output#remainder').value = value
  }

  go() {
    this._buffer = ''
    this.fullReps = this.fullReps
    this.remainder = this.remainder
  }

  random(time = 3) {
    const randInt = (limit) => Math.ceil(Math.random() * limit)
    for (let i = 20; i <= 1000 * time; i += i / 3) {
      window.setTimeout(() => {
        this.fullReps = randInt(16)
        this.remainder = randInt(16)
      }, i)
    }
    window.setTimeout(this.go.bind(this), 1000 * time + 180)
  }
}

const fonts = document.createElement('style')
fonts.innerText = `
@font-face {
  font-family: 'Digital7';
  src:
    local('Digital7'),
    url(./fonts/digital-7.ttf) format('truetype'),
    url('https://fonts.cdnfonts.com/s/17796/digital-7.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Yahfie Heavy';
  src: 
    local('Yahfie Heavy'),
    local('YahfieHeavy'),
    url(./fonts/YahfieHeavy.ttf) format('truetype'),
    url(https://fontlibrary.org/assets/fonts/yahfie/894ac04b068a8c38af7779a00fcba2f5/fbcdc6814ae489eda6c7f9b0d40d9239/YahfieHeavy.ttf) format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`
document.head.append(fonts)
customElements.define('polyrhythm-calculator', PolyrhythmCalculator)
