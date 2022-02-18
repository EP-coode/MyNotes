export const default_charset: string =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getRandomString(
  length = 10,
  charset = default_charset,
): string {
  const result = [];
  const charactersLength = charset.length;
  for (let i = 0; i < length; i++) {
    result.push(charset.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}
