export type listAuthMethodsResponse = {
  usernamePassword: boolean;
  emailPassword: boolean;
  authProviders: {
    name: string;
    state: string;
    codeVerifier: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    authUrl: string;
  }[];
};

export async function listAuthMethods(): Promise<listAuthMethodsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/users/auth-methods`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const login = await res.json();
  return login;
}

type authWithOauth2 = {
  provider: string;
  code: string;
  codeVerifier: string;
  redirectUrl: string;
};

export async function authWithOauth2(props: authWithOauth2): Promise<any> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/users/auth-with-oauth2`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: "http://localhost:3000",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        provider: props.provider,
        code: props.code,
        codeVerifier: props.codeVerifier,
        redirectUrl: props.redirectUrl,
        createData: {
          banned: false,
          showOnline: true,
          lastActive: new Date(),
          emailVisibility: false,
          verified: true,
        },
      }),
    }
  );
  const login = await res.json();
  console.log("LOGGING in", login);
  return login;
}

export async function authWithPassword(props: {
  identity: string;
  password: string;
}): Promise<any> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/users/auth-with-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: props.identity,
        password: props.password,
      }),
    }
  );
  // const login = await res.json();
  return res;
}

export async function createUser(props: {
  email: string;
  password: string;
  username: string;
  passwordConfirm: string;
}): Promise<any> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/users/records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: props.email,
        username: props.username,
        password: props.password,
        passwordConfirm: props.passwordConfirm,
      }),
    }
  );
  const login = await res.json();
  return login;
}
