import { PREFIX } from '../utils/slugs';
import { css, html } from '../utils/tag';
import BaseComponent from './base-component';

const ATTRIBUTES = {
  TIME: 'time',
  MODE: 'mode'
};

const ATTRIBUTES_VALUES = {
  MODE: {
    AUTO: 'auto',
    MANUAL: 'manual'
  }
};

const EVENTS = {
  MANUAL_TIME_UPDATE: `${PREFIX}:manualtimeupdate`
};

export default class DigitalClock extends BaseComponent {
  static get observedAttributes() {
    return [ATTRIBUTES.TIME, ATTRIBUTES.MODE];
  }
  constructor() {
    super();
  }

  get time() {
    return this.getAttribute(ATTRIBUTES.TIME);
  }
  set time(value) {
    this.setAttribute(ATTRIBUTES.TIME, value);
  }

  get mode() {
    return this.getAttribute(ATTRIBUTES.MODE);
  }
  set mode(value) {
    this.setAttribute(ATTRIBUTES.MODE, value);
  }

  updateTime() {
    if (!this.time) return;
    const date = new Date(parseFloat(this.time) * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    this.FirstHourCypher.setAttribute('digit', hours[0]);
    this.SecondHourCypher.setAttribute('digit', hours[1]);
    this.FirstMinuteCypher.setAttribute('digit', minutes[0]);
    this.SecondMinuteCypher.setAttribute('digit', minutes[1]);
    this.FirstSecondCypher.setAttribute('digit', seconds[0]);
    this.SecondSecondCypher.setAttribute('digit', seconds[1]);
  }

  toggleMode() {
    if (this.mode === ATTRIBUTES_VALUES.MODE.AUTO) {
      this.removeEventListener('mousedown', this.handleMouseDown);
      this.removeEventListener('mouseup', this.handleMouseUp);
      this.removeEventListener('mouseleave', this.handleMouseUp);
      return;
    }
    if (this.mode === ATTRIBUTES_VALUES.MODE.MANUAL) {
      this.addEventListener('mousedown', this.handleMouseDown);
      this.addEventListener('mouseup', this.handleMouseUp);
      this.addEventListener('mouseleave', this.handleMouseUp);
      return;
    }
    throw new Error(`DigitalClock: unknown mode "${this.mode}"`);
  }

  mouseInterval = null;
  mouseDirection = 0;

  handleMouseDown = (event) => {
    const rect = this.clockContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    this.mouseDirection = clickX < rect.width / 2 ? -1 : 1;
    this.updateTimeWhilePressed();
    this.mouseInterval = setInterval(this.updateTimeWhilePressed, 200);
  };

  handleMouseUp = () => {
    clearInterval(this.mouseInterval);
    this.mouseInterval = null;
  };

  updateTimeWhilePressed = () => {
    const currentTimeString = this.time;
    if (!currentTimeString) return;
    const currentTime = parseFloat(currentTimeString);
    const date = new Date(currentTime * 1000);
    const minutesToAdd = 1 * this.mouseDirection;
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const newTime = +date / 1000;
    this.time = newTime.toString();
    document.dispatchEvent(new CustomEvent(EVENTS.MANUAL_TIME_UPDATE, {
      detail: { time: newTime },
      bubbles: true,
      composed: true
    }));
  };

  setHtml() {
    return html`
      <div class="digital-clock">
        <digital-cypher class="hour" id="hFirst"></digital-cypher>
        <digital-cypher class="hour" id="hSecond"></digital-cypher>
        <div class="separator">:</div>
        <digital-cypher class="minute" id="mFirst"></digital-cypher>
        <digital-cypher class="minute" id="mSecond"></digital-cypher>
        <div class="separator">:</div>
        <digital-cypher class="second" id="sFirst"></digital-cypher>
        <digital-cypher class="second" id="sSecond"></digital-cypher>
      </div>
    `;
  }

  setCss() {
    return css`
      .digital-clock {
        position: fixed;
        bottom: 12px;
        right: 12px;
        width: 200px;
        height: 60px;
        background: #252525;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .separator {
        color: #c70000;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.clockContainer = this.shadowRoot.querySelector('.digital-clock');
    this.FirstHourCypher = this.shadowRoot.querySelector('#hFirst');
    this.SecondHourCypher = this.shadowRoot.querySelector('#hSecond');
    this.FirstMinuteCypher = this.shadowRoot.querySelector('#mFirst');
    this.SecondMinuteCypher = this.shadowRoot.querySelector('#mSecond');
    this.FirstSecondCypher = this.shadowRoot.querySelector('#sFirst');
    this.SecondSecondCypher = this.shadowRoot.querySelector('#sSecond');
    this.updateTime();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === ATTRIBUTES.TIME) {
      this.updateTime();
    }
    if (name === ATTRIBUTES.MODE) {
      this.toggleMode();
    }
  }

}