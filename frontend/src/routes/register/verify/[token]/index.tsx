import { component$, useVisibleTask$, useStore } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const { params } = useLocation();

  const store = useStore({
    token: '',
    verified: false,
    loading: true,
  });

  useVisibleTask$(() => {
    store.token = params.token;

    fetch(`${process.env.API_DOMAIN}/api/v1/auth/verify?token=${store.token}`, {
      method: 'GET',
      headers: {
        token: store.token,
      },
      credentials: 'include',
    }).then(async (v) => {
      const { verified } = await v.json();
      store.verified = verified;
      store.loading = false;
      window.location.href = '/register/verify';
    });
  });

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div class="hero min-h-screen">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <p class="py-6">
              {!store.loading &&
                (store.verified
                  ? 'Your account has been verified successfully'
                  : "We couldn't verify your account. Try again later")}
            </p>
            <Link href="/" class="btn btn-primary">
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
