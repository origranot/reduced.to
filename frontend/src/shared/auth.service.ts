import jwtDecode from 'jwt-decode';

export const setCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/ ; SameSite=Lax; Secure';
};

export const getCookieFromDocument = (name: string) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const getCookie = (cookieString: string, name: string) => {
  const nameEQ = name + '=';
  const ca = cookieString.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export interface User {
  sub: string;
  firstName: string;
  email: string;
}

export function getUser(): User | null {
  const token = getCookieFromDocument('s_id');
  if (!token) {
    return null;
  }

  return jwtDecode(token);
}

export const login = async (email: string, password: string): Promise<Response> => {
  return fetch(`${process.env.API_DOMAIN}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const register = (name: string, email: string, password: string): Promise<Response> => {
  return fetch(`${process.env.API_DOMAIN}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const checkAuth = async (cookieString: string | null) => {
  if (!cookieString) return false;

  const authToken = getCookie(cookieString, 's_id');
  if (!authToken) return false;

  const res = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/check`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return res.status === 200;
};
