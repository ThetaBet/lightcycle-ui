import { getLightIntensity, getLightPosition, getLightTemperature } from '../utils/light';
import { PREFIX } from '../utils/slugs';
import { perceptualDayTime } from '../utils/time';
import BaseComponent from './base-component';

const ATTRIBUTES = {
  MODE: 'mode',
  TICK: 'tick',
  TIME: 'time',
  FONTS: 'fonts',
  CLOCK: 'clock',
  HAS_SECOND_HAND: 'has-second-hand'
};

const ATTRIBUTES_VALUES = {
  MODE: {
    AUTO: 'auto',
    MANUAL: 'manual'
  },
  CLOCK: {
    ANALOG: 'analog',
    DIGITAL: 'digital'
  }
};

const STYLE_VARIABLES = {
  TIME: `--${PREFIX}-time`,
  TIME_PERCEIVED: `--${PREFIX}-time-perceived`,
  DAY_PROGRESS: `--${PREFIX}-day-progress`,
  LIGHT_INTENSITY: `--${PREFIX}-light-intensity`,
  LIGHT_TEMPERATURE: `--${PREFIX}-light-temperature`,
  LIGHT_X: `--${PREFIX}-light-x`,
  LIGHT_Y: `--${PREFIX}-light-y`,
  FONT_TITLE: `--${PREFIX}-font-title`,
  FONT_BODY: `--${PREFIX}-font-body`,
  LIGHT_FRONT: `--${PREFIX}-light-front`,
  LIGHT_BACK: `--${PREFIX}-light-back`
};

const EVENTS = {
  TIME_CHANGE: `${PREFIX}:timechange`,
  MANUAL_TIME_UPDATE: `${PREFIX}:manualtimeupdate`
};

export class LightController extends BaseComponent {
  static get observedAttributes() {
    return [ATTRIBUTES.MODE, ATTRIBUTES.TICK, ATTRIBUTES.TIME, ATTRIBUTES.FONTS, ATTRIBUTES.CLOCK];
  }

  constructor() {
    super();
    this.timestamp = Date.now() / 1000;
    this.currentTime = this.timestamp % 86400 / 86400;
    this._interval = null;
    this.clock = null;
    this.setTimesVariables();
    this.fonts = [
      { start: 0, end: .25, title: 'Serif', body: 'monospace' },
      { start: .25, end: .375, title: 'Serif', body: 'Sans-serif' },
      { start: .375, end: .708, title: 'Sans-serif', body: 'Sans-serif' },
      { start: .708, end: .792, title: 'monospace', body: 'Sans-serif' },
      { start: .792, end: 1, title: 'Sans-serif', body: 'Sans-serif' }
    ];
  }

  set lcTime(value) {
    const stringValue = value.toString();
    document.documentElement.style.setProperty(STYLE_VARIABLES.TIME, stringValue);
  }

