import { component$, useClientEffect$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export default component$(() => {
  const { params } = useLocation();

  const store = useStore({
    token: '',
  });

  useClientEffect$(() => {
    store.token = params.token;

    fetch(`${process.env.API_DOMAIN}/api/v1/auth/verify?token=${store.token}`, {
      method: 'GET',
      headers: {
        token: store.token,
      },
    }).then((v) => {
      console.log(v);
    });
  });

  return (
    <div class="min-h-screen flex flex-col register-bg">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
              exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
});
