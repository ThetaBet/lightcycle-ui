import { FontObjectAttribute } from "./types";

export const defaultFontConfig: Array<FontObjectAttribute> = [
  { start: 0, end: 0.25, title: "Serif", body: "monospace" },
  { start: 0.25, end: 0.375, title: "Serif", body: "Sans-serif" },
  { start: 0.375, end: 0.708, title: "Sans-serif", body: "Sans-serif" },
  { start: 0.708, end: 0.792, title: "monospace", body: "Sans-serif" },
  { start: 0.792, end: 1, title: "Sans-serif", body: "Sans-serif" },
];