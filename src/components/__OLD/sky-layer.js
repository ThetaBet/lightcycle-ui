/*
  Placeholder for <vd-sky-layer> CSS-only visualization component.

  Rules:
  - Pure CSS rendering; consumes public CSS vars
  - No time logic
  - Should be replaceable by users
*/

import { getBottomColors, getphasesWeight, getSkyColors, getStarColor, getStarPosition, getStarSize, getTopColors } from '../../utils/light';
import { css, html } from './tag';
import BaseComponent from '../base-component';

export class SkyLayer extends BaseComponent {
  constructor() {
    super();
  }

  setCss() {
    return css`
      :host {
      ${getSkyColors()}
      ${getphasesWeight()}
      ${getTopColors()}
      ${getBottomColors()}
        --sky-lightness: calc(10% + var(--lc-light-intensity, 0) * 70%);
        --sky-top-lightness: calc(5% + var(--lc-light-intensity, 0) * 55%);
        --temp-offset: calc((4250 - var(--lc-light-temperature, 6500)) / 150);
        --sun-progress: calc((var(--lc-time, 0) - 0.25) * 2);
        --sun-x: calc(5% + var(--sun-progress) * 90%);
        --sun-elevation: pow(var(--lc-light-intensity, 0), 0.8);
        --sun-y: calc(85% - var(--sun-elevation) * 65%);
        --sun-size: calc(40px + (1 - var(--sun-elevation, 0)) * 60px);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        transition: background 2s ease-out;
      }

      .sun {
        position: absolute;
        left: var(--sun-x);
        top: var(--sun-y);
        width: var(--sun-size);
        height: var(--sun-size);
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, #fffbe6 60%, #ffd700 100%, transparent 120%);
        box-shadow: 0 0 60px 30px #fffbe6, 0 0 120px 60px #ffd700;
        pointer-events: none;
        opacity: calc(var(--lc-light-intensity, 0));
        z-index: -1;
        // transition: left 2s, top 2s, width 2s, height 2s, opacity 2s;
      }

      .stars {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: calc(1 - var(--lc-light-intensity, 0) * 2);
        transition: opacity 2s ease-out;
        z-index: -1;
      }

      @keyframes twinkle-1 {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      @keyframes twinkle-2 {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.2; }
      }

      @keyframes twinkle-3 {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
      }

      .star-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .star-layer:nth-child(1) {
        background-image:
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()} ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent);
        animation: twinkle-1 4s ease-in-out infinite;
      }

      .star-layer:nth-child(2) {
        background-image:
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent);
        animation: twinkle-2 3s ease-in-out infinite 0.8s;
      }

      .star-layer:nth-child(3) {
        background-image:
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent);
        animation: twinkle-3 2.5s ease-in-out infinite 1.5s;
      }

      .star-layer:nth-child(4) {
        background-image:
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent);
        animation: twinkle-1 3.5s ease-in-out infinite 2s;
      }

      .star-layer:nth-child(5) {
        background-image:
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent),
          radial-gradient(${getStarSize()} at ${getStarPosition()}, ${getStarColor()}, transparent);
        animation: twinkle-2 4.2s ease-in-out infinite 1.2s;
      }
    `;
  }

  setHtml() {
    return html`
      <div class="sun"></div>
      <div class="stars">
        <div class="star-layer"></div>
        <div class="star-layer"></div>
        <div class="star-layer"></div>
        <div class="star-layer"></div>
        <div class="star-layer"></div>
      </div>
      <slot></slot>
    `;
  }
}

export default SkyLayer;
