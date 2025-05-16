// src/config.ts

const ENV = 'development'; 

const config = {
  development: {
    API_URL: 'http://192.168.1.105:3000',
  },
  production: {
    API_URL: 'https://api.midominio.com',
  },
};

export const API_URL = config[ENV].API_URL;
