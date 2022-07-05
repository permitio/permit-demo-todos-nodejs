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
    domain: "acalla-demoapp.us.auth0.com",
    clientId: "w4SUOtl4HacGNbFvEiqY3zBUdDJr128x",
    audience: "https://demoapi.acalla.com/v1/",
  },
  authentication: {
    provider: window?._env_?.AUTHENTICATION_PROVIDER || "auth0",
  },
  authorization: {
    embedUrl: window?._env_?.AUTHZ_EMBED_URL || "http://localhost:3000",
  },
  services: {
    pexelsKey: "563492ad6f91700001000001e543a2afd987403b95afc289dd643344",
  },
};

export default Config;