  set lcTimePerceived(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.TIME_PERCEIVED, value.toString());
  }

  set lcDayProgress(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.DAY_PROGRESS, value.toString());
  }

  set lcLightIntensity(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_INTENSITY, value.toString());
  }

  set lcLightTemperature(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_TEMPERATURE, value.toString());
  }

  set lcLightX(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_X, value.toString());
  }

  set lcLightY(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_Y, value.toString());
  }
  
  set lcLightFront(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_FRONT, value.toString());
  }

  set lcLightBack(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.LIGHT_BACK, value.toString());
  }
  
  set lcFontTitle(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.FONT_TITLE, value);
  }

  set lcFontBody(value) {
    document.documentElement.style.setProperty(STYLE_VARIABLES.FONT_BODY, value);
  }


  get tickInterval() {
    return parseInt(this.getAttribute(ATTRIBUTES.TICK));
  }

  get time() {
    return this.getAttribute(ATTRIBUTES.TIME);
  }

  set time(value) {
    this.setAttribute(ATTRIBUTES.TIME, value.toString());
  }

  get mode() {
    return this.getAttribute(ATTRIBUTES.MODE);
  }

  set mode(value) {
    this.setAttribute(ATTRIBUTES.MODE, value);
  }

  tick() {
    const now = Date.now() / 1000;
    const delta = now - this.timestamp;
    this.timestamp = now;
    this.currentTime += delta / 86400;
    if (this.currentTime > 1) {
      this.currentTime -= 1;
    }
    this.lcTime = this.currentTime;
    this.clock.time = this.timestamp.toString();
    this.dispatchEvent(new CustomEvent(EVENTS.TIME_CHANGE, {
      detail: { time: this.currentTime, timestamp: this.timestamp }
    }));
  }

  async start() { 
    if (this._interval) return;
    const tickInterval = this.tickInterval || 1000;
    this._interval = setInterval(() => this.tick(), tickInterval);
  }

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  removeClock() {
    if (this.clock) {
      this.clock.remove();
      this.clock = null;
    }
  }

  setClockTime() {
    if (this.clock) this.clock.time = this.timestamp.toString();
  }

  setTimeByListener() {
    document.addEventListener(EVENTS.MANUAL_TIME_UPDATE, (e) => {
      const newTimeStamp = e.detail.time;
      const timeOfDay = (newTimeStamp % 86400) / 86400; 
      this.time = timeOfDay;
    });
  }

  removeListeners() {
    document.removeEventListener(EVENTS.MANUAL_TIME_UPDATE, this.setTimeByListener);

  }

  setTimesVariables() {
    const { x, y, lightFront, lightBack } = getLightPosition(this.currentTime);
    const currentFont = this.fonts?.find(f => this.currentTime >= f.start && this.currentTime < f.end) || { title: 'Sans-serif', body: 'Sans-serif' };
    this.lcTime = this.currentTime;
    this.lcTimePerceived = perceptualDayTime(this.currentTime);
    this.lcDayProgress = this.currentTime;
    this.lcLightIntensity = getLightIntensity(this.currentTime);
    this.lcLightTemperature = getLightTemperature(this.currentTime);
    this.lcLightX = x;
    this.lcLightY = y;
    this.lcLightFront = lightFront;
    this.lcLightBack = lightBack;
    this.lcFontTitle = currentFont.title;
    this.lcFontBody = currentFont.body;
  }

  toggleMode() {
    if (this.mode === ATTRIBUTES_VALUES.MODE.AUTO) {
      this.time = ATTRIBUTES_VALUES.MODE.AUTO;
      this.timestamp = Date.now() / 1000;
      this.currentTime = this.timestamp % 86400 / 86400;
      this.setTimesVariables();
      this.start();
      if (this.clock) {
        this.clock.hasSecondHand = true;
        this.clock.mode = ATTRIBUTES_VALUES.MODE.AUTO;
      }
      return;
    }
    if (this.mode === ATTRIBUTES_VALUES.MODE.MANUAL) {
      this.stop();
      const time = parseFloat(this.getAttribute(ATTRIBUTES.TIME, '0'));
      if (isNaN(time) || time < 0 || time > 1) {
        this.currentTime = 0;
      }
      this.setTimesVariables();
      if (this.clock) {
        this.clock.hasSecondHand = false;
        this.clock.mode = ATTRIBUTES_VALUES.MODE.MANUAL;
      }
      return;
    }
    throw new Error(`LightController: unknown mode "${this.mode}"`);
  }

  changeTick(newTick) {
    if (this.mode !== ATTRIBUTES_VALUES.MODE.AUTO) return;
    if (!isNaN(Number(newTick)) && Number(newTick) > 0) {
      this.restart();
    }
  }

  changeTime(newTime) {
    if (newTime === ATTRIBUTES_VALUES.MODE.AUTO) return 0;
    if (isNaN(Number(newTime)) || Number(newTime) < 0 || Number(newTime) > 1) {
      throw new Error(`LightController: invalid time "${newTime}"`);
    }
    this.currentTime = Number(newTime);
    const nowSeconds = Date.now() / 1000;
    const startOfDay = Math.floor(nowSeconds / 86400) * 86400;
    this.timestamp = startOfDay + this.currentTime * 86400;
    this.setClockTime();
    this.setTimesVariables();

  }

  setFonts(newFonts) {
    if (!newFonts) return;
    try {
      const fonts = JSON.parse(newFonts);
      if (Array.isArray(fonts)) {
        this.fonts = fonts;
      }
    } catch (e) {
      throw new Error('LightController: invalid fonts attribute', e);
    }
  }

  async changeClock(newClock) {
    if (!newClock && this.clock) {
      this.removeClock();
    }
    if (newClock === ATTRIBUTES_VALUES.CLOCK.ANALOG) {
      this.removeClock();
      await customElements.whenDefined('analog-clock');
      this.clock = document.createElement('analog-clock');
      this.shadowRoot.appendChild(this.clock);
      await new Promise(r => requestAnimationFrame(r));
      this.clock.setAttribute(ATTRIBUTES.HAS_SECOND_HAND, this.getAttribute(ATTRIBUTES.MODE) === ATTRIBUTES_VALUES.MODE.AUTO ? 'true' : 'false');
      this.setClockTime();
      this.setTimeByListener();
      return;
    }
    if (newClock === ATTRIBUTES_VALUES.CLOCK.DIGITAL) {
      this.removeClock();
      await customElements.whenDefined('digital-clock');
      this.clock = document.createElement('digital-clock');
      this.shadowRoot.appendChild(this.clock);
      await new Promise(r => requestAnimationFrame(r));
      this.clock.mode = this.mode;
      this.setClockTime();
      this.setTimeByListener();
      return;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.getAttribute('mode') === ATTRIBUTES_VALUES.MODE.AUTO) {
      this.start();
    }
  }

  disconnectedCallback() {
    this.stop();
    this.removeListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
    case ATTRIBUTES.MODE:
      return this.toggleMode();
    case ATTRIBUTES.TICK:
      return this.changeTick(newValue);
    case ATTRIBUTES.TIME:
      return this.changeTime(newValue);
    case ATTRIBUTES.FONTS:
      return this.setFonts(newValue);
    case ATTRIBUTES.CLOCK:
      return this.changeClock(newValue);
    default:
      return;
    }
  }


}

export default LightController;

