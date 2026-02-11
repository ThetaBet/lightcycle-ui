const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, i) => result + string + (values[i] || ''), '');
}

export default html;