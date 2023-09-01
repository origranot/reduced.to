import { serverAuth$ } from '@builder.io/qwik-auth';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import type { Provider } from '@auth/core/providers';
import { JWT } from '@auth/core/jwt';
import {  Account, Profile, Session, User } from '@auth/core/types';
import { AdapterUser } from '@auth/core/adapters';
import { createHash } from 'node:crypto';

/**
 * Auth Configuration
 * Includes functions and configuration used to create authentication functionality.
 */
export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(({ env }) => {
  // export async function updateSession
  const hashProviderId = (str: string) =>  { 
    // TODO: move function hashProviderId to a apropiate place
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
  }
  const actionAPIFactory = ({ path, credentials }: { path: '/api/v1/auth/login' | "/api/v1/auth/signup"; credentials: { email: string; password: string; name?: string; }}) => async () => {
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
  };
  const signUp = async (profile: Profile, account: Account) => {   
    const password = hashProviderId(`${account.provider}-${account.providerAccountId}`);
    const action = actionAPIFactory({
      path: '/api/v1/auth/signup',
      credentials: { email: profile.email!, password, name: profile.name! },
    });

    try {
      const data = await action();
      return Boolean(data);
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const signIn = async (profile: Profile, account: Account) => { 
    const password = hashProviderId(`${account.provider}-${account.providerAccountId}`);
    const action = actionAPIFactory({
      path: '/api/v1/auth/login',
      credentials: { email: profile.email!, password },
    });
  
    try {
      const data = await action();
      return Boolean(data);
    } catch (error) {
      console.error(error);
      return false;
    }
   }
  // Ensure all environment variables are set
  const envs = {
    AUTH_SECRET: env.get('AUTH_SECRET')!,
    GITHUB_ID: env.get('GITHUB_ID')!,
    GITHUB_SECRET_CLIENT: env.get('GITHUB_SECRET_CLIENT')!,
    GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID')!,
    GOOGLE_API_KEY: env.get('GOOGLE_CLIENT_SECRET')!,
  };
  if (!Object.values(envs).every(Boolean)) {
    throw new Error(`Missing envs: ${Object.entries(envs).filter(([, v]) => !v).map(([k]) => k).join(', ')}`);
  }
  return {
    pages: { error: "/login" },
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
      jwt: async (params: { token: JWT; user?: User | AdapterUser | undefined; account?: Account | null | undefined; profile?: Profile | undefined; isNewUser?: boolean | undefined; }) => { 
        if (!params.user || !params.account) return params.token; 
        const passWordByProvider = hashProviderId(`${params.account.provider}-${params.token.sub}`);
        const optionsSignIn = {
          path: '/api/v1/auth/login' as const,
          credentials: {
            email: params.user.email!,
            password: passWordByProvider,
          }
        };
        try {
          const action = actionAPIFactory(optionsSignIn);
          const data = await action();
          if (data) return { ...data, ...params.token };
        } catch (error) {
          console.log(error)
        }
        return null;
      },
      signIn: async (params: { account?: Account | null | undefined; profile?: Profile | undefined; }) => { 
        const { account, profile } = params;
        if (!account?.providerAccountId || !account.provider || !profile?.name || !profile?.email) {
          return false;
        }

        if (await signUp(profile, account)) {
          return true;
        }

        return signIn(profile, account);
      },
      session: (params: { session: Session; user: User | AdapterUser; token: JWT; }) => { 
        return {
          ...params.session, 
          accessToken: params.token.accessToken, 
          refreshToken: params.token.refreshToken,
          isProviderLogin: true,
          role: Role.USER,
        };
      },
    },
  };
});

 export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface ExtendSesstion extends Session {
  accessToken: string;
  refreshToken: string;
  isProviderLogin: boolean;
  role: Role;
} 

export interface UserCtx {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified: boolean;
}