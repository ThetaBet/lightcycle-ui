import { GLOBAL_STYLE_VARIABLES } from "../../utils/global/types";
import {
  getBottomColors,
  getphasesWeight,
  getSkyColors,
  getStarColor,
  getStarPosition,
  getStarSize,
  getSunInfos,
  getTopColors,
} from "../../utils/light";
import { css, html } from "../../utils/templateTag";
import { VideElement } from "../VideElement";

export default class VideSkyLayer extends VideElement {
  constructor() {
    super();
  }

  styles = css`
    :host {
      ${getphasesWeight()}
      ${getTopColors()}
      ${getBottomColors()}
      ${getSunInfos()}
    }

    .sky {
      ${getSkyColors()}
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
      pointer-events: none;
      z-index: -1;
      transition: background 2s ease-out;
    }

    .sun {
      position: absolute;
      left: var(--sun-x);
      top: var(--sun-y);
      width: var(--sun-size);
      border-radius: 50%;
      background: radial-gradient(
        circle at 50% 50%,
        #fffbe6 60%,
        #ffd700 100%,
        transparent 120%
      );
      box-shadow:
        0 0 60px 30px #fffbe6,
        0 0 120px 60px #ffd700;
      pointer-events: none;
      opacity: calc(var(${GLOBAL_STYLE_VARIABLES.LIGHT_INTENSITY}, 0));
      z-index: -1;
    }

    .stars {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: calc(1 - var(${GLOBAL_STYLE_VARIABLES.LIGHT_INTENSITY}, 0) * 2);
      transition: opacity 2s ease-out;
      z-index: -1;
    }

    @keyframes twinkle-1 {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }

    @keyframes twinkle-2 {
      0%,
      100% {
        opacity: 0.8;
      }
      50% {
        opacity: 0.2;
      }
    }

    @keyframes twinkle-3 {
      0%,
      100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.9;
      }
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
  `;

  render() {
    return html`
      <div class="sky">
        <div class="sun"></div>
        <div class="stars">
          <div class="star-layer"></div>
          <div class="star-layer"></div>
          <div class="star-layer"></div>
          <div class="star-layer"></div>
        </div>
      </div>
      <slot></slot>
    `;
  }
}
