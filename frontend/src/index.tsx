import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-23j2qv23h4mq7jhe.us.auth0.com"
      clientId="HzPC4dQ7sxiCqdAtJ96OrkIzB7rwLj4J"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/dashboard",
        scope: "openid profile email",
      }}
      onRedirectCallback={(appState) => {
        console.log("Redirect callback executed", appState);
        // Don't clear the URL immediately to allow code processing
        setTimeout(() => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }, 1000);
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);