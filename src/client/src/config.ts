interface ConfigOptions {
  backend: { url: string };
  auth0: any;
  authentication: { provider: string };
  authorization: { embedUrl: string };
  services: { pexelsKey: string };
}
declare global {
  interface Window {
    _env_: any;
  }
}

const Config: ConfigOptions = {
  backend: {
    url:
      process.env.REACT_APP_BACKEND_URL ||
      window?._env_?.BACKEND_URL ||
      "http://localhost:8008",
  },
  auth0: {
    domain:
      process.env.AUTH0_DOMAIN ||
      window?._env_?.AUTH0_DOMAIN ||
      "acalla-demoapp.us.auth0.com",
    clientId:
      process.env.AUTH0_CLIENT_ID ||
      window?._env_?.AUTH0_CLIENT_ID ||
      "w4SUOtl4HacGNbFvEiqY3zBUdDJr128x",
    audience:
      process.env.AUTH0_AUDIENCE ||
      window?._env_?.AUTH0_AUDIENCE ||
      "https://demoapi.acalla.com/v1/",
  },
  authentication: {
    provider: "auth0",
  },
  authorization: {
    embedUrl: window?._env_?.AUTHZ_EMBED_URL || "http://localhost:3000",
  },
  services: {
    pexelsKey: "563492ad6f91700001000001e543a2afd987403b95afc289dd643344",
  },
};

export default Config;
