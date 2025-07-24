// src/config.ts

const ENV = 'development'; 

const config = {
  development: {
    API_URL: 'https://reserva-minubus.onrender.com',
  },
  production: {
    API_URL: 'https://reserva-minubus-m39k.onrender.com',
  },
};

export const API_URL = config[ENV].API_URL;
