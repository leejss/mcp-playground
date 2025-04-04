import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'Calculator',
  version: '1.0.0',
});

// JSON RPC message interactions
server.tool(
  'calculate',
  '숫자 a와 b를 연산하여 결과를 반환',
  {
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    a: z.number(),
    b: z.number(),
  },
  async args => {
    let result;
    const { a, b, operation } = args;

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
          text: result.toString(),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
async function main() {
  try {
    await server.connect(transport);
  } catch (error) {
    process.exit(1);
  }
}

main();

// const toolsListRequest = {
//   jsonrpc: '2.0',
//   id: 1,
//   method: 'tools/list',
// };

// const toolsListResponse = {
//   jsonrpc: '2.0',
//   id: 1,
//   result: {
//     tools: [
//       {
//         name: 'calculate',
//         description: '숫자 a와 b를 연산하여 결과를 반환',
//         inputSchema: {
//           type: 'object',
//           properties: {
//             operation: {
//               type: 'string',
//               enum: ['add', 'subtract', 'multiply', 'divide'],
//             },
//             a: {
//               type: 'number',
//             },
//             b: {
//               type: 'number',
//             },
//           },
//           required: ['operation', 'a', 'b'],
//         },
//       },
//     ],
//   },
// };

// // Call Tool

// const callToolRequest = {
//   jsonrpc: '2.0',
//   id: 2,
//   method: 'tools/call',
//   params: {
//     name: 'calculate',
//     arguments: {
//       operation: 'add',
//       a: 1,
//       b: 2,
//     },
//   },
// };

// const callToolResponse = {
//   jsonrpc: '2.0',
//   id: 2,
//   result: {
//     content: [
//       {
//         type: 'text',
//         text: '3',
//       },
//     ],
//     isError: false,
//   },
// };
