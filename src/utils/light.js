import { css } from './templateTag';

export const getLightIntensity = (time) => {
  const elevation = Math.sin((time - 0.25) * 2 * Math.PI);
  return Math.pow(Math.max(0, elevation), 0.6);
};

export const getLightTemperature = (time) => {
  const elevation = Math.sin((time - 0.25) * 2 * Math.PI);
  const minTemp = 2000;
  const maxTemp = 6500;
  const temp = minTemp + (maxTemp - minTemp) * Math.pow(Math.max(0, elevation), 0.5);
  return Math.round(temp);
};

export const getLightPosition = (time) => {
  const full = time * 2 * Math.PI;
  const day = (time - 0.25) * Math.PI;
  const x = Math.sin(full);
  const rawElevation = Math.sin(day);
  const elevation = Math.min(1, Math.pow(Math.max(0, rawElevation), 0.2));
  const lightFront = Math.max(0, 1 - Math.abs(x - .5) * 2);
  return {
    x: x,
    y: -elevation,
    lightBack: 1 - elevation,
    lightFront: lightFront,
    elevation
  };
};

export const getStarSize = () => {
  const magnitude = Math.random() * 2 + 1;
  return `${magnitude}px ${magnitude}px`;
};

export const getStarPosition = () => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  return `${x}% ${y}%`;
};

export const getStarColor = () => {
  const colors = ['white', 'lightyellow', 'lightblue', 'lightgray'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getDayPhasesColor = () => {
  return css`
    --night-top: 4 6 12;
    --night-bottom: 10 12 24;
    --dawn-top: 90 80 140;
    --dawn-bottom: 255 180 150;
    --day-top: 70 160 255;
    --day-bottom: 190 225 255;
    --dusk-top: 55 25 85;
    --dusk-bottom: 245 130 90;
  `;
};

export const getphasesWeight = () => {
  return css`
    --dist-midnight: min(var(--lc-time-perceived), calc(1 - var(--lc-time-perceived)));
    --w-night: clamp(0, 1 - var(--dist-midnight) * 5, 1);
    --w-dawn: clamp(0, 1 - abs(var(--lc-time-perceived) - 0.23) * 8, 1);
    --w-day: clamp(0, 1 - abs(var(--lc-time-perceived) - 0.5) * 2, 1);
    --w-dusk: clamp(0, 1 - abs(var(--lc-time-perceived) - 0.77) * 10, 1);
    --w-sum: calc(var(--w-night) + var(--w-dawn) + var(--w-day) + var(--w-dusk));
    --wnight: calc(var(--w-night) / var(--w-sum));
    --wdawn: calc(var(--w-dawn) / var(--w-sum));
    --wday: calc(var(--w-day) / var(--w-sum));
    --wdusk: calc(var(--w-dusk) / var(--w-sum));
  `;
};

export const getTopColors = () => {
  return css`
    --sky-top-r: calc(
      var(--wnight) * 4 +
      var(--wdawn) * 60 +
      var(--wday) * 70 +
      var(--wdusk) * 55
    );
    --sky-top-g: calc(
      var(--wnight) * 6 +
      var(--wdawn) * 50 +
      var(--wday) * 160 +
      var(--wdusk) * 25
    );
    --sky-top-b: calc(
      var(--wnight) * 12 +
      var(--wdawn) * 120 +
      var(--wday) * 255 +
      var(--wdusk) * 85
    );
  `;
};

export const getBottomColors = () => {
  return css`
    --sky-bottom-r: calc(
      var(--wnight) * 10 +
      var(--wdawn) * 240 +
      var(--wday) * 190 +
      var(--wdusk) * 245
    );
    --sky-bottom-g: calc(
      var(--wnight) * 12 +
      var(--wdawn) * 165 +
      var(--wday) * 225 +
      var(--wdusk) * 130
    );
    --sky-bottom-b: calc(
      var(--wnight) * 24 +
      var(--wdawn) * 120 +
      var(--wday) * 255 +
      var(--wdusk) * 90
    );
  `;
};

export const getSkyColors = () => {
  return css`
    background: linear-gradient(
      to bottom,
      rgb(
        clamp(0, var(--sky-top-r), 255),
        clamp(0, var(--sky-top-g), 255),
        clamp(0, var(--sky-top-b), 255)
      ),
      rgb(
        clamp(0, var(--sky-bottom-r), 255),
        clamp(0, var(--sky-bottom-g), 255),
        clamp(0, var(--sky-bottom-b), 255)
    ));
  `;
};

export const getSunInfos = () => {
  return css`
    --sun-progress: calc((var(--lc-time, 0) - 0.25) * 2);
    --sun-x: calc(5% + var(--sun-progress) * 90%);
    --sun-y: calc(85% - var(--sun-elevation) * 65%);
    --sun-elevation: pow(var(--lc-light-intensity, 0), 0.8);
    --sun-size: calc(40px + (1 - var(--sun-elevation, 0)) * 60px);
    `;
};