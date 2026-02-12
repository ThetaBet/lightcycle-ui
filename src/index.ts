import { VideReflectionSurface } from './components/VideReflectionSurface';
import { VideDigitalClock, VideDigitalCypher } from './components/VideDigitalClock';
import { VideAnalogClock } from './components/videAnalogClock';
import { VideLightController } from './components/VideLightController';
import { VideSkyLayer } from './components/VideSkyLayer';
import { VideConditionalBox } from './components/VideConditionalBox';

if (!customElements.get('vd-light-controller')) {
  customElements.define('vd-light-controller', VideLightController);
}

if (!customElements.get('vd-analog-clock')) {
  customElements.define('vd-analog-clock', VideAnalogClock);
}

if (!customElements.get('vd-digital-cypher')) {
  customElements.define('vd-digital-cypher', VideDigitalCypher);
}

if (!customElements.get('vd-digital-clock')) {
  customElements.define('vd-digital-clock', VideDigitalClock);
}

if (!customElements.get('vd-sky-layer')) {
  customElements.define('vd-sky-layer', VideSkyLayer);
}

if (!customElements.get('vd-reflection-surface')) {
  customElements.define('vd-reflection-surface', VideReflectionSurface);
}

if (!customElements.get('vd-conditional-box')) {
  customElements.define('vd-conditional-box', VideConditionalBox);
}

export { VideLightController, VideReflectionSurface, VideAnalogClock, VideDigitalClock, VideDigitalCypher, VideConditionalBox };
