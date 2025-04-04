import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({
  name: 'Calculator',
  version: '1.0.0',
});

// tools/list response
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: '숫자 a와 b를 연산하여 결과를 반환',
        inputSchema: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['add', 'subtract', 'multiply', 'divide'],
            },
            a: {
              type: 'number',
            },
            b: {
              type: 'number',
            },
          },
          required: ['operation', 'a', 'b'],
        },
      },
    ],
  };
});

// tools/call response
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  if (name === 'calculate') {
    const { operation, a, b } = args as { operation: string; a: number; b: number };
    let result;

    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        result = a / b;
        break;
    }

    return {
      content: [
        {
          type: 'text',
          text: result?.toString(),
        },
      ],
      isError: false,
    };
  }

  throw new Error('Unknown tool name');
});
