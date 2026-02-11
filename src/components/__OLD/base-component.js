import { css, html } from '../utils/tag';

export default class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  } 

  render() {
    this.shadowRoot.innerHTML = `
    ${this.shadowRoot.innerHTML}
    ${this.setCss()}
    ${this.setHtml()}
    `;
  }

  setCss() {
    return css``;
  }

  setHtml() {
    return html``;
  }

  createChild(tagName, id, classNames, attributes) {
    const el = document.createElement(tagName);
    if (id) el.id = id;
    if (classNames) classNames.forEach(c => el.classList.add(c));
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

  connectedCallback() {
    this.render();
  }

  getAttribute(name, defaultValue = null) {
    return super.getAttribute(name) || defaultValue;
  }
}