// reactly.app uses umami for analytics

const API_URL = "https://tracking.techsapien.dev/api";

export const loginUmami = async () => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "shubhamchopade10@gmail.com",
      password: "SyracuseBoston#1997",
    }),
  });
  const data = await res.json();
  return data;
};

export const createWebsiteUmami = async (token: string) => {
  const res = await fetch(`${API_URL}/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      domain: "portfolio-1.reactly.app",
      name: "Portfolio 1",
      enable_share_url: true,
      public: true,
    }),
  });
  const data = await res.json();
  return data;
};
