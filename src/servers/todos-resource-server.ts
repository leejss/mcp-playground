import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
  name: 'Todos Server',
  version: '1.0.0',
});

// resource name, resource uri, resource handler
server.resource('todos', 'todos://data', async uri => {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await res.json();
  return {
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(todos),
      },
    ],
  };
});

// Dynamic resource
server.resource(
  'todo',
  new ResourceTemplate('todo://{id}', { list: undefined }),
  async (uri, { id }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    const todo = await res.json();
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(todo),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

server.connect(transport).catch(err => {
  console.error('Server error:', err);
  process.exit(1);
});

console.error('Advanced MCP Server started and waiting for messages...');
