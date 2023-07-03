import { serverAuth$ } from '@builder.io/qwik-auth';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import type { Provider } from '@auth/core/providers';

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
      })
    ] as Provider[],
    callbacks: {
      jwt: async ({token, user}) => {
        if (!user) return token;
        const signInAction = actionAPIFactory({
          path: '/api/v1/auth/signup',
          credentials: {
            email: user.email!,
            // We are using a generic password for all the users for the provider only.
            // This done to avoid the failure of the sign in action as the password is required in the database schema.
            // To overcome using this generic password we can use the user verified option in the database schema
            // and check if the user is verified or not.             
            password: 'GenricPass@123',
            name: user.name!,
          },
        });
        const data = await signInAction();
        if (data) return {...data, ...token}
        return null
      },
      session: async ({ session, token }) => {
        return {...session, accessToken: token.accessToken, refreshToken: token.refreshToken}
      } 
    },

  }}
);


interface Credentials {
  email: string;
  password: string;
  name?: string;
}

interface Action {
  path: string;
  credentials: Credentials;
}

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

  return result;
}

export const signUpAction = actionAPIFactory({
  path: '/api/v1/auth/signup',
  credentials: {
    email: 'example@example.com',
    password: 'password',
    name: 'Example Name',
  },
});

export const signInAction = actionAPIFactory({
  path: '/api/v1/auth/login',
  credentials: {
    email: 'example@example.com',
    password: 'password',
  },
});

