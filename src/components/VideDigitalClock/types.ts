import { PREFIX } from "../../utils/slugs";

export enum VIDE_DIGITAL_CLOCK_ATTR {
  TIME = 'time',
  MODE = 'mode',
}

export enum VIDE_DIGITAL_CYPHER_ATTR {
  DIGIT = 'digit'
}

export enum VIDE_DIGITAL_CLOCK_MODE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export enum VIDE_DIGITAL_CLOCK_EVENT {
  MANUAL_TIME_UPDATE = `${PREFIX}:manualtimeupdate`,
  MOUSE_DOWN = 'mousedown',
  MOUSE_LEAVE = 'mouseleave',
  MOUSE_UP = 'mouseup',

}

export enum VIDE_DIGITAL_CYPHER_SELECTORS {
  SEGMENT = '.segment',
}