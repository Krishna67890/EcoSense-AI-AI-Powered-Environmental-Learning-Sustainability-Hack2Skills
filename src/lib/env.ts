/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are present and valid.
 */

export function validateEnv() {
  const env = import.meta.env;

  const config = {
    VITE_FIREBASE_API_KEY: String(env.VITE_FIREBASE_API_KEY || '').trim(),
    VITE_FIREBASE_AUTH_DOMAIN: String(env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    VITE_FIREBASE_PROJECT_ID: String(env.VITE_FIREBASE_PROJECT_ID || '').trim(),
    VITE_FIREBASE_STORAGE_BUCKET: String(env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
    VITE_FIREBASE_MESSAGING_SENDER_ID: String(env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    VITE_FIREBASE_APP_ID: String(env.VITE_FIREBASE_APP_ID || '').trim(),
    VITE_GEMINI_API_KEY: String(env.VITE_GEMINI_API_KEY || '').trim(),
  };

  const missing = Object.entries(config)
    .filter(([_, value]) => !value || value === "undefined" || value === "null" || value.length < 5)
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMsg = `[EcoSense AI] Configuration Error: Missing or invalid environment variables.`;
    console.error(errorMsg, "Missing keys:", missing);

    if (import.meta.env.PROD) {
      document.body.innerHTML = `
        <div style="padding: 40px; color: #ef4444; background: #0a0a0a; min-height: 100vh; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <div style="background: #171717; padding: 30px; border-radius: 16px; border: 1px solid #dc2626; max-width: 600px;">
            <h1 style="font-size: 1.5rem; color: #f87171; margin-bottom: 1rem;">Deployment Blocked: Config Missing</h1>
            <p style="color: #d4d4d4; margin-bottom: 1.5rem;">The following required variables are missing from your Vercel Environment Settings:</p>
            <div style="background: #000; padding: 15px; border-radius: 8px; text-align: left; margin-bottom: 1.5rem; border: 1px solid #262626;">
              <code style="color: #4ade80; font-family: monospace; font-size: 0.9rem; line-height: 1.5;">${missing.join('<br>')}</code>
            </div>
            <p style="color: #737373; font-size: 0.875rem;">
              <strong>Action Required:</strong> Add these to Vercel (Project Settings > Environment Variables) and then <strong>Redeploy</strong> your project.
            </p>
          </div>
        </div>
      `;
      // We don't throw an error here to allow the UI to render, but we return false to block initialization
    }
    return false;
  }
  return true;
}
