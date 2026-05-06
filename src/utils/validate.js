export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUsername(username) {
  return username && username.length >= 3 && username.length <= 30;
}

export function validatePassword(password) {
  return password && password.length >= 8;
}
