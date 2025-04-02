import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuration settings loaded from environment variables
 */
export const config = {
  models: {
    /**
     * Anthropic model
     */
    anthropic: {
      sonnet: 'claude-3-5-sonnet-20241022',
      haiku: 'claude-3-5-haiku-20241022',
    },
  },
  /**
   * API Keys
   */
  apiKeys: {
    /**
     * Anthropic API Key for Claude models
     */
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  /**
   * Application environment
   */
  environment: {
    /**
     * Node environment (development, production, test)
     */
    nodeEnv: process.env.NODE_ENV || 'development',

    /**
     * Flag indicating if we're in development mode
     */
    isDev: process.env.NODE_ENV !== 'production',
  },
};

/**
 * Validates that all required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateConfig() {
  const { anthropicApiKey } = config.apiKeys;

  if (!anthropicApiKey) {
    throw new Error(
      'Missing required environment variable: ANTHROPIC_API_KEY. ' +
        'Please set this in your .env file or as an environment variable.'
    );
  }

  return true;
}
