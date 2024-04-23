/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: "AIzaSyBCbarwY5FQZ0hY0iufyULVMjKMzZoRNj0",
    AUTH_DOMAIN: "health-app-react.firebaseapp.com",
    PROJECT_ID: "health-app-react",
    STORAGE_BUCKET: "health-app-react.appspot.com",
    MESSAGE_SENDER_ID: "912573667215",
    APP_ID: "1:912573667215:web:3012fd42a8ec64c7e31dfa",
    MEASUREMENT_ID: "G-7LM1B2RCS7",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

module.exports = nextConfig;
