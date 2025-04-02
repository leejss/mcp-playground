import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Anthropic } from '@anthropic-ai/sdk';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { config } from './config.js';
import { safeParseJson } from './uitls.js';

export class MCPHost {
  private anthropic: Anthropic;
  private mcpClients = new Map<string, Client>();
  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || config.apiKeys.anthropicApiKey,
    });
  }

  async connectMcpServer({
    args = [],
    command,
    serverId,
  }: {
    serverId: string;
    command: string;
    args: string[];
  }) {
    console.log('MCP Host: Connecting to MCP server', serverId);

    const transport = new StdioClientTransport({
      command,
      args,
    });

    const client = new Client({
      name: 'llm-assistant-host',
      version: '0.0.1',
    });

    try {
      await client.connect(transport);
      this.mcpClients.set(serverId, client);
      console.log('MCP Host: Connected to MCP server', serverId);
    } catch (error) {
      console.error('MCP Host: Failed to connect to MCP server', serverId, error);
      throw error;
    }
  }

  async processUserInput(userInput: string) {
    console.log('MCP Host: Processing user input', userInput);

    // Load available tools
    const availableTools = await this.collectAvailableTools();

    // And select the best tool
    const toolSelection = await this.selectBestTool(userInput, availableTools);

    if (toolSelection) {
      const { serverId, toolName, args } = toolSelection;
      return await this.callMcpTool(serverId, toolName, args);
    }
    return await this.getDirectResponse(userInput);
  }

  async collectAvailableTools() {
    const allTools: {
      serverId: string;
      tool: any;
    }[] = [];

    for (const [serverId, client] of this.mcpClients.entries()) {
      try {
        const { tools } = await client.listTools();
        for (const tool of tools) {
          allTools.push({
            serverId,
            tool,
          });
        }
      } catch (error) {
        console.error('MCP Host: Failed to list tools for server', serverId, error);
      }
    }
    return allTools;
  }

  async selectBestTool(
    userInput: string,
    availableTools: {
      serverId: string;
      tool: any;
    }[]
  ) {
    if (availableTools.length === 0) {
      return null;
    }

    const toolsForLlm = availableTools.map(({ serverId, tool }) => ({
      name: `${serverId}.${tool.name}`,
      description: tool.description,
      parameters: tool.parameters,
    }));

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: `도구 목록을 확인하고, 이 요청을 처리하는 데 가장 적합한 도구를 선택하세요.
        도구를 사용해야 한다면 도구 이름과 필요한 매개변수를 JSON 형식으로 응답하고, 도구가 필요 없다면 "NO_TOOL_NEEDED"라고 응답하세요.

        반드시 응답은 JSON 형식 아니면 "NO_TOOL_NEEDED" 문자열 둘 중 하나만 가능합니다.

        사용 가능한 도구 목록:
${JSON.stringify(toolsForLlm, null, 2)}

응답 형식:
{
  "useTools": true 또는 false,
  "serverId": "선택한 서버 ID" (도구를 사용할 경우에만),
  "toolName": "선택한 도구 이름" (도구를 사용할 경우에만),
  "arguments": {
    // 도구에 필요한 인자들
  }
}`,
        messages: [
          {
            role: 'user',
            content: `사용자가 다음과 같이 요청했습니다: "${userInput}"`,
          },
        ],
        temperature: 0.2,
      });
      const content = response.content[0];
      console.log('MCP Host: Response', response);

      // validate response
      if (content.type !== 'text') {
        throw new Error('Invalid response format', { cause: content });
      }

      if (content.type === 'text') {
        return safeParseJson(content.text);
      }

      throw new Error('Invalid response format', { cause: content });
    } catch (error) {
      console.error('MCP Host: Failed to select best tool', error);
      throw error;
    }
  }

  async callMcpTool(serverId: string, toolName: string, args: any) {
    console.log(`MCP Host: Calling tool ${serverId}.${toolName}`, args);
    try {
      const client = this.mcpClients.get(serverId);
      if (!client) {
        throw new Error(`No client found for server ID: ${serverId}`);
      }
      const result = await client.callTool({
        name: toolName,
        arguments: args,
      });
      console.log(`MCP Host: Tool ${serverId}.${toolName} result:`, result);
      return result;
    } catch (error) {
      console.error(`MCP Host: Failed to call tool ${serverId}.${toolName}`, error);
      throw error;
    }
  }

  async getDirectResponse(userInput: string) {
    console.log('MCP Host: Getting direct response for:', userInput);
    try {
      const response = await this.anthropic.messages.create({
        model: config.models.anthropic.sonnet,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: userInput,
          },
        ],
      });
      const content = response.content[0];
      if (content.type === 'text') {
        return { text: content.text };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('MCP Host: Failed to get direct response', error);
      throw error;
    }
  }
}
