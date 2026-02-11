import { PREFIX } from "../../utils/slugs";

export enum VIDE_LIGHT_CONTROLLER_ATTR {
  MODE = 'mode',
  TICK = 'tick',
  TIME = 'time',
  FONTS = 'fonts',
  CLOCK = 'clock',
  HAS_SECONDS_HAND = 'has-seconds-hand',
}

export enum VIDE_LIGHT_CONTROLLER_MODE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum VIDE_LIGHT_CONTROLLER_CLOCK {
  ANALOG = 'analog',
  DIGITAL = 'digital',
}

export enum VIDE_LIGHT_CONTROLLER_STYLE_VARIABLES {
  TIME = `--${PREFIX}-time`,
  TIME_PERCEIVED = `--${PREFIX}-time-perceived`,
  DAY_PROGRESS = `--${PREFIX}-day-progress`,
  LIGHT_INTENSITY = `--${PREFIX}-light-intensity`,
  LIGHT_TEMPERATURE = `--${PREFIX}-light-temperature`,
  LIGHT_X = `--${PREFIX}-light-x`,
  LIGHT_Y = `--${PREFIX}-light-y`,
  FONT_TITLE = `--${PREFIX}-font-title`,
  FONT_BODY = `--${PREFIX}-font-body`,
  LIGHT_FRONT = `--${PREFIX}-light-front`,
  LIGHT_BACK = `--${PREFIX}-light-back`
}

export enum VIDE_LIGHT_CONTROLLER_EVENT {
  TIME_CHANGE = `${PREFIX}:timechange`,
  MANUAL_TIME_UPDATE = `${PREFIX}:manualtimeupdate`,
}

export interface FontObjectAttribute {
  start: number;
  end: number;
  title: string;
  body: string;
}