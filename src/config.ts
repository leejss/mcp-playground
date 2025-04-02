import dotenv from 'dotenv';
dotenv.config();

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
