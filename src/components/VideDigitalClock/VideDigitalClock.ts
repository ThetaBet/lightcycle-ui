import { css, html } from "../../utils/templateTag";
import { getPaddedSplittedTime } from "../../utils/time";
import { VideElement } from "../VideElement";
import { DELTA_MINUTES } from "./constants";
import VideDigitalCypher from "./DigitalCypher";
import { VIDE_DIGITAL_CLOCK_ATTR, VIDE_DIGITAL_CLOCK_EVENT, VIDE_DIGITAL_CLOCK_MODE } from "./types";

export default class VideDigitalClock extends VideElement {
  static get observedAttributes(): string[] {
    return [VIDE_DIGITAL_CLOCK_ATTR.TIME, VIDE_DIGITAL_CLOCK_ATTR.MODE];
  }
  firstHourCypher: VideDigitalCypher;
  secondHourCypher: VideDigitalCypher;
  firstMinuteCypher: VideDigitalCypher;
  secondMinuteCypher: VideDigitalCypher;
  firstSecondCypher: VideDigitalCypher;
  secondSecondCypher: VideDigitalCypher;
  clockContainer: HTMLDivElement;
  mouseInterval: number | null = null;
  mouseDirection: number = 0;
  hasSecondsHand: boolean = false;

  constructor() {
    super();
  }

  get time(): number {
    return parseFloat(this.getAttribute(VIDE_DIGITAL_CLOCK_ATTR.TIME));
  }
  set time(value: number) {
    this.setAttribute(VIDE_DIGITAL_CLOCK_ATTR.TIME, value.toString());
  }

  get mode(): string {
    return this.getAttribute(VIDE_DIGITAL_CLOCK_ATTR.MODE);
  }
  set mode(value: string) {
    this.setAttribute(VIDE_DIGITAL_CLOCK_ATTR.MODE, value);
  }

  updateTime() {
    if (!this.time) return;
    const date = new Date(this.time * 1000);
    const { hours, minutes, seconds } = getPaddedSplittedTime(date, true);
    this.firstHourCypher.digit = hours[0];
    this.secondHourCypher.digit = hours[1];
    this.firstMinuteCypher.digit = minutes[0];
    this.secondMinuteCypher.digit = minutes[1];
    this.firstSecondCypher.digit = seconds[0];
    this.secondSecondCypher.digit = seconds[1];
  }

  toggleMode() {
    if (this.mode === VIDE_DIGITAL_CLOCK_MODE.AUTO) {
      this.removeEventListener(
        VIDE_DIGITAL_CLOCK_EVENT.MOUSE_DOWN,
        this.onMouseDown,
      );
      this.removeEventListener(
        VIDE_DIGITAL_CLOCK_EVENT.MOUSE_UP,
        this.onMouseUp,
      );
      this.removeEventListener(
        VIDE_DIGITAL_CLOCK_EVENT.MOUSE_LEAVE,
        this.onMouseUp,
      );
      return;
    }
    if (this.mode === VIDE_DIGITAL_CLOCK_MODE.MANUAL) {
      this.addEventListener(
        VIDE_DIGITAL_CLOCK_EVENT.MOUSE_DOWN,
        this.onMouseDown,
      );
      this.addEventListener(VIDE_DIGITAL_CLOCK_EVENT.MOUSE_UP, this.onMouseUp);
      this.addEventListener(
        VIDE_DIGITAL_CLOCK_EVENT.MOUSE_LEAVE,
        this.onMouseUp,
      );
      return;
    }
    throw new Error(`_VIDE_DigitalClock: Unknown mode "${this.mode}"`);
  }

  onMouseDown = (event: MouseEvent) => {
    const rect = this.clockContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    this.mouseDirection = clickX < rect.width / 2 ? -1 : 1;
    this.updateTimeWhilePressed();
    this.mouseInterval = window.setInterval(this.updateTimeWhilePressed, 200);
  };

  onMouseUp = () => {
    clearInterval(this.mouseInterval);
    this.mouseInterval = null;
  };

  updateTimeWhilePressed = () => {
    if (!this.time) return;
    const date = new Date(this.time * 1000);
    const minutesToAdd = DELTA_MINUTES * this.mouseDirection;
    date.setMinutes(date.getMinutes() + minutesToAdd);
    this.time = +date / 1000;
    document.dispatchEvent(
      new CustomEvent(VIDE_DIGITAL_CLOCK_EVENT.MANUAL_TIME_UPDATE, {
        detail: { time: this.time },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render(): string {
    return html`
      <div class="vd-digital-clock">
        <vd-digital-cypher class="hour" id="hFirst"></vd-digital-cypher>
        <vd-digital-cypher class="hour" id="hSecond"></vd-digital-cypher>
        <div class="separator">:</div>
        <vd-digital-cypher class="minute" id="mFirst"></vd-digital-cypher>
        <vd-digital-cypher class="minute" id="mSecond"></vd-digital-cypher>
        <div class="separator">:</div>
        <vd-digital-cypher class="second" id="sFirst"></vd-digital-cypher>
        <vd-digital-cypher class="second" id="sSecond"></vd-digital-cypher>
      </div>
    `;
  }

  styles = css`
    .vd-digital-clock {
      position: fixed;
      bottom: 12px;
      right: 12px;
      width: 200px;
      height: 60px;
      background: #252525;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .separator {
      color: #c70000;
    }
  `;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.firstHourCypher = this.shadowRoot.querySelector('#hFirst') as VideDigitalCypher;
    this.secondHourCypher = this.shadowRoot.querySelector('#hSecond') as VideDigitalCypher;
    this.firstMinuteCypher = this.shadowRoot.querySelector('#mFirst') as VideDigitalCypher;
    this.secondMinuteCypher = this.shadowRoot.querySelector('#mSecond') as VideDigitalCypher;
    this.firstSecondCypher = this.shadowRoot.querySelector('#sFirst') as VideDigitalCypher;
    this.secondSecondCypher = this.shadowRoot.querySelector('#sSecond') as VideDigitalCypher;
    this.clockContainer = this.shadowRoot.querySelector('.vd-digital-clock') as HTMLDivElement;
    this.updateTime();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === VIDE_DIGITAL_CLOCK_ATTR.TIME) {
      this.updateTime();
    }
    if (name === VIDE_DIGITAL_CLOCK_ATTR.MODE) {
      this.toggleMode();
    }
  }
}