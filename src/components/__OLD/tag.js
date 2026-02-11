export const html = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] !== undefined ? values[i] : '');
  }, '');
};

export const css = (strings, ...values) => {
  const result = strings.reduce((result, string, i) => {
    return result + string + (values[i] !== undefined ? values[i] : '');
  }, '');
  if (!result.trim()) return '';
  return `<style>${result}</style>`;
};