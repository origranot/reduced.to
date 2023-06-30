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
      signIn: async ({account, profile}) => {
        if (!profile || !account) return false
        const data = await signUpAction(profile.email!, account?.providerAccountId, profile.name!)
        console.log('signIn', profile.email!, account?.providerAccountId, profile.name!)
        if (data) return true
        // // try to check if the user is already exist in the database
        // try {
        //   const data = await signInAction(profile.email!, account?.providerAccountId)
        //   if (data) return true
        //   // if the user is not exist in the database try to create a new user
        //   try {
        //     const data = await signUpAction(profile.email!, account?.providerAccountId, profile.name!)
        //     if (data) return true
        //   } catch (error) {
        //     console.error(error)

        //   }
        // } catch (error) {
        //   console.error(error)

        // }

        
        
        // TODO: handle the error message provide unauthorized error message to the user. (there is for now the built in error massage of auth.js)
        return false
      },
      // jwt: async ({token, account, isNewUser, profile, user}) => {
      //   return {token, account, isNewUser, profile, user}
      // },
      session: async ({ session }) => {
        // TODO: add role, isVerified and id to the session from the database or from the jwt
        return { ...session, some: "data" }
      },
      // redirect: async ({url, baseUrl}) => {
      //   console.log('redirect', {url, baseUrl})
      //   return {url, baseUrl}
      // },

    }
  }}
);


export const signUpAction = async (email: string, password: string, name: string) => {
  const data: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });
  const result = {...await data.json(), ok: data.ok};

  if (!result.ok || !result.accessToken || !result.refreshToken) {
    return false
  }

  return true

}
export const signInAction = async (email: string, password: string) => {
  const data: Response = await fetch(`${process.env.API_DOMAIN}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const result = {...await data.json(), ok: data.ok};
  console.log('signInAction', result)

  if (!result.ok || !result.accessToken || !result.refreshToken) {
    return false
  }

  return true
}