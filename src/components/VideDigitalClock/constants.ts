export const SEGMENTS = {
  a: 1 << 0,
  b: 1 << 1,
  c: 1 << 2,
  d: 1 << 3,
  e: 1 << 4,
  f: 1 << 5,
  g: 1 << 6,
};

export const DIGITS = {
  "0":
    SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.e | SEGMENTS.f,
  "1": SEGMENTS.b | SEGMENTS.c,
  "2": SEGMENTS.a | SEGMENTS.b | SEGMENTS.d | SEGMENTS.e | SEGMENTS.g,
  "3": SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.g,
  "4": SEGMENTS.b | SEGMENTS.c | SEGMENTS.f | SEGMENTS.g,
  "5": SEGMENTS.a | SEGMENTS.c | SEGMENTS.d | SEGMENTS.f | SEGMENTS.g,
  "6":
    SEGMENTS.a | SEGMENTS.c | SEGMENTS.d | SEGMENTS.e | SEGMENTS.f | SEGMENTS.g,
  "7": SEGMENTS.a | SEGMENTS.b | SEGMENTS.c,
  "8":
    SEGMENTS.a |
    SEGMENTS.b |
    SEGMENTS.c |
    SEGMENTS.d |
    SEGMENTS.e |
    SEGMENTS.f |
    SEGMENTS.g,
  "9":
    SEGMENTS.a | SEGMENTS.b | SEGMENTS.c | SEGMENTS.d | SEGMENTS.f | SEGMENTS.g,
};

export const DIGITAL_CYPHER_ACTIVE_CLASS = 'on';

export const DELTA_MINUTES = 1 as const;