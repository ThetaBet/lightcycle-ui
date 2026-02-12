import { GLOBAL_STYLE_VARIABLES } from "../../utils/global/types";
import { css } from "../../utils/templateTag";
import { VideElement } from "../VideElement";

export default class VideShadowBox extends VideElement {
  constructor() {
    super();
  }

  styles = css`
    :host {
      --spread-min: 0px;
      --spread-max: 24px;
      --h: 1;
      --shadow-length: calc((1 - var(${GLOBAL_STYLE_VARIABLES.LIGHT_INTENSITY})) * 20px + 4px);
      --shadow-x: calc(var(${GLOBAL_STYLE_VARIABLES.LIGHT_X}) * var(--shadow-length));
      --shadow-y: calc(var(${GLOBAL_STYLE_VARIABLES.LIGHT_Y}) * var(--shadow-length));
      --inv-elev: calc(1 - var(--sun-elevation));
      --inv-elev-2: calc(var(--inv-elev) * var(--inv-elev));
      --inv-elev-3: calc(var(--inv-elev-2) * var(--inv-elev));
      --spread: calc(var(--inv-elev-2) * var(--spread-max));
      --blur: calc(var(--spread) * 1.2);
      --light-warmth: calc(1 - var(--sun-elevation));
      --hue: calc(260 - var(--sun-elevation) * 40);
      --lightness: calc(30% - var(--sun-elevation) * 10%);
      --saturation: calc(30% - var(--sun-elevation) * 15%);
      --reflect-x: calc(var(${GLOBAL_STYLE_VARIABLES.LIGHT_X}) * -10px);
      --reflect-y: calc(var(${GLOBAL_STYLE_VARIABLES.LIGHT_Y}) * -10px);
      filter: drop-shadow(
        var(--shadow-x) var(--shadow-y) var(--blur)
          rgba(60, 80, 120, calc(0.4 - var(--sun-elevation) * 0.2))
      );
      position: relative;
      overflow: hidden;
      width: inherit;
      height: inherit;
      border-radius: inherit;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
  }
}