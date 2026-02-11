import { VideReflectionSurface } from './components/VideReflectionSurface';
import { VideDigitalClock, VideDigitalCypher } from './components/VideDigitalClock';
import { VideAnalogClock } from './components/videAnalogClock';
import { VideLightController } from './components/VideLightController';
import { VideSkyLayer } from './components/VideSkyLayer';

if (!customElements.get('light-controller')) {
  customElements.define('light-controller', VideLightController);
}

if (!customElements.get('analog-clock')) {
  customElements.define('analog-clock', VideAnalogClock);
}

if (!customElements.get('digital-cypher')) {
  customElements.define('digital-cypher', VideDigitalCypher);
}

if (!customElements.get('digital-clock')) {
  customElements.define('digital-clock', VideDigitalClock);
}

if (!customElements.get('sky-layer')) {
  customElements.define('sky-layer', VideSkyLayer);
}

if (!customElements.get('reflection-surface')) {
  customElements.define('reflection-surface', VideReflectionSurface);
}

export { VideLightController, VideReflectionSurface, VideAnalogClock, VideDigitalClock, VideDigitalCypher };
