import { PREFIX } from "../../utils/slugs";

export enum VIDE_ANALOG_CLOCK_ATTR {
  TIME = 'time',
  HAS_SECONDS_HAND = 'has-seconds-hand',
}

export enum VIDE_ANALOG_CLOCK_MODE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum VIDE_ANALOG_CLOCK_EVENT {
  WHEEL = "wheel",
  MANUAL_TIME_UPDATE = `${PREFIX}:manualtimeupdate`,
}

export enum VIDE_ANALOG_CLOCK_SELECTORS {
  CLOCK = '.clock',
  HOUR_HAND = '#hour-hand',
  MINUTE_HAND = '#minute-hand',
}