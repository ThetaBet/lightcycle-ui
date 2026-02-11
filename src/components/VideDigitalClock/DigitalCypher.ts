import { css, html } from "../../utils/templateTag";
import { VideElement } from "../VideElement";
import { DIGITAL_CYPHER_ACTIVE_CLASS, DIGITS, SEGMENTS } from "./constants";
import { VIDE_DIGITAL_CYPHER_ATTR, VIDE_DIGITAL_CYPHER_SELECTORS } from "./types";

export default class VideDigitalCypher extends VideElement {
  static get observedAttributes(): string[] {
    return [VIDE_DIGITAL_CYPHER_ATTR.DIGIT];
  }

  constructor() {
    super();
  }

  get digit(): string {
    return this.getAttribute(VIDE_DIGITAL_CYPHER_ATTR.DIGIT);
  }
  set digit(value: string) {
    this.setAttribute(VIDE_DIGITAL_CYPHER_ATTR.DIGIT, value);
  }

  updateSegments() {
    const digitValue = DIGITS[this.digit] || 0;
    for (const [segment, bit] of Object.entries(SEGMENTS)) {
      const segmentElement = this.shadowRoot.querySelector(
        `${VIDE_DIGITAL_CYPHER_SELECTORS.SEGMENT}-${segment}`,
      );
      segmentElement?.classList.toggle(
        DIGITAL_CYPHER_ACTIVE_CLASS,
        !!(digitValue & bit),
      );
    }
  }

  render(): string {
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

  styles = css`
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

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === VIDE_DIGITAL_CYPHER_ATTR.DIGIT) {
      this.updateSegments();
    }
  }
}