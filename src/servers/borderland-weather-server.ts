import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'borderland-weather-server',
  version: '0.0.1',
});

registerTools(server);
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error('Error when starting server', String(error));
    process.exit(1);
  }
}

startServer();

function registerTools(server: McpServer) {
  server.tool(
    'get-borderland-weather',
    '보더랜드 지역의 날씨를 가져옵니다.',
    {
      city: z.string().describe('날씨 정보를 조회할 도시 이름'),
    },
    async ({ city }) => {
      try {
        const weatherData = getWeather(city);
        if (!weatherData) {
          return {
            content: [
              {
                type: 'text',
                text: '도시를 찾을 수 없습니다.',
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `${city}의 날씨 정보:\n온도: ${weatherData.temperature}°C\n상태: ${weatherData.condition}\n습도: ${weatherData.humidity}%`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [],
          isError: true,
        };
      }
    }
  );
}

function getWeather(city: string) {
  const cities = {
    Sanctuary: {
      temperature: 22,
      condition: '맑음',
      humidity: 40,
    },
    Opportunity: {
      temperature: 28,
      condition: '맑음',
      humidity: 30,
    },
    Lynchwood: {
      temperature: 35,
      condition: '모래폭풍',
      humidity: 20,
    },
    'Three Horns Valley': {
      temperature: 15,
      condition: '흐림',
      humidity: 50,
    },
    'Frostburn Canyon': {
      temperature: -5,
      condition: '눈보라',
      humidity: 80,
    },
    'The Dust': {
      temperature: 40,
      condition: '모래폭풍',
      humidity: 15,
    },
    'Tundra Express': {
      temperature: 0,
      condition: '눈',
      humidity: 70,
    },
    'Caustic Caverns': {
      temperature: 25,
      condition: '독안개',
      humidity: 90,
    },
    'Eridium Blight': {
      temperature: 30,
      condition: '흐림',
      humidity: 35,
    },
    'Sawtooth Cauldron': {
      temperature: 33,
      condition: '연기',
      humidity: 45,
    },
    'Thousand Cuts': {
      temperature: 27,
      condition: '맑음',
      humidity: 25,
    },
    'The Highlands': {
      temperature: 20,
      condition: '비',
      humidity: 65,
    },
    'Fink’s Slaughterhouse': {
      temperature: 29,
      condition: '흐림',
      humidity: 50,
    },
    'Southern Shelf': {
      temperature: -10,
      condition: '눈보라',
      humidity: 85,
    },
    'Windshear Waste': {
      temperature: -15,
      condition: '눈보라',
      humidity: 90,
    },
  } as Record<
    string,
    {
      temperature: number;
      condition: string;
      humidity: number;
    }
  >;

  return cities[city] || null;
}
