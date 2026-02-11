import { css, html } from "../../utils/templateTag";
import { VideShadowBox } from "../VideShadowBox";
import { VIDE_REFLECTION_SURFACE_ATTR, VIDE_REFLECTION_SURFACE_TYPE } from "./types";

export default class VideReflectionSurface extends VideShadowBox {
  static get observedAttributes() {
    return [
      VIDE_REFLECTION_SURFACE_ATTR.TYPE,
      VIDE_REFLECTION_SURFACE_ATTR.STYLE,
    ];
  }

  constructor() {
    super();
  }

  get type(): VIDE_REFLECTION_SURFACE_TYPE | null {
    return this.getAttribute(
      VIDE_REFLECTION_SURFACE_ATTR.TYPE,
    ) as VIDE_REFLECTION_SURFACE_TYPE;
  }

  set type(value: VIDE_REFLECTION_SURFACE_TYPE | null) {
    if (value) {
      this.setAttribute(VIDE_REFLECTION_SURFACE_ATTR.TYPE, value);
    } else {
      this.removeAttribute(VIDE_REFLECTION_SURFACE_ATTR.TYPE);
    }
  }

  /*
    linear-gradient degrees: calc(atan2(var(--lc-light-y), var(--lc-light-x)) + 90deg),
  */

  styles = css`
    ${this.styles}
    :host([type="glass"])::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        115deg,
        transparent 40%,
        rgba(255, 255, 255, calc(0.3 * var(--lc-light-intensity))) 40.5%,
        rgba(255, 255, 255, calc(0.3 * var(--lc-light-intensity))) 42%,
        transparent 42.5%,
        transparent 45%,
        rgba(255, 255, 255, calc(0.2 * var(--lc-light-intensity))) 45.5%,
        rgba(255, 255, 255, calc(0.2 * var(--lc-light-intensity))) 46%,
        transparent 46.5%
      );
      pointer-events: none;
      transform: translateX(calc(var(--lc-light-x) * 15%));
    }
    :host([type="glass"])::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      filter: blur(4px);
      mix-blend-mode: screen;
      z-index: 1;
      background: radial-gradient(
        circle at calc(50% + var(--rx)) calc(50% + var(--ry)),
        hsl(calc(40 + var(--sun-elevation) * 180), 60%, 90%),
        transparent 60%
      );
      opacity: var(--reflection-strength, 0.2);
    }
    :host([type="glass"]) {
      --glass-base: var(--current-bg, rgba(255, 255, 255, 0.1));
      --rx: calc(-var(--lc-light-x) * 20px);
      --ry: calc(-var(--lc-light-y) * 20px);
      position: relative;
      background-color: oklch(from var(--glass-base) l c h / 0.2) !important;
      background-image: linear-gradient(
        rgba(255, 255, 255, calc(0.02 + 0.05 * var(--lc-light-intensity))),
        rgba(255, 255, 255, 0.01)
      );
      backdrop-filter: blur(16px);
      box-shadow:
        inset calc(var(--lc-light-x) * -1px) calc(var(--lc-light-y) * -1px) 0px
          rgba(255, 255, 255, calc(0.5 * var(--lc-light-intensity))),
        inset calc(var(--lc-light-x) * 1px) calc(var(--lc-light-y) * 1px) 0px
          rgba(0, 0, 0, 0.1),
        calc(var(--lc-light-x) * 10px) calc(var(--lc-light-y) * -10px) 20px
          rgba(0, 0, 0, 0.15),
        inset var(--reflect-x) var(--reflect-y) 10px
          rgba(255, 255, 255, calc(0.2 * var(--lc-light-intensity)));
    }
    :host([type="matte"]) {
      background-image: linear-gradient(
        calc(atan2(var(--lc-light-y), var(--lc-light-x)) + 90deg),
        rgba(255, 255, 255, calc(0.5 * var(--lc-light-intensity))),
        rgba(0, 0, 0, 0.1)
      );
      box-shadow: var(--shadow-x) var(--shadow-y) 25px rgba(0, 0, 0, 0.15);
    }
    :host([type="matte"])::after {
      filter: blur(12px);
      mix-blend-mode: soft-light;
    }
    :host([type="lucid"]) {
      --reflection-strength: calc(0.15 + var(--light-warmth) * 0.25);
      position: relative;
      box-shadow:
        inset calc(var(--lc-light-x) * -1px) calc(var(--lc-light-y) * -1px) 0px
          rgba(255, 255, 255, calc(0.5 * var(--lc-light-intensity))),
        inset calc(var(--lc-light-x) * 1px) calc(var(--lc-light-y) * 1px) 0px
          rgba(0, 0, 0, 0.1),
        calc(var(--lc-light-x) * 10px) calc(var(--lc-light-y) * -10px) 20px
          rgba(0, 0, 0, 0.15);
    }
    :host([type="lucid"])::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      transform: translate(
        calc(var(--lc-light-x) * 20%),
        calc(var(--lc-light-y) * 20%)
      );
      pointer-events: none;
      opacity: 0.6;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(255, 255, 255, calc(0.8 * var(--lc-light-intensity))) 0%,
        rgba(255, 255, 255, 0) 30%
      );
    }
  `;

  render(): string {
    return html` <div class="lc-box reflect">
      <div class="content">
        <slot></slot>
      </div>
    </div>`;
  }

  tintBackground() {
    const computedStyle = getComputedStyle(this);
    const userBg = this.style.backgroundColor || computedStyle.backgroundColor;
    super.connectedCallback();
    if (
      this.type === VIDE_REFLECTION_SURFACE_TYPE.GLASS &&
      userBg &&
      userBg !== "rgba(0, 0, 0, 0)" &&
      userBg !== "transparent"
    ) {
      this.style.setProperty("--current-bg", userBg);
      this.style.backgroundColor = "transparent";
    }
  }

  connectedCallback(): void {
    this.tintBackground();
    super.connectedCallback();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (
      name === VIDE_REFLECTION_SURFACE_ATTR.STYLE &&
      this.type === VIDE_REFLECTION_SURFACE_TYPE.GLASS
    ) {
      this.tintBackground();
    }
  }
}