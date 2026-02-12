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
  AUTO = 'auto',
}

export enum VIDE_LIGHT_CONTROLLER_EVENT {
  TIME_CHANGE = `${PREFIX}:timechange`,
  MANUAL_TIME_UPDATE = `${PREFIX}:manualtimeupdate`,
  CHANGE = 'change'
}

export interface FontObjectAttribute {
  start: number;
  end: number;
  title: string;
  body: string;
}