/**
 * Examples for selectBestTool function testing
 *
 * This file provides examples of user inputs and expected outputs
 * for the selectBestTool function to help with testing and understanding.
 */

// Example 1: Weather query
const weatherExample = {
  input: '서울의 날씨가 어때요?',
  expectedOutput: {
    useTools: true,
    serverId: 'weather-service',
    toolName: 'getWeather',
    arguments: {
      location: '서울',
      units: 'celsius',
    },
  },
};

// Example 2: News query
const newsExample = {
  input: '오늘의 기술 뉴스를 5개만 요약해줘',
  expectedOutput: {
    useTools: true,
    serverId: 'news-service',
    toolName: 'getNewsSummary',
    arguments: {
      category: 'technology',
      count: 5,
    },
  },
};

// Example 3: Image generation request
const imageExample = {
  input: '산과 호수가 있는 풍경 이미지를 만들어줘',
  expectedOutput: {
    useTools: true,
    serverId: 'image-service',
    toolName: 'generateImage',
    arguments: {
      prompt: '산과 호수가 있는 풍경',
      style: 'realistic',
      size: '1024x1024',
    },
  },
};

// Example 4: Bug analysis in code
const codeExample = {
  input: '다음 코드에서 버그를 찾아줘: function sum(a, b) { return a - b; }',
  expectedOutput: {
    useTools: true,
    serverId: 'code-service',
    toolName: 'analyzeBugs',
    arguments: {
      code: 'function sum(a, b) { return a - b; }',
      language: 'javascript',
    },
  },
};

// Example 5: Setting a reminder
const reminderExample = {
  input: '오후 3시에 회의 참석하라고 알림 설정해줘',
  expectedOutput: {
    useTools: true,
    serverId: 'reminder-service',
    toolName: 'setReminder',
    arguments: {
      message: '회의 참석',
      time: '오후 3시',
    },
  },
};

// Example 6: Query that doesn't need tools
const noToolExample = {
  input: '안녕하세요, 오늘 기분이 어때요?',
  expectedOutput: {
    useTools: false,
  },
};

// Export all examples
export const examples = {
  weatherExample,
  newsExample,
  imageExample,
  codeExample,
  reminderExample,
  noToolExample,
};

/**
 * Expected format for responses from selectBestTool:
 *
 * For tool use:
 * {
 *   "useTools": true,
 *   "serverId": "service-id",
 *   "toolName": "toolName",
 *   "arguments": {
 *     // Arguments specific to the tool
 *   }
 * }
 *
 * For no tool use:
 * {
 *   "useTools": false
 * }
 */
