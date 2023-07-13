import { serverAuth$ } from '@builder.io/qwik-auth';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import type { Provider } from '@auth/core/providers';
import { UserCtx } from './layout';
import { JWT } from '@auth/core/jwt';
import { Account, Profile, Session, User } from '@auth/core/types';
import { AdapterUser } from '@auth/core/adapters';
import bcrypt from 'bcrypt';

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(
  ({ env }) => {
    /**
     * @description
     * This is used to check if all the envs are set currently.
     * This check let us know if we are missing any envs for the auth functionality.
     */
    const envs = {
      AUTH_SECRET: env.get('AUTH_SECRET')!,
      GITHUB_ID: env.get('GITHUB_ID')!,
      GITHUB_SECRET_CLIENT: env.get('GITHUB_SECRET_CLIENT')!,
      GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID')!,
      GOOGLE_API_KEY: env.get('GOOGLE_CLIENT_SECRET')!,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (!Object.values(envs).every(Boolean)) throw new Error(`the Missings envs: ${Object.entries(envs).filter(([_, v]) => !v).map(([k]) => k).join(', ')}`)
    return {
    secret: envs.AUTH_SECRET,
    trustHost: true,
    providers: [
      GitHub({
        clientId: envs.GITHUB_ID,
        clientSecret: envs.GITHUB_SECRET_CLIENT,
      }),
      Google({ 
        clientId: envs.GOOGLE_CLIENT_ID, 
        clientSecret: envs.GOOGLE_API_KEY,
      }),

    ] as Provider[],
    callbacks: {
      jwt: useSignUp,
      session: updateSesstion,
    },
  }}
);


interface Credentials {
  email: string;
  password: string;
  name?: string;
  // provider: "google" | "github" | "email";
}

interface Action {
  path: '/api/v1/auth/login' | "/api/v1/auth/signup";
  credentials: Credentials;
}


/**
 * 
 * @example
 const signInAction = actionAPIFactory({
  path: '/api/v1/auth/login',
  credentials: {
    email: 'example@example.com',
    password: 'password',
  },
});

const result = signInAction()
 */
const actionAPIFactory = ({ path, credentials }: Action) => async () => {
  const response: Response = await fetch(`${process.env.API_DOMAIN}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = { ...await response.json(), ok: response.ok };

  if (!result.ok || !result.accessToken || !result.refreshToken) {
    return false;
  }

  return result as UserCtx;
}

export async function useSignUp(params: {
  token: JWT;
  user?: User | AdapterUser | undefined;
  account?: Account | null | undefined;
  profile?: Profile | undefined;
  isNewUser?: boolean | undefined;
}) {
  if (!params.user || !params.account) return params.token;

  console.log(hashPassword(`${params.account.provider}-${params.token.sub}`), hashPassword(`${params.account.provider}-${params.token.sub}`).length)
  
  const signUpAction = actionAPIFactory({
    path: '/api/v1/auth/signup',
    credentials: {
      email: params.user.email!,
      password: hashPassword(`${params.account.provider}-${params.token.sub}`),
      name: params.user.name!,
      // provider: params.account.provider as Credentials["provider"],
    },
  });
  
  const data = await signUpAction();
  
  if (data) return {...data, ...params.token}
  return null
}

export async function updateSesstion(params: {
  session: Session;
  user: User | AdapterUser;
  token: JWT;
}) {
  return {...params.session, accessToken: params.token.accessToken, refreshToken: params.token.refreshToken}
}

// We are using a generic password for all the users for the provider only.
// This done to avoid the failure of the sign in action as the password is required in the database schema.           
// TODO: Error handling for the user that already exists.
// TODO: Validate the user was signup with the provider.
// TODO: hash the .sub from the provider to avoid the generic password.
// TODO: when the user is in register flow then use the signup else use the login if on the login flow.
// TODO: ADD PROVIDER-ID


export function hashPassword(password: string) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}