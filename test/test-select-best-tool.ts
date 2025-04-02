import { MCPHost } from '../src/host.js';
import { examples } from './selectBestTool-examples.js';
import { validateConfig } from '../src/config.js';

// Define types for tool outputs
type ToolResponseWithTool = {
  useTools: true;
  serverId: string;
  toolName: string;
  arguments: Record<string, any>;
};

type ToolResponseNoTool = {
  useTools: false;
};

type ToolResponse = ToolResponseWithTool | ToolResponseNoTool;

// Type guard to check if the response contains a tool
function hasTool(response: any): response is ToolResponseWithTool {
  return response && response.useTools === true;
}

// Mock user inputs
const mockUserInputs = [
  '날씨가 어때요?',
  '오늘의 뉴스를 요약해줘',
  '이미지를 생성해줘',
  '이 코드의 버그를 찾아줘',
  '30분 후에 알람 설정해줘',
];

// Mock available tools
const mockAvailableTools = [
  {
    serverId: 'weather-service',
    tool: {
      name: 'getWeather',
      description: '특정 위치의 현재 날씨 정보를 조회합니다',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: '날씨를 조회할 위치 (도시 이름)',
          },
          units: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: '온도 단위',
          },
        },
        required: ['location'],
      },
    },
  },
  {
    serverId: 'news-service',
    tool: {
      name: 'getNewsSummary',
      description: '오늘의 주요 뉴스 헤드라인과 요약을 제공합니다',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['general', 'business', 'technology', 'sports', 'entertainment'],
            description: '뉴스 카테고리',
          },
          count: {
            type: 'number',
            description: '요약할 뉴스 항목 수',
          },
        },
        required: [],
      },
    },
  },
  {
    serverId: 'image-service',
    tool: {
      name: 'generateImage',
      description: '텍스트 프롬프트를 기반으로 이미지를 생성합니다',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: '이미지 생성을 위한 텍스트 설명',
          },
          style: {
            type: 'string',
            enum: ['realistic', 'cartoon', 'artistic', 'abstract'],
            description: '이미지 스타일',
          },
          size: {
            type: 'string',
            enum: ['256x256', '512x512', '1024x1024'],
            description: '이미지 크기',
          },
        },
        required: ['prompt'],
      },
    },
  },
  {
    serverId: 'code-service',
    tool: {
      name: 'analyzeBugs',
      description: '코드에서 잠재적인 버그나 문제를 분석합니다',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: '분석할 코드',
          },
          language: {
            type: 'string',
            enum: ['javascript', 'typescript', 'python', 'java'],
            description: '프로그래밍 언어',
          },
        },
        required: ['code'],
      },
    },
  },
  {
    serverId: 'reminder-service',
    tool: {
      name: 'setReminder',
      description: '특정 시간에 알림을 설정합니다',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '알림 메시지',
          },
          time: {
            type: 'string',
            description: '알림 시간 (ISO 형식 또는 자연어)',
          },
        },
        required: ['message', 'time'],
      },
    },
  },
];

/**
 * 테스트 방법:
 * 1. ANTHROPIC_API_KEY 환경변수를 설정하거나 아래 코드에서 직접 API 키를 입력하세요
 * 2. 아래 명령어로 테스트를 실행하세요:
 *    npx tsx src/test-select-best-tool.ts
 */

// 기본 테스트: 모든 예제 테스트
async function testWithExamples() {
  try {
    // Make sure we have valid config
    validateConfig();
    const host = new MCPHost();
    console.log('=== Testing selectBestTool with example cases ===\n');

    for (const [name, example] of Object.entries(examples)) {
      console.log(`Testing example: ${name}`);
      console.log(`User Input: "${example.input}"`);
      console.log(`Expected Output: ${JSON.stringify(example.expectedOutput, null, 2)}`);

      try {
        const result = (await host.selectBestTool(
          example.input,
          mockAvailableTools
        )) as ToolResponse;

        console.log(`Actual Output: ${JSON.stringify(result, null, 2)}`);
        // 결과 비교 (간단한 비교, 실제로는 더 정교한 비교가 필요할 수 있음)
        const expected = example.expectedOutput;

        if (hasTool(expected) && hasTool(result)) {
          // Both are tool responses
          if (expected.serverId === result.serverId) {
            console.log('✅ TEST PASSED');
          } else {
            console.log('❌ TEST FAILED: Server ID mismatch');
          }
        } else if (!hasTool(expected) && !hasTool(result)) {
          // Both are no-tool responses
          console.log('✅ TEST PASSED (No tool needed)');
        } else {
          console.log('❌ TEST FAILED: Tool usage mismatch');
        }
      } catch (error) {
        console.error('Error:', (error as Error).message);
        console.log('❌ TEST FAILED: Error during execution');
      }
      console.log('-------------------------------------------\n');
    }
  } catch (error) {
    console.error('Configuration error:', (error as Error).message);
    process.exit(1);
  }
}

// 메인 함수
async function main() {
  try {
    // Validate configuration
    validateConfig();
    console.log('✅ Environment variables loaded successfully');
    await testWithExamples();
  } catch (error) {
    console.error('⚠️  Configuration Error:', (error as Error).message);
    console.log('\nPlease set up your .env file with the required variables:');
    console.log('1. Create a .env file in the project root or copy from .env.example');
    console.log('2. Add your ANTHROPIC_API_KEY to the .env file');
    console.log('3. Run the tests again');
    return;
  }
}

// 실행
main().catch(console.error);
