import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { AlertProvider } from './components/AlertProvider'

// Configure Amplify
try {
  Amplify.configure({
    ...outputs,
    // Add any additional Amplify configuration here
  });
} catch (error) {
  // Amplify configuration error
}

// Create a function to render the app
function renderApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AlertProvider>
          <App />
        </AlertProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

// Ensure the DOM is loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}