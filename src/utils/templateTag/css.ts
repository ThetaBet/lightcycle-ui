

const css = (strings: TemplateStringsArray, ...values: any[]): string => {
  const cssText = strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
  return cssText;
}

export default css;