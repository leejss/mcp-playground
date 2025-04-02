import { config } from '../src/config.js';
import { MCPHost } from '../src/host.js';

async function runTest() {
  console.log('LlmProcessor 테스트 시작...');

  // LLM 프로세서 초기화
  const processor = new MCPHost(config.apiKeys.anthropicApiKey);

  try {
    // 테스트 서버에 연결
    console.log('테스트 서버에 연결 중...');
    await processor.connectMcpServer({
      serverId: 'test-server',
      command: 'node',
      args: ['./build/src/servers/time-server.js'],
    });

    console.log('테스트 서버 연결 성공!');

    // 테스트 쿼리 목록
    const testQueries = [
      // '서울의 현재 날씨는 어때?',
      // '23과 45를 더하면 얼마야?',
      '지금 현재 시간이 몇 시야?',
      // '에베레스트 산의 높이는 얼마야?', // 도구가 필요하지 않은 질문
    ];

    // 각 쿼리 테스트
    for (const query of testQueries) {
      console.log('\n----------------------------------------');
      console.log(`사용자 쿼리: "${query}"`);
      console.log('----------------------------------------');

      try {
        const response = await processor.processUserInput(query);
        console.log('응답:', response);
      } catch (error) {
        console.error(`쿼리 처리 중 오류 발생: ${(error as Error).message}`);
      }
    }

    console.log('\n테스트 완료!');
  } catch (error) {
    console.error('테스트 실패:', (error as Error).message);
  } finally {
    process.exit(0);
  }
}

runTest();
