

export default abstract class VideElement extends HTMLElement {
  styles: string = '';
  static get observedAttributes(): string[] {
    return [];
  }
  constructor(preventShadow = false) {
    super();
    if (!preventShadow) {
      this.attachShadow({ mode: 'open' });
    }
  }

  createChildElement(tagName: string, id?: string, classNames?: Array<string>, attributes?: { [key: string]: string }): HTMLElement {
    const element = document.createElement(tagName);
    if (id) element.id = id;
    if (classNames) classNames.forEach(className => element.classList.add(className));
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
    }
    return element;
  }

  render(): string {
    return '<slot></slot>';
  }

  async waitChildrenUpgraded(): Promise<void> {
    if (!this.shadowRoot) return;
    const els = Array.from(this.shadowRoot.querySelectorAll('*')) as Element[];
    const customEls = els.filter(e => e.localName && e.localName.includes('-'));
    await Promise.all(customEls.map(async (el) => {
      const name = el.localName;
      await customElements.whenDefined(name);
      try { customElements.upgrade(el); } catch (e) { 
        console.warn(`Failed to upgrade element <${name}>:`, e);
      }
    }));
  }

  connectedCallback(): void {
    const html = this.render();
    if (this.shadowRoot) {
      const template = document.createElement('template');
      template.innerHTML = html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    } else {
      this.innerHTML = html;
    }
    if (this.styles) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(this.styles);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
  }
}