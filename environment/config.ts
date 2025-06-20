// src/config.ts

const ENV = 'development'; 

const config = {
  development: {
    API_URL: 'http://172.20.10.3:3000',
  },
  production: {
    API_URL: 'https://api.midominio.com',
  },
};

export const API_URL = config[ENV].API_URL;
