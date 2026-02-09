import LightController from './components/light-controller.js';
import SkyLayer from './components/sky-layer.js';
import ReflectionSurface from './components/reflection-surface.js';
import AnalogClock from './components/analog.clock.js';
import DigitalClock from './components/digital-clock.js';
import DigitalCypher from './components/digital-cypher.js';

if (!customElements.get('light-controller')) {
  customElements.define('light-controller', LightController);
}

if (!customElements.get('analog-clock')) {
  customElements.define('analog-clock', AnalogClock);
}

if (!customElements.get('digital-cypher')) {
  customElements.define('digital-cypher', DigitalCypher);
}

if (!customElements.get('digital-clock')) {
  customElements.define('digital-clock', DigitalClock);
}

if (!customElements.get('sky-layer')) {
  customElements.define('sky-layer', SkyLayer);
}

if (!customElements.get('reflection-surface')) {
  customElements.define('reflection-surface', ReflectionSurface);
}

export { LightController, SkyLayer, ReflectionSurface, AnalogClock };
