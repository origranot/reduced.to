import { component$, useClientEffect$, useStore } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const { params } = useLocation();

  const store = useStore({
    token: '',
    verified: false,
    loading: true,
  });

  useClientEffect$(() => {
    store.token = params.token;

    fetch(`${process.env.API_DOMAIN}/api/v1/auth/verify?token=${store.token}`, {
      method: 'GET',
      headers: {
        token: store.token,
      },
    }).then(async (v) => {
      const { verified } = await v.json();
      store.verified = verified;
      store.loading = false;
    });
  });

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <p className="py-6">
              {!store.loading &&
                (store.verified
                  ? 'Your account has been verified successfully'
                  : "We couldn't verify your account. Try again later")}
            </p>
            <Link href="/" className="btn btn-primary">
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
