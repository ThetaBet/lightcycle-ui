import { css, html } from './tag';
import BaseComponent from '../base-component';

const SEGMENTS = {
  a: 1 << 0,
  b: 1 << 1,
  c: 1 << 2,
  d: 1 << 3,
  e: 1 << 4,
  f: 1 << 5,
  g: 1 << 6
};

const DIGITS = {
  '0': SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.e | SEGMENTS.f,
  '1': SEGMENTS.b | SEGMENTS.c,
  '2': SEGMENTS.a | SEGMENTS.b | SEGMENTS.d | SEGMENTS.e | SEGMENTS.g,
  '3': SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.g,
  '4': SEGMENTS.b | SEGMENTS.c | SEGMENTS.f | SEGMENTS.g,
  '5': SEGMENTS.a | SEGMENTS.c | SEGMENTS.d | SEGMENTS.f | SEGMENTS.g,
  '6': SEGMENTS.a | SEGMENTS.c | SEGMENTS.d | SEGMENTS.e | SEGMENTS.f | SEGMENTS.g,
  '7': SEGMENTS.a | SEGMENTS.b | SEGMENTS.c,
  '8': SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.e | SEGMENTS.f | SEGMENTS.g,
  '9': SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.f | SEGMENTS.g
};

const ATTRIBUTES = {
  VALUE: 'digit'
};

export default class DigitalCypher extends BaseComponent {
  static get observedAttributes() {
    return [ATTRIBUTES.VALUE];
  }
  constructor() {
    super();
  }

  get value() {
    return this.getAttribute(ATTRIBUTES.VALUE);
  }

  set value(newValue) {
    this.setAttribute(ATTRIBUTES.VALUE, newValue);
  }

  updateSegments() {
    const digitValue = DIGITS[this.value] || 0;
    for (const [segment, bit] of Object.entries(SEGMENTS)) {
      const segmentEl = this.shadowRoot.querySelector(`.segment-${segment}`);
      segmentEl?.classList.toggle('on', (digitValue & bit));
    }
  }

  setHtml() {
    return html`
      <div class="digit-container">
        <div class="segment segment-a"></div>
        <div class="segment segment-b"></div>
        <div class="segment segment-c"></div>
        <div class="segment segment-d"></div>
        <div class="segment segment-e"></div>
        <div class="segment segment-f"></div>
        <div class="segment segment-g"></div>
      </div>
    `;
  }

  setCss() {
    return css`
      .digit-container {
        position: relative;
        width: 20px;
        height: 40px;
        margin: 0 4px;
      }
      .segment {
        position: absolute;
        background: #c70000;
        border-radius: 4px;
        opacity: 0.1;
      }
      .segment-a {
        top: 0;
        left: 2.5px;
        width: 15px;
        height: 3px;
      }
      .segment-b {
        top: 2.5px;
        right: 0;
        width: 3px;
        height: 15px;
      }
      .segment-c {
        bottom: 2.5px;
        right: 0;
        width: 3px;
        height: 15px;
      }
      .segment-d {
        bottom: 0;
        left: 2.5px;
        width: 15px;
        height: 3px;
      }
      .segment-e {
        bottom: 2.5px;
        left: 0;
        width: 3px;
        height: 15px;
      }
      .segment-f {
        top: 2.5px;
        left: 0;
        width: 3px;
        height: 15px;
      }
      .segment-g {
        top: 18px;
        left: 2.5px;
        width: 15px;
        height: 3px;
      }
      .segment.on {
        opacity: 1;
      }
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === ATTRIBUTES.VALUE) {
      this.updateSegments();
    }
  }
}