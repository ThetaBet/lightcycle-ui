import { GLOBAL_STYLE_VARIABLES } from "../../utils/global/types";
import { getLightIntensity, getLightPosition, getLightTemperature } from "../../utils/light";
import { perceptualDayTime } from "../../utils/time";
import { VideAnalogClock } from "../videAnalogClock";
import { VideDigitalClock } from "../VideDigitalClock";
import { VIDE_DIGITAL_CLOCK_MODE } from "../VideDigitalClock/types";
import { VideElement } from "../VideElement";
import { ANALOG_CLOCK_TAG_NAME, defaultFontConfig, DIGITAL_CLOCK_TAG_NAME, MOBILE_MEDIA_QUERY } from "./constants";
import { FontObjectAttribute, VIDE_LIGHT_CONTROLLER_ATTR, VIDE_LIGHT_CONTROLLER_CLOCK, VIDE_LIGHT_CONTROLLER_EVENT, VIDE_LIGHT_CONTROLLER_MODE } from "./types";

export default class VideLightController extends VideElement {
  static get observedAttributes(): string[] {
    return [
      VIDE_LIGHT_CONTROLLER_ATTR.MODE,
      VIDE_LIGHT_CONTROLLER_ATTR.TICK,
      VIDE_LIGHT_CONTROLLER_ATTR.TIME,
      VIDE_LIGHT_CONTROLLER_ATTR.FONTS,
      VIDE_LIGHT_CONTROLLER_ATTR.CLOCK,
    ];
  }
  _mediaQuery: MediaQueryList | null = null;

  set globalTime(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.TIME,
      value.toString(),
    );
    document.documentElement.setAttribute(
      VIDE_LIGHT_CONTROLLER_ATTR.TIME,
      value.toString(),
    );
  }

  set globalTimePerceived(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.TIME_PERCEIVED,
      value.toString(),
    );
  }

  set globalDayProgress(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.DAY_PROGRESS,
      value.toString(),
    );
  }

  set globalLightIntensity(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_INTENSITY,
      value.toString(),
    );
  }

  set globalLightTemperature(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_TEMPERATURE,
      value.toString(),
    );
  }

  set globalLightX(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_X,
      value.toString(),
    );
  }

  set globalLightY(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_Y,
      value.toString(),
    );
  }

  set globalLightFront(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_FRONT,
      value.toString(),
    );
  }

  set globalLightBack(value: number) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.LIGHT_BACK,
      value.toString(),
    );
  }

  set globalFontTitle(value: string) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.FONT_TITLE,
      value,
    );
  }

  set globalFontBody(value: string) {
    document.documentElement.style.setProperty(
      GLOBAL_STYLE_VARIABLES.FONT_BODY,
      value,
    );
  }

  get tickInterval(): number {
    return parseInt(this.getAttribute(VIDE_LIGHT_CONTROLLER_ATTR.TICK));
  }

  get time(): number | VIDE_LIGHT_CONTROLLER_MODE.AUTO {
    const value = this.getAttribute(VIDE_LIGHT_CONTROLLER_ATTR.TIME);
    if (value === VIDE_LIGHT_CONTROLLER_MODE.AUTO) {
      return VIDE_LIGHT_CONTROLLER_MODE.AUTO;
    }
    return parseFloat(value);
  }
  set time(value: number | VIDE_LIGHT_CONTROLLER_MODE.AUTO) {
    this.setAttribute(VIDE_LIGHT_CONTROLLER_ATTR.TIME, value.toString());
  }

  get mode(): VIDE_LIGHT_CONTROLLER_MODE {
    return this.getAttribute(VIDE_LIGHT_CONTROLLER_ATTR.MODE) as VIDE_LIGHT_CONTROLLER_MODE;
  }
  set mode(value: VIDE_LIGHT_CONTROLLER_MODE) {
    this.setAttribute(VIDE_LIGHT_CONTROLLER_ATTR.MODE, value);
  }

  timestamp: number = 0;
  currentTime: number = 0;
  _interval: number | null = null;
  clock: VideAnalogClock | VideDigitalClock | null = null;
  fonts: Array<FontObjectAttribute> = [];

  constructor() {
    super();
    this.timestamp = Date.now() / 1000;
    this.currentTime = (this.timestamp % 86400) / 86400;
    this._interval = null;
    this.clock = null;
    this.setTimeData();
    this.fonts = defaultFontConfig;
  }

  tick() {
    const now = Date.now() / 1000;
    const delta = now - this.timestamp;
    this.timestamp = now;
    this.currentTime += delta / 86400;
    if (this.currentTime > 1) {
      this.currentTime -= 1;
    }
    this.globalTime = this.currentTime;
    this.clock.time = this.timestamp;
    this.dispatchEvent(
      new CustomEvent(VIDE_LIGHT_CONTROLLER_EVENT.TIME_CHANGE, {
        detail: { time: this.currentTime, timestamp: this.timestamp },
      }),
    );
  }

  start() {
    if (this._interval) return;
    const tickInterval = this.tickInterval || 1000;
    this._interval = window.setInterval(() => this.tick(), tickInterval);
  }

  stop() {
    if (!this._interval) return;
    window.clearInterval(this._interval);
    this._interval = null;
  }

  restart() {
    this.stop();
    this.start();
  }

  removeClock() {
    if (!this.clock) return;
    this.clock.remove();
    this.clock = null;
  }

  setClockTime() {
    if (!this.clock) return;
    this.clock.time = this.timestamp;
  }

  setTimeByListener() {
    document.addEventListener(VIDE_LIGHT_CONTROLLER_EVENT.MANUAL_TIME_UPDATE, (event: CustomEvent) => {
      const { time } = event.detail;
      const timeOfDay = (time % 86400) / 86400;
      this.time = timeOfDay;
    });
  }

  removeListeners() {
    document.removeEventListener(VIDE_LIGHT_CONTROLLER_EVENT.MANUAL_TIME_UPDATE, this.setTimeByListener);
  }

  setTimeData() {
    const { x, y, lightFront, lightBack } = getLightPosition(this.currentTime);
    const currentFonts = this.fonts.find(f => this.currentTime >= f.start && this.currentTime < f.end);
    this.globalTime = this.currentTime;
    this.globalTimePerceived = perceptualDayTime(this.currentTime);
    this.globalDayProgress = this.currentTime;
    this.globalLightIntensity = getLightIntensity(this.currentTime);
    this.globalLightTemperature = getLightTemperature(this.currentTime);
    this.globalLightX = x;
    this.globalLightY = y;
    this.globalLightFront = lightFront;
    this.globalLightBack = lightBack;
    this.globalFontTitle = currentFonts ? currentFonts.title : '';
    this.globalFontBody = currentFonts ? currentFonts.body : '';
  }

  toggleMode() {
    if (this.mode === VIDE_LIGHT_CONTROLLER_MODE.AUTO) {
      this.time = VIDE_LIGHT_CONTROLLER_MODE.AUTO;
      this.timestamp = Date.now() / 1000;
      this.currentTime = (this.timestamp % 86400) / 86400;
      this.setTimeData();
      this.start();
      if (this.clock) {
        this.clock.hasSecondsHand = true;
        this.clock.mode = VIDE_DIGITAL_CLOCK_MODE.AUTO;
      }
      return;      
    }
    if (this.mode === VIDE_LIGHT_CONTROLLER_MODE.MANUAL) {
      this.stop();
      const time = +this.time || 0;
      if (isNaN(time) || time < 0 || time > 1) {
        console.warn(`_VIDE_LightController: Invalid time value "${this.time}", resetting to 0`);
        this.currentTime = 0;
      }
      this.setTimeData();
      if (this.clock) {
        this.clock.hasSecondsHand = false;
        this.clock.mode = VIDE_DIGITAL_CLOCK_MODE.MANUAL;
      }
      return;
    }
    throw new Error(`_VIDE_LightController: Unknown mode "${this.mode}"`);
  }

  changeTick() {
    if (this.mode !== VIDE_LIGHT_CONTROLLER_MODE.AUTO) return;
    if (!isNaN(this.tickInterval) && this.tickInterval > 0) {
      this.restart();
    }
  }

  changeTime() {
    if (isNaN(+this.time) || +this.time < 0 || +this.time > 1) {
      this.currentTime = 0;
      throw new Error(`_VIDE_LightController: Invalid time value "${this.time}"`);
    }
    this.currentTime = +this.time;
    const nowSeconds = Date.now() / 1000;
    const startOfDay = Math.floor(nowSeconds / 86400) * 86400;
    this.timestamp = startOfDay + this.currentTime * 86400;
    this.setClockTime();
    this.setTimeData();
  }

  setFonts(rawFonts: string) {
    if (!rawFonts) return;
    try {
      const fonts = JSON.parse(rawFonts);
      if (Array.isArray(fonts)) {
        this.fonts = fonts;
      }
    } catch (e) {
      throw new Error(`_VIDE_LightController: Invalid fonts value "${rawFonts}"`);
    }
  }

  autoSetClock() {
    if (!this._mediaQuery) return;
    if (this._mediaQuery.matches) {
      this.changeClock(VIDE_LIGHT_CONTROLLER_CLOCK.DIGITAL);
    } else {
      this.changeClock(VIDE_LIGHT_CONTROLLER_CLOCK.ANALOG);
    }
  }

  async changeClock(newValue: string) {
    if (!newValue && this.clock) {
      this.removeClock();
      this._mediaQuery = null;
      return;
    }
    if (newValue === VIDE_LIGHT_CONTROLLER_CLOCK.ANALOG) {
      this.removeClock();
      this.clock = this.createChildElement(ANALOG_CLOCK_TAG_NAME) as VideAnalogClock;
      this.shadowRoot.appendChild(this.clock);
      await this.waitChildrenUpgraded();
      this.clock.hasSecondsHand = this.mode === VIDE_LIGHT_CONTROLLER_MODE.AUTO;
      this.setClockTime();
      this.setTimeByListener();
      return;
    }
    if (newValue === VIDE_LIGHT_CONTROLLER_CLOCK.DIGITAL) {
      this.removeClock();
      this.clock = this.createChildElement(DIGITAL_CLOCK_TAG_NAME) as VideDigitalClock;
      this.shadowRoot.appendChild(this.clock);
      await this.waitChildrenUpgraded();
      this.clock.mode = this.mode === VIDE_LIGHT_CONTROLLER_MODE.AUTO ? VIDE_DIGITAL_CLOCK_MODE.AUTO : VIDE_DIGITAL_CLOCK_MODE.MANUAL;
      this.setClockTime();
      this.setTimeByListener();
      return;
    }
    if (newValue === VIDE_LIGHT_CONTROLLER_CLOCK.AUTO) {
      this._mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
      this._mediaQuery.addEventListener(VIDE_LIGHT_CONTROLLER_EVENT.CHANGE, this.autoSetClock.bind(this));
      this.autoSetClock();
      return;
    }
    throw new Error(`_VIDE_LightController: Unknown clock value "${newValue}"`);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.mode === VIDE_LIGHT_CONTROLLER_MODE.AUTO) {
      this.start();
    }
  }

  disconnectedCallback(): void {
    this.stop();
    this.removeClock();
    this.removeListeners();
    if (this._mediaQuery) {
      this._mediaQuery.removeEventListener(VIDE_LIGHT_CONTROLLER_EVENT.CHANGE, this.autoSetClock.bind(this));
    }
  }
  

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    switch (name) {
      case VIDE_LIGHT_CONTROLLER_ATTR.MODE:
        this.toggleMode();
        break;
      case VIDE_LIGHT_CONTROLLER_ATTR.TICK:
        this.changeTick();
        break;
      case VIDE_LIGHT_CONTROLLER_ATTR.TIME:
        this.changeTime();
        break;
      case VIDE_LIGHT_CONTROLLER_ATTR.FONTS:
        this.setFonts(newValue);
        break;
      case VIDE_LIGHT_CONTROLLER_ATTR.CLOCK:
        this.changeClock(newValue);
        break;
      default:
        break;
    }
  }
}