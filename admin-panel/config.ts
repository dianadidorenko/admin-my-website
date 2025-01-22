interface Config {
  baseUrl: string;
}

const configs = {
  production: { baseUrl: "https://admin-my-website.vercel.app/" },
  local: { baseUrl: "http://localhost:8000" },
};

const environment = "production"; // Укажите "local" для локальной разработки
export const config: Config = configs[environment];
