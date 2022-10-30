export function setToken(token: string) {
  localStorage.setItem('s_id', token);
}

export function getToken() {
  return localStorage.getItem('s_id');
}

export function isLoggedIn() {
  return !!getToken();
}
