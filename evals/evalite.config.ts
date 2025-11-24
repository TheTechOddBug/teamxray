// Evalite Configuration for GitHub Models
// This configures autoevals to use GitHub Models instead of OpenAI

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

// CRITICAL: Configure autoevals to use GitHub Models
// The autoevals library uses OpenAI SDK internally, so we redirect it to GitHub
if (process.env.GITHUB_TOKEN) {
  // Set OpenAI env vars to point to GitHub Models
  process.env.OPENAI_API_KEY = process.env.GITHUB_TOKEN;
  process.env.OPENAI_BASE_URL = process.env.GITHUB_MODELS_ENDPOINT || 'https://models.inference.ai.azure.com';
  
  console.log('✓ Using GitHub Models for AI scorers (FREE!)');
  console.log(`  Endpoint: ${process.env.OPENAI_BASE_URL}`);
} else if (process.env.OPENAI_API_KEY) {
  console.log('✓ Using OpenAI for AI scorers');
} else {
  console.warn('⚠ No API key found - AI scorers will fail');
  console.warn('  Add GITHUB_TOKEN to .env to use GitHub Models (free)');
}

export default {
  // Evalite configuration
  // Add any custom config here
};
