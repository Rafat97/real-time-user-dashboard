export function convertToInternationalCurrencySystem(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e12
    ? (Math.abs(Number(labelValue)) / 1.0e12).toFixed(2) + 'T'
    : Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
    : Math.abs(Number(labelValue));
}
