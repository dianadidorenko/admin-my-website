interface Config {
  baseUrl: string;
}

const configs = {
  production: {
    baseUrl:
      "https://admin-my-website-qqnzmn8d9-dianadidorenkos-projects.vercel.app",
  },
  local: { baseUrl: "http://localhost:8000" },
};

const environment = "production"; // Укажите "local" для локальной разработки
export const config: Config = configs[environment];
