export function generateNickname() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var nickname = '';
  for (var i = 0; i < 5; i++) {
    nickname += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nickname + Date.now();
}
export const hostIp = /^(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?$/;
export const hostDomain = /^([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]{1,5})?$/;