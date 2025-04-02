import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'mcp-time-server',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const getCurrentTime = () => {
  const now = new Date();
  return {
    iso: now.toISOString(),
    formatted: now.toLocaleString(),
    unix: Math.floor(now.getTime() / 1000),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  };
};

// Listing tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_current_time',
        description: '현재 시간 및 날짜를 제공합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            timezone: {
              type: 'string',
              description: '시간대 (예: "Asia/Seoul")',
            },
          },
          required: ['timezone'],
        },
      },
    ],
  };
});

// Call tool
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;
  if (name === 'get_current_time') {
    const timeData = getCurrentTime();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(timeData, null, 2),
        },
      ],
      isError: false,
    };
  }
  return {
    content: [{ type: 'text', text: `알 수 없는 도구입니다: ${name}` }],
    isError: true,
  };
});

async function main() {
  console.log('Time Server starting...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Time Server started');
}

main().catch(error => {
  console.error('Time Server failed to start:', error);
  process.exit(1);
});
