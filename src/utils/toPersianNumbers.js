const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNumbers(number) {
  if (number === null || number === undefined) return '';
  return number.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}
