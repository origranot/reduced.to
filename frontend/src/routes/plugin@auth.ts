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
      GOOGLE_API_KEY: env.get('GOOGLE_API_KEY')!,
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
        clientSecret: envs.GOOGLE_API_KEY 
      })
    ] as Provider[],
  }}
);
