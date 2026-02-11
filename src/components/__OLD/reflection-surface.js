/*
  Placeholder for <glass-surface> material component.

  Attributes:
  - reflectivity: 0..1 (default 0.35)
  - roughness: 0..1 (default 0.25)

  Internal CSS vars exposed:
  --lc-material-reflectivity
  --lc-material-roughness

  Rendering rules to implement later:
  - reflections via radial-gradient
  - reflection follows --lc-light-x / --lc-light-y
  - mix-blend-mode: screen
*/

import { css, html } from './tag';
import ShadowBox from './shadow-Box';

const ATTRIBUTES = {
  TYPE: 'type',
};

export class ReflectionSurface extends ShadowBox {
  static get observedAttributes() {
    return [ATTRIBUTES.TYPE];
  }
  constructor() {
    super();
  }

  get type() {
    return this.getAttribute(ATTRIBUTES.TYPE);
  }
  set type(value) {
    this.setAttribute(ATTRIBUTES.TYPE, value);
  }

  setCss() {
    return css`
      ${super.setCss()}
      :host([type="glass"])::before {
        content: '';
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
        // inset: 0;
        // border: 1px solid rgba(255, 255, 255, 0.25);
        // opacity: calc(var(--sun-elevation, 1) * 0.6);
        // z-index: 2;
      }
      :host([type="glass"])::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        filter: blur(4px);
        mix-blend-mode: screen;
        z-index: 1;
                background: 
          radial-gradient(
            circle at
            calc(50% + var(--rx))
            calc(50% + var(--ry)),
            hsl(
              calc(40 + var(--sun-elevation) * 180),
              60%,
              90%
            ),
            transparent 60%
          );
        opacity: var(--reflection-strength, 0.2);
      }
      :host([type="glass"]) {
        --rx: calc(-var(--lc-light-x) * 20px);
        --ry: calc(-var(--lc-light-y) * 20px);
        position: relative;
        background-color: rgba(255, 255, 255, calc(0.1 * var(--lc-light-intensity))) !important;
        // background-image: radial-gradient(
        //   circle at calc(50% + (var(--lc-light-x) * 50%)) calc(50% + (var(--lc-light-y) * 50%)),
        //   rgba(255, 255, 255, calc(0.6 * var(--lc-light-intensity))), 0%,
        //   transparent 60%
        // );
        background-image: 
    linear-gradient(
      rgba(255, 255, 255, calc(0.02 + 0.05 * var(--lc-light-intensity))), 
      rgba(255, 255, 255, 0.01)
    );
        backdrop-filter: blur(16px);
        box-shadow: 
    inset calc(var(--lc-light-x) * -1px) 
          calc(var(--lc-light-y) * -1px) 
          0px rgba(255, 255, 255, calc(0.5 * var(--lc-light-intensity))),
          
    inset calc(var(--lc-light-x) * 1px) 
          calc(var(--lc-light-y) * 1px) 
          0px rgba(0, 0, 0, 0.1),
          
    calc(var(--lc-light-x) * 10px) calc(var(--lc-light-y) * -10px) 20px rgba(0,0,0,0.15),
          inset var(--reflect-x) var(--reflect-y) 10px rgba(255, 255, 255, calc(0.2 * var(--lc-light-intensity)));
      }

      :host([type="matte"]) {
        background-image: linear-gradient(
            calc(atan2(var(--lc-light-y), var(--lc-light-x)) + 90deg),
            rgba(255,255,255, calc(0.5 * var(--lc-light-intensity))),
            rgba(0,0,0, 0.1)
          );
          box-shadow: var(--shadow-x) var(--shadow-y) 25px rgba(0,0,0,0.15);
      }
      :host([type="matte"])::after {
        filter: blur(12px);
        mix-blend-mode: soft-light;
      }

      :host([type="lucid"]) {
        --reflection-strength: calc(0.15 + var(--light-warmth) * 0.25);
        position: relative;
        // border: 1px solid rgba(255, 255, 255, 0.3);

  box-shadow: 
    /* BORDO LUMINOSO: si sposta verso il sole */
    inset calc(var(--lc-light-x) * -1px) 
          calc(var(--lc-light-y) * -1px) 
          0px rgba(255, 255, 255, calc(0.5 * var(--lc-light-intensity))),
          
    /* BORDO OMBRA: si sposta dal lato opposto */
    inset calc(var(--lc-light-x) * 1px) 
          calc(var(--lc-light-y) * 1px) 
          0px rgba(0, 0, 0, 0.1),
          
    /* OMBRA PORTATA (quella esterna che avevamo già) */
    calc(var(--lc-light-x) * 10px) calc(var(--lc-light-y) * -10px) 20px rgba(0,0,0,0.15);

      }
      :host([type="lucid"])::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        transform: translate(calc(var(--lc-light-x) * 20%), calc(var(--lc-light-y) * 20%));
        pointer-events: none;
        opacity: .6;
        background: radial-gradient(
          circle at 50% 50%,
          rgba(255, 255, 255, calc(0.8 * var(--lc-light-intensity))) 0%,
          rgba(255, 255, 255, 0) 30%
        );
      }

    `;
  }

  setHtml() {
    return html`
      <div class="lc-box reflect">
        <div class="content">
          <slot></slot>
        </div>
      </div>
      `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.reflectiveSurface = this.shadowRoot.querySelector('.lc-box');
    if (this.type) this.reflectiveSurface.classList.add(`${this.type}`);
    const computedStyle = getComputedStyle(this);
    console.log('Computed background color:', computedStyle.backgroundColor);
    const userBg = computedStyle.backgroundColor;
    if (userBg && userBg !== 'rgba(0, 0, 0, 0)' && userBg !== 'transparent') {
      this.style.setProperty('--current-bg', userBg);
      this.style.backgroundColor = 'transparent';
    }
  }

  attributeCahangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === ATTRIBUTES.TYPE) {
      if (oldValue) this.reflectiveSurface.classList.remove(`${oldValue}`);
      if (newValue) this.reflectiveSurface.classList.add(`${newValue}`);
    }
  }
}

export default ReflectionSurface;
