import { PREFIX } from '../utils/slugs';
import { getSplittedTime } from '../utils/time';
import BaseComponent from './base-component';

const ATTRIBUTES = {
  TIME: 'time',
  HAS_SECOND_HAND: 'has-second-hand'
};

const EVENTS = {
  MANUAL_TIME_UPDATE: `${PREFIX}:manualtimeupdate`
};

export default class AnalogClock extends BaseComponent {
  static get observedAttributes() {
    return [ATTRIBUTES.TIME, ATTRIBUTES.HAS_SECOND_HAND];
  }
  constructor() {
    super();
  }

  get clock() {
    return this.shadowRoot.querySelector('.clock');
  }

  get time() {
    return this.getAttribute(ATTRIBUTES.TIME);
  }
  set time(value) {
    this.setAttribute(ATTRIBUTES.TIME, value);
  }

  get hasSecondHand() {
    return this.getAttribute(ATTRIBUTES.HAS_SECOND_HAND) === 'true';
  }
  set hasSecondHand(value) {
    this.setAttribute(ATTRIBUTES.HAS_SECOND_HAND, value ? 'true' : 'false');
  }

  setHtml() {
    return `
      <div class="clock">
        <div class="hand hour" id="hour-hand"></div>
        <div class="hand minute" id="minute-hand"></div>
      </div>
    `;
  }

  setCss() {
    return `
      <style>
        .clock {
          position: fixed;
          bottom: 12px;
          right: 12px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transform: rotate(-90deg);
        }
        .hand {
          position: absolute;
          width: 50%;
          height: 2px;
          background: var(--lc-light-color, #000);
          top: 50%;
          left: 50%;
          transform-origin: 0% 50%;
          transition: none;
        }
        .hand.hour {
          height: 2px;
          width: 35%;
          box-shadow: 0 0 3px rgba(0,0,0,0.2);
        }
        .hand.minute {
          height: 2px;
          width: 45%;
          box-shadow: 0 0 2px rgba(0,0,0,0.1);
        }
        .hand.second {
          height: 1px;
          width: 50%;
          background: var(--lc-accent-color, #f00);
          transition: none;
          box-shadow: 0 0 1px rgba(0,0,0,0.1);
          transition: transform 1s linear;
        }
      </style>
    `;
  }

  updateHands(time) {
    const { hours, minutes, seconds } = getSplittedTime(time);
    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;
    if (this.hourHand) this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    if (this.minuteHand) this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    if (this.secondHand) this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
  }

  toggleSecondHand() {
    if (this.hasSecondHand) {
      this.clock.removeEventListener('wheel', this.handleWheel);
      if (this.secondHand) return;
      this.secondHand = this.createChild('div', 'second-hand', ['hand', 'second']);
      this.clock.appendChild(this.secondHand);
    } else {
      this.clock.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
      if (!this.secondHand) return;
      this.secondHand.remove();
      this.secondHand = null;
    }
  }

  handleWheel(e) {
    e.preventDefault();
    const currentTimeString = this.getAttribute(ATTRIBUTES.TIME);
    if (!currentTimeString) return;
    const currentTime = parseFloat(currentTimeString);
    const date = new Date(currentTime * 1000);
    const delta = e.deltaY > 0 ? -1 : 1;
    const secondsToAdd = delta * 30;
    date.setSeconds(date.getSeconds() + secondsToAdd);
    const newTime = +date / 1000;
    this.time = newTime.toString();
    document.dispatchEvent(new CustomEvent(EVENTS.MANUAL_TIME_UPDATE, {
      detail: { time: newTime },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    const timeAttr = this.time;
    this.hourHand = this.shadowRoot.querySelector('#hour-hand');
    this.minuteHand = this.shadowRoot.querySelector('#minute-hand');
    this.toggleSecondHand();    
    if (timeAttr) {
      this.updateHands(new Date(parseFloat(timeAttr) * 1000));
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
    case ATTRIBUTES.TIME:
      return this.updateHands(new Date(parseFloat(newValue) * 1000));
    case ATTRIBUTES.HAS_SECOND_HAND:
      return this.toggleSecondHand(newValue);
    default:
      return;
    }
  }
}