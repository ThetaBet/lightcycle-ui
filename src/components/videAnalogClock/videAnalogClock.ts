import { GLOBAL_STYLE_VARIABLES } from "../../utils/global/types";
import { css, html } from "../../utils/templateTag";
import { getSplittedTime } from "../../utils/time";
import { VideElement } from "../VideElement";
import { DELTA_SECONDS } from "./constants";
import { VIDE_ANALOG_CLOCK_ATTR, VIDE_ANALOG_CLOCK_EVENT, VIDE_ANALOG_CLOCK_MODE, VIDE_ANALOG_CLOCK_SELECTORS } from "./types";

export default class VideAnalogClock extends VideElement {
  static get observedAttributes(): string[] {
    return [
      VIDE_ANALOG_CLOCK_ATTR.TIME,
      VIDE_ANALOG_CLOCK_ATTR.HAS_SECONDS_HAND,
    ];
  }
  private hourHand: HTMLDivElement | null = null;
  private minuteHand: HTMLDivElement | null = null;
  private secondHand: HTMLDivElement | null = null;
  mode: VIDE_ANALOG_CLOCK_MODE;

  constructor() {
    super();
  }

  private get clock(): HTMLDivElement {
    return this.shadowRoot.querySelector(VIDE_ANALOG_CLOCK_SELECTORS.CLOCK) as HTMLDivElement;
  }

  get time(): number {
    return parseFloat(this.getAttribute(VIDE_ANALOG_CLOCK_ATTR.TIME));
  }
  set time(value: number) {
    this.setAttribute(VIDE_ANALOG_CLOCK_ATTR.TIME, value.toString());
  }

  get hasSecondsHand(): boolean {
    return (
      this.getAttribute(VIDE_ANALOG_CLOCK_ATTR.HAS_SECONDS_HAND) === "true"
    );
  }
  set hasSecondsHand(value: boolean) {
    this.setAttribute(
      VIDE_ANALOG_CLOCK_ATTR.HAS_SECONDS_HAND,
      value.toString(),
    );
  }

  updateHands() {
    const currentDate = new Date(this.time * 1000);
    const { hours, minutes, seconds } = getSplittedTime(currentDate);
    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;
    if (this.hourHand) this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
    if (this.minuteHand) this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    if (this.secondHand) this.secondHand.style.transform = `rotate(${secondAngle}deg)`;
  }

  toggleSecondsHand() {
    if (!this.clock) return;
    if (this.hasSecondsHand) {
      this.clock.removeEventListener(VIDE_ANALOG_CLOCK_EVENT.WHEEL, this.onWheel);
      if (this.secondHand) return;
      this.secondHand = this.createChildElement('div', 'second-hand', ['hand', 'second']) as HTMLDivElement;
      this.clock.appendChild(this.secondHand);
    } else {
      this.clock.addEventListener(VIDE_ANALOG_CLOCK_EVENT.WHEEL, this.onWheel.bind(this), { passive: false });
      if (!this.secondHand) return;
      this.clock.removeChild(this.secondHand);
      this.secondHand = null;
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    const currentTime = this.time;
    if (!currentTime) return;
    const delta = e.deltaY > 0 ? 1 : -1;
    const date = new Date(currentTime * 1000);
    const secondsToAdd = delta * DELTA_SECONDS;
    date.setSeconds(date.getSeconds() + secondsToAdd);
    this.time = +date / 1000;
    document.dispatchEvent(new CustomEvent(VIDE_ANALOG_CLOCK_EVENT.MANUAL_TIME_UPDATE, {
      detail: { time: this.time },
      bubbles: true,
      composed: true,
    }));
  }

  styles = css`
    .clock {
      position: fixed;
      bottom: 12px;
      right: 12px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      transform: rotate(-90deg);
    }
    .hand {
      position: absolute;
      width: 50%;
      height: 2px;
      background: var(${GLOBAL_STYLE_VARIABLES.LIGHT_COLOR}, #000);
      top: 50%;
      left: 50%;
      transform-origin: 0% 50%;
      transition: none;
    }
    .hand.hour {
      height: 2px;
      width: 35%;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    }
    .hand.minute {
      height: 2px;
      width: 45%;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    }
    .hand.second {
      height: 1px;
      width: 50%;
      background: var(${GLOBAL_STYLE_VARIABLES.ACCENT_COLOR}, #f00);
      transition: none;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
      transition: transform 1s linear;
    }
  `;
  
  render(): string {
    return html`
      <div class="clock">
        <div id="hour-hand" class="hand hour"></div>
        <div id="minute-hand" class="hand minute"></div>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.hourHand = this.shadowRoot.querySelector(VIDE_ANALOG_CLOCK_SELECTORS.HOUR_HAND) as HTMLDivElement;
    this.minuteHand = this.shadowRoot.querySelector(VIDE_ANALOG_CLOCK_SELECTORS.MINUTE_HAND) as HTMLDivElement;
    this.toggleSecondsHand();
    if (this.time) {
      this.updateHands();
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    switch (name) {
      case VIDE_ANALOG_CLOCK_ATTR.TIME:
        this.updateHands();
        break;
      case VIDE_ANALOG_CLOCK_ATTR.HAS_SECONDS_HAND:
        this.toggleSecondsHand();
        break;
      default:
        break;
    }
  }
} 