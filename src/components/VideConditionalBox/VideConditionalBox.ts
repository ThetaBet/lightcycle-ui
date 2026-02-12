import { css, html } from "../../utils/templateTag";
import { VideElement } from "../VideElement";
import { VIDE_LIGHT_CONTROLLER_ATTR } from "../VideLightController/types";
import { VIDE_CONDITIONAL_BOX_ATTR, VIDE_CONDITIONAL_BOX_MODE, VIDE_CONDITIONAL_BOX_STATUS } from "./types";

export default class VideoConditionalBox extends VideElement {
  static get observedAttributes(): string[] {
    return [
      VIDE_CONDITIONAL_BOX_ATTR.LOW_LIGHT_THRESHOLD,
      VIDE_CONDITIONAL_BOX_ATTR.HIGH_LIGHT_THRESHOLD,
      VIDE_CONDITIONAL_BOX_ATTR.MODE,
    ];
  }
  private _observer: MutationObserver;
  private _container: HTMLDivElement;
  private _internalTemplate: HTMLTemplateElement;
  private _contentLoaded = false;
  constructor() {
    super(true);
    this._container = this.createChildElement(
      "div",
      "container",
    ) as HTMLDivElement;
    this._internalTemplate = this.createChildElement("template") as HTMLTemplateElement;
  }

  get lowLightThreshold(): number {
    return parseFloat(
      this.getAttribute(VIDE_CONDITIONAL_BOX_ATTR.LOW_LIGHT_THRESHOLD),
    );
  }
  set lowLightThreshold(value: number) {
    this.setAttribute(
      VIDE_CONDITIONAL_BOX_ATTR.LOW_LIGHT_THRESHOLD,
      value.toString(),
    );
  }

  get highLightThreshold(): number {
    return parseFloat(
      this.getAttribute(VIDE_CONDITIONAL_BOX_ATTR.HIGH_LIGHT_THRESHOLD),
    );
  }
  set highLightThreshold(value: number) {
    this.setAttribute(
      VIDE_CONDITIONAL_BOX_ATTR.HIGH_LIGHT_THRESHOLD,
      value.toString(),
    );
  }

  get mode(): VIDE_CONDITIONAL_BOX_MODE {
    return (this.getAttribute(
      VIDE_CONDITIONAL_BOX_ATTR.MODE,
    ) || VIDE_CONDITIONAL_BOX_MODE.LIGHT) as VIDE_CONDITIONAL_BOX_MODE;
  }
  set mode(value: VIDE_CONDITIONAL_BOX_MODE) {
    this.setAttribute(VIDE_CONDITIONAL_BOX_ATTR.MODE, value);
  }

  get status(): VIDE_CONDITIONAL_BOX_STATUS {
    return (this.getAttribute(
      VIDE_CONDITIONAL_BOX_ATTR.STATUS,
    ) || VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTED) as VIDE_CONDITIONAL_BOX_STATUS;
  }
  set status(value: VIDE_CONDITIONAL_BOX_STATUS) {
    this.setAttribute(VIDE_CONDITIONAL_BOX_ATTR.STATUS, value);
  }

  get time(): number {
    const value = document.documentElement.getAttribute(VIDE_LIGHT_CONTROLLER_ATTR.TIME);
    return parseFloat(value);
  }

  requestUpdate(newValue: number) {
    if (isNaN(newValue)) return;
    const shouldShow = this.mode === VIDE_CONDITIONAL_BOX_MODE.LIGHT
      ? newValue >= this.lowLightThreshold && newValue <= this.highLightThreshold
      : newValue < this.lowLightThreshold || newValue > this.highLightThreshold;
    if (shouldShow && this.status === VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTED) {
      this.mount();
    }
    if (!shouldShow && this.status === VIDE_CONDITIONAL_BOX_STATUS.MOUNTED) {
      this.unmount();
    }
  }

  async mount() {
    //TODO: skip infinite animations
    if (this.status === VIDE_CONDITIONAL_BOX_STATUS.MOUNTED || this.status === VIDE_CONDITIONAL_BOX_STATUS.MOUNTING) return;
    if (!this._internalTemplate) return
    this.status = VIDE_CONDITIONAL_BOX_STATUS.MOUNTING;
    this._container.innerHTML = ``;
    this._container.classList.remove("unmounted");
    this._container.classList.remove("unmounting");
    this._container.classList.add("mounting");
    this._container.appendChild(this._internalTemplate.content.cloneNode(true));
    const animations = this._container.getAnimations({ subtree: true });
    if (animations.length > 0) {
      const promises = await Promise.all(animations.map(animation => animation.finished));
      await Promise.all(promises);
      this.status = VIDE_CONDITIONAL_BOX_STATUS.MOUNTED;
      return
    }
    this.status = VIDE_CONDITIONAL_BOX_STATUS.MOUNTED;
    this._container.classList.remove("mounting");
    this._container.classList.add("mounted");
  }

  async unmount() {
    //TODO: skip infinite animations
    if (this.status === VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTED || this.status === VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTING) return;
    this.status = VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTING;
    this._container.classList.remove("mounted");
    this._container.classList.remove("mounting");
    this._container.classList.add("unmounting");
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const animations = this._container.getAnimations({ subtree: true });
    if (animations.length > 0) {
      const promises = animations.map(animation => animation.finished);
      await Promise.all(promises);
    }
    this._container.classList.remove("unmounting");
    this._container.classList.add("unmounted");
    this._container.innerHTML = ``;
    this.status = VIDE_CONDITIONAL_BOX_STATUS.UNMOUNTED;
  }

  loadContent() {
    if (this._contentLoaded) return;
    while (this.childNodes.length > 0) {
      this._internalTemplate.content.appendChild(this.childNodes[0]);
    }
    this._contentLoaded = true;
  }

  init() {
    this.appendChild(this._container);
    this._observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === VIDE_LIGHT_CONTROLLER_ATTR.TIME) {
          const value = (mutation.target as HTMLElement).getAttribute(VIDE_LIGHT_CONTROLLER_ATTR.TIME);
          this.requestUpdate(parseFloat(value));
        }
      })
    });
    this._observer.observe(document.documentElement, {
      attributes: true,
    });
  }

  connectedCallback(): void {
    // super.connectedCallback();
    this.loadContent();
    this.init();
    this.requestUpdate(this.time);
  }

  attributeChangedCallback(): void {
    if (!this._contentLoaded) return;
    this.requestUpdate(this.time);
  }

  disconnectedCallback(): void {
    if (this._observer) {
      this._observer.disconnect();
    }
  }
}