import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { z } from 'zod';
import cors from 'cors';

const app = express();
app.use(cors());
const server = new McpServer({
  name: 'test-sse-server',
  version: '1.0.0',
});

server.tool('echo', { message: z.string().describe('Message to echo') }, async ({ message }) => ({
  content: [
    {
      type: 'text',
      text: `Echo: ${message}`,
    },
  ],
}));

const transports = new Map<string, SSEServerTransport>();
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // SSE Transport
  const transport = new SSEServerTransport('/messages', res);
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);

  req.on('close', () => {
    transports.delete(sessionId);
    console.log('Client disconnected', sessionId);
  });

  server.connect(transport).catch(err => {
    console.error('Server error:', err);
    process.exit(1);
  });

  console.log('Client connected', sessionId);
});

app.post('/messages', (req, res) => {
  // get sessionid from query
  const sessionId = req.query.sessionId as string;
  const transport = transports.get(sessionId);
  if (!transport) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  transport.handlePostMessage(req, res).catch(err => {
    console.error('Server error:', err);
  });
});

app.listen(3001);
