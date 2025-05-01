import { create } from 'zustand';
import { Message, ChatModel, ChatFolder, AIModel, Role } from './types';
import OpenAI from 'openai';
import { CONDENSED_INSTRUCTIONS } from './constants/defaultInstructions';

// Function to perform web search
async function performWebSearch(query: string, resultsLimit: number = 5, searchEngine: string = 'Google'): Promise<string> {
  console.log(`Performing web search for: "${query}" using ${searchEngine}, limit: ${resultsLimit}`);

  try {
    // In a real implementation, you would use a real search API
    // For now, we'll simulate search results based on the query
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Generate more realistic search results based on the query
    let results = [];

    // Check if the query is about weather
    if (query.toLowerCase().includes('weather') && query.toLowerCase().includes('iloilo')) {
      results = [
        {
          title: "Iloilo City, Philippines Weather - Weather.com",
          link: "https://www.weather.com/en-PH/weather/today/l/IloiloCity+Philippines",
          snippet: "Get the latest weather updates for Iloilo City with current temperatures, humidity, and forecasts. Today's weather is expected to be partly cloudy with a high of 31°C and a low of 25°C."
        },
        {
          title: "Iloilo Weather Forecast, Philippines | AccuWeather",
          link: "https://www.accuweather.com/en/ph/iloilo-city/262398/weather-forecast/262398",
          snippet: "Iloilo City weather forecast. Providing a local hourly Iloilo City weather forecast of rain, sun, wind, humidity and temperature. Current conditions with radar and satellite maps."
        },
        {
          title: "Weather in Iloilo City today - Meteoblue",
          link: "https://www.meteoblue.com/en/weather/week/iloilo-city_philippines_1711005",
          snippet: "Weather Iloilo City today, detailed forecast for today, tomorrow, the week, 10 days, and the month. Precipitation radar, HD satellite images, and current weather warnings."
        }
      ];
    } else if (query.toLowerCase().includes('news')) {
      results = [
        {
          title: "Latest News Headlines - CNN Philippines",
          link: "https://www.cnnphilippines.com/news/",
          snippet: "Stay updated with the latest news from the Philippines and around the world. Breaking news, headlines, analysis, and special reports on politics, business, technology, and more."
        },
        {
          title: "Philippine News Agency - Official News from the Philippines",
          link: "https://www.pna.gov.ph/",
          snippet: "The Philippine News Agency is a web-based newswire service of the Philippine government that provides the latest news and information on the Philippines."
        }
      ];
    } else {
      // Generic results for other queries
      results = [
        {
          title: `${searchEngine} result for "${query}" - Top Information Source`,
          link: `https://example.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Comprehensive information about ${query} including latest updates, facts, and detailed analysis from trusted sources.`
        },
        {
          title: `${query} - Wikipedia`,
          link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
          snippet: `${query} refers to... [Wikipedia provides a comprehensive overview with historical context, current information, and relevant details.]`
        },
        {
          title: `Everything You Need to Know About ${query} - Comprehensive Guide`,
          link: `https://guide.example.org/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
          snippet: `Our detailed guide covers all aspects of ${query}, including background information, current developments, and expert analysis.`
        }
      ];
    }

    // Format the results
    const formattedResults = results
      .slice(0, Math.min(resultsLimit, results.length))
      .map((result, index) => {
        return `${index + 1}. Title: ${result.title}\nURL: ${result.link}\nSnippet: ${result.snippet}`;
      })
      .join('\n\n');

    return `Search results for: "${query}" from ${searchEngine}:\n\n${formattedResults}`;
  } catch (error) {
    console.error('Error performing web search:', error);
    return `Unable to retrieve search results for "${query}" due to an error. Please try a different query.`;
  }
}

interface StoreState {
  conversations: Map<string, Message[]>;
  currentConversationId: string | null;
  isLoadingResponse: boolean;
  isSearchingWeb: boolean;
  hasApiKey: boolean;
  apiKey: string;
  folders: ChatFolder[];
  availableModels: AIModel[];
  currentModel: ChatModel;
  error: string | null;

  // Model configuration
  temperature: number;
  maxTokens: number;
  topP: number;
  storeLogs: boolean;
  enableWebSearch: boolean;
  enableStreaming: boolean;
  forceWebSearch: boolean;

  // Actions
  setApiKey: (key: string) => void;
  setHasApiKey: (has: boolean) => void;
  setCurrentModel: (model: ChatModel) => void;
  setTemperature: (value: number) => void;
  setMaxTokens: (value: number) => void;
  setTopP: (value: number) => void;
  setStoreLogs: (value: boolean) => void;
  setEnableWebSearch: (value: boolean) => void;
  setEnableStreaming: (value: boolean) => void;
  setForceWebSearch: (value: boolean) => void;
  toggleForceWebSearch: () => void;
  resetModelConfig: () => void;
  startNewConversation: () => string;
  sendMessage: (content: string) => Promise<void>;
  setCurrentConversation: (id: string) => void;
  clearConversations: () => void;
  deleteConversation: (id: string) => void;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  moveConversationToFolder: (conversationId: string, folderId: string) => void;
  clearError: () => void;
}

// Initialize model configuration from localStorage
const getInitialTemperature = () => {
  const saved = localStorage.getItem('temperature');
  return saved ? parseFloat(saved) : 1.0;
};

const getInitialMaxTokens = () => {
  const saved = localStorage.getItem('max_tokens');
  return saved ? parseInt(saved) : 2048;
};

const getInitialTopP = () => {
  const saved = localStorage.getItem('top_p');
  return saved ? parseFloat(saved) : 1.0;
};

const getInitialStoreLogs = () => {
  const saved = localStorage.getItem('store_logs');
  return saved ? saved === 'true' : false;
};

const getInitialWebSearch = () => {
  const saved = localStorage.getItem('enable_web_search');
  return saved ? saved === 'true' : true;
};

const getInitialStreaming = () => {
  const saved = localStorage.getItem('enable_streaming');
  return saved ? saved === 'true' : true;
};

const getInitialForceWebSearch = () => {
  const saved = localStorage.getItem('force_web_search');
  return saved ? saved === 'true' : false;
};

export const useStore = create<StoreState>((set, get) => ({
  conversations: new Map(),
  currentConversationId: null,
  isLoadingResponse: false,
  isSearchingWeb: false,
  hasApiKey: false,
  apiKey: '',
  folders: [],
  error: null,
  // Model configuration
  temperature: getInitialTemperature(),
  maxTokens: getInitialMaxTokens(),
  topP: getInitialTopP(),
  storeLogs: getInitialStoreLogs(),
  enableWebSearch: getInitialWebSearch(),
  enableStreaming: getInitialStreaming(),
  forceWebSearch: getInitialForceWebSearch(),
  availableModels: [
    {
      id: 'gpt-4.1-nano-2025-04-14',
      name: 'GPT-4.1 Nano {dev}',
      provider: 'openai',
      description: 'Latest 4.1 nano dev Update'
    },
    {
      id: 'gpt-4.1-mini-2025-04-14',
      name: 'GPT-4.1 mini {dev}',
      provider: 'openai',
      description: 'Latest 4.1 mini dev Update'
    },
    {
      id: 'gpt-4.1-2025-04-14',
      name: 'GPT-4.1 {dev}',
      provider: 'openai',
      description: 'Latest 4.1 dev Update'
    },
    {
      id: 'gpt-4.1',
      name: 'GPT-4.1',
      provider: 'openai',
      description: 'Most capable model for complex tasks'
    },
    {
      id: 'gpt-4.1-mini',
      name: 'GPT-4.1 Mini',
      provider: 'openai',
      description: 'Balanced speed and intelligence'
    },
    {
      id: 'gpt-4.1-nano',
      name: 'GPT-4.1 Nano',
      provider: 'openai',
      description: 'Fast, efficient for simpler tasks'
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      description: 'Legacy GPT-4 model'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      description: 'Fast and efficient for most tasks'
    }
  ],
  currentModel: 'gpt-4.1',

  setApiKey: (key) => {
    if (!key.startsWith('sk-')) {
      set({ error: 'Invalid API key format. Key should start with "sk-"' });
      return;
    }
    localStorage.setItem('api_key', key);
    set({ apiKey: key, hasApiKey: true, error: null });
  },

  setHasApiKey: (has) => set({ hasApiKey: has }),

  setCurrentModel: (model) => {
    set({ currentModel: model });
    localStorage.setItem('current_model', model);
  },

  startNewConversation: () => {
    const id = Date.now().toString();
    const updatedConversations = new Map(get().conversations);
    updatedConversations.set(id, []);

    set({
      conversations: updatedConversations,
      currentConversationId: id,
      error: null
    });

    return id;
  },

  sendMessage: async (content) => {
    const {
      currentConversationId,
      conversations,
      apiKey,
      currentModel,
      temperature,
      maxTokens,
      topP,
      storeLogs,
      enableWebSearch,
      enableStreaming,
      forceWebSearch
    } = get();

    // Check for API key
    if (!apiKey) {
      set({ error: 'Please enter your OpenAI API key in settings to continue.' });
      return;
    }

    // Ensure we have a conversation
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = get().startNewConversation();
    }

    // Add user message
    const conversationMessages = conversations.get(conversationId) || [];
    const updatedMessages = [
      ...conversationMessages,
      { id: Date.now().toString(), role: 'user' as Role, content }
    ];

    const updatedConversations = new Map(conversations);
    updatedConversations.set(conversationId, updatedMessages);

    set({
      conversations: updatedConversations,
      isLoadingResponse: true,
      isSearchingWeb: false,
      error: null
    });

    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      // Prepare messages for the API request
      const apiMessages = [];

      // Only add system message if this is the first message in the conversation
      if (conversationMessages.length === 0) {
        apiMessages.push({
          role: 'system',
          content: CONDENSED_INSTRUCTIONS
        });
      }

      // Add all conversation messages
      apiMessages.push(
        ...updatedMessages.map(({ role, content }) => ({
          role: role as any,
          content
        }))
      );

      // Determine if we should use web search
      const contentLower = content.toLowerCase();
      const shouldUseWebSearch = forceWebSearch || (enableWebSearch && (
        contentLower.includes('search') ||
        contentLower.includes('find information') ||
        contentLower.includes('who is') ||
        contentLower.includes('what is') ||
        contentLower.includes('look up') ||
        contentLower.includes('online') ||
        contentLower.includes('weather') ||
        contentLower.includes('news') ||
        contentLower.includes('latest') ||
        contentLower.includes('current') ||
        contentLower.includes('update on') ||
        contentLower.includes('how to') ||
        contentLower.includes('take a look') ||
        contentLower.includes('check') ||
        contentLower.includes('iloilo') ||
        contentLower.includes('city') ||
        contentLower.includes('today') ||
        /when\s+is|where\s+is|why\s+is|which\s+is|how\s+many|how\s+much/i.test(content)
      ));

      // Force web search for weather-related queries
      const isWeatherQuery =
        contentLower.includes('weather') ||
        (contentLower.includes('iloilo') && contentLower.includes('city'));

      // If web search is enabled, we'll let the model decide when to use it via function calling
      if (shouldUseWebSearch || isWeatherQuery) {
        console.log('Web search enabled for this query');
        set({ isSearchingWeb: true });
      }

      let aiMessageContent = '';
      let streamingMessageId = '';

      try {
        if (enableStreaming) {
          // Create a unique ID for this streaming message
          streamingMessageId = (Date.now() + 1).toString();

          // Initialize an empty streaming message
          const initialStreamingMessage = {
            id: streamingMessageId,
            role: 'assistant' as Role,
            content: '',
            isStreaming: true
          };

          // Add the initial empty message to the conversation
          const initialStreamingMessages = [...updatedMessages, initialStreamingMessage];
          const initialStreamingConversations = new Map(updatedConversations);
          initialStreamingConversations.set(conversationId, initialStreamingMessages);

          set({
            conversations: initialStreamingConversations
          });

          // Define the web_search function according to the example
          const functions = [
            {
              type: "function",
              name: "web_search",
              description: "Performs a web search based on the provided query",
              parameters: {
                type: "object",
                required: ["query", "results_limit", "search_engine"],
                properties: {
                  query: {
                    type: "string",
                    description: "The search query."
                  },
                  results_limit: {
                    type: "number",
                    description: "The maximum number of search results to return."
                  },
                  search_engine: {
                    type: "string",
                    description: "The search engine to use for the web search.",
                    enum: ["Google", "Bing", "Yahoo"]
                  }
                },
                additionalProperties: false
              },
              strict: true
            }
          ];

          // Determine if we should force the web_search function
          let toolChoice: any = "none";
          if (shouldUseWebSearch) {
            toolChoice = "auto";
          }
          if (isWeatherQuery) {
            // Force the use of web_search for weather queries
            toolChoice = {
              type: "function",
              function: { name: "web_search" }
            };
          }

          console.log('Using tool_choice:', toolChoice);

          // Make the API request with streaming enabled and function calling
          const streamResponse = await openai.chat.completions.create({
            model: currentModel,
            messages: apiMessages as any,
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: topP,
            stream: true,
            tools: functions.map(func => ({
              type: "function",
              function: {
                name: func.name,
                description: func.description,
                parameters: func.parameters
              }
            })),
            tool_choice: toolChoice as any
          });

          // Variables to accumulate tool call data
          let toolCallId = '';
          let toolCallName = '';
          let toolCallArgs = '';
          let isCollectingToolCall = false;

          // Handle streaming response
          for await (const chunk of streamResponse) {
            console.log('Streaming chunk:', JSON.stringify(chunk, null, 2));

            // Check if this chunk indicates a tool call is complete
            if (chunk.choices[0]?.finish_reason === "tool_calls") {
              console.log('Tool call complete detected from finish_reason');

              // If we have a partial tool call collected, process it
              if (isCollectingToolCall && toolCallName.includes('web_search')) {
                // We'll handle this below in the existing tool call processing code
                console.log('Processing collected tool call on completion signal');
              }
              // If we don't have a tool call collected yet, create a default one for web search
              else {
                console.log('Creating default web search tool call');
                isCollectingToolCall = true;
                toolCallId = 'call_' + Date.now().toString();
                toolCallName = 'web_search';

                // Extract query from the user message
                const userMessage = updatedMessages[updatedMessages.length - 1].content;
                const defaultQuery = userMessage.replace(/search|find|look up|information about|tell me about/gi, '').trim();

                toolCallArgs = JSON.stringify({
                  query: defaultQuery || "latest news",
                  results_limit: 3,
                  search_engine: "Google"
                });

                console.log('Created default tool call args:', toolCallArgs);
              }
            }

            // Check if this is a tool call delta
            if (chunk.choices[0]?.delta?.tool_calls) {
              const toolCallDelta = chunk.choices[0]?.delta?.tool_calls[0];
              console.log('Tool call delta:', toolCallDelta);

              // If this is the start of a tool call, initialize collection
              if (toolCallDelta.index === 0) {
                isCollectingToolCall = true;
                toolCallId = toolCallDelta.id || '';
                toolCallName = toolCallDelta.function?.name || '';
                toolCallArgs = toolCallDelta.function?.arguments || '';
                console.log('Started collecting tool call:', toolCallName, 'ID:', toolCallId);
              } else if (isCollectingToolCall) {
                // Continue accumulating arguments
                if (toolCallDelta.function?.arguments) {
                  toolCallArgs += toolCallDelta.function.arguments;
                  console.log('Accumulating args:', toolCallArgs);
                }
                // If we get an ID in a later chunk, capture it
                if (toolCallDelta.id && !toolCallId) {
                  toolCallId = toolCallDelta.id;
                  console.log('Updated tool call ID:', toolCallId);
                }
                // If we get a name in a later chunk, capture it
                if (toolCallDelta.function?.name && !toolCallName) {
                  toolCallName = toolCallDelta.function.name;
                  console.log('Updated tool call name:', toolCallName);
                }
              }

              // Check if we have complete arguments for web_search
              // We consider arguments complete if:
              // 1. They contain a closing brace
              // 2. We've accumulated a substantial amount of text
              // 3. We received a finish_reason of "tool_calls"
              if (isCollectingToolCall &&
                  (toolCallName === 'web_search' || toolCallName.includes('web_search')) &&
                  (toolCallArgs.includes('}') || toolCallArgs.length > 20 || chunk.choices[0]?.finish_reason === "tool_calls")) {
                try {
                  console.log('Complete tool call detected:', toolCallName, toolCallArgs);

                  // Clean up the JSON string if needed
                  let cleanArgs = toolCallArgs;
                  if (toolCallArgs.includes('{') && toolCallArgs.includes('}')) {
                    cleanArgs = toolCallArgs.substring(
                      toolCallArgs.indexOf('{'),
                      toolCallArgs.lastIndexOf('}') + 1
                    );
                  }

                  // Try to parse the arguments, with fallback for malformed JSON
                  let args;
                  try {
                    args = JSON.parse(cleanArgs);
                  } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    // Try to extract query using regex as fallback
                    const queryMatch = toolCallArgs.match(/"query":\s*"([^"]+)"/);
                    const query = queryMatch ? queryMatch[1] : 'weather in Iloilo City';
                    args = {
                      query: query,
                      results_limit: 3,
                      search_engine: 'Google'
                    };
                  }

                  console.log('Parsed args:', args);

                  // Set searching state
                  set({ isSearchingWeb: true });

                  // Show a temporary message that we're searching
                  const searchingMessage = {
                    id: streamingMessageId,
                    role: 'assistant' as Role,
                    content: `Searching the web for information about "${args.query}"...`,
                    isStreaming: true
                  };

                  const searchingMessages = [...updatedMessages, searchingMessage];
                  const searchingConversations = new Map(updatedConversations);
                  searchingConversations.set(conversationId, searchingMessages);

                  set({
                    conversations: searchingConversations
                  });

                  // Perform the web search
                  console.log('Performing web search for:', args.query);
                  const searchResults = await performWebSearch(
                    args.query,
                    args.results_limit || 3,
                    args.search_engine || 'Google'
                  );
                  console.log('Search results:', searchResults);

                  // Add the search results to the conversation
                  apiMessages.push({
                    role: 'tool' as any,
                    tool_call_id: toolCallId,
                    content: searchResults
                  });

                  // First, show the function call in the UI
                  const functionCallMessage = {
                    id: Date.now().toString() + '-function-call',
                    role: 'function' as Role,
                    content: '',
                    functionName: 'web_search',
                    functionArgs: JSON.stringify(args, null, 2),
                    isStreaming: false
                  };

                  // Then, show the search results in the UI
                  const searchResultMessage = {
                    id: Date.now().toString() + '-search',
                    role: 'function_result' as Role,
                    content: searchResults,
                    isSearchResult: true,
                    isStreaming: false
                  };

                  // Add both messages to the conversation
                  const messagesWithSearchResults = [...updatedMessages, functionCallMessage, searchResultMessage];
                  const conversationsWithSearchResults = new Map(updatedConversations);
                  conversationsWithSearchResults.set(conversationId, messagesWithSearchResults);

                  set({
                    conversations: conversationsWithSearchResults
                  });

                  // Continue the conversation with the search results
                  console.log('Continuing conversation with search results');
                  const continuationResponse = await openai.chat.completions.create({
                    model: currentModel,
                    messages: apiMessages as any,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    top_p: topP,
                    stream: true
                  });

                  // Reset content for the continuation
                  aiMessageContent = '';

                  // Create a new message for the AI's response to the search results
                  const responseMessageId = Date.now().toString() + '-response';
                  const initialResponseMessage = {
                    id: responseMessageId,
                    role: 'assistant' as Role,
                    content: 'Analyzing search results...',
                    isStreaming: true
                  };

                  // Add the initial empty response message
                  const messagesWithEmptyResponse = [...messagesWithSearchResults, initialResponseMessage];
                  const conversationsWithEmptyResponse = new Map(conversationsWithSearchResults);
                  conversationsWithEmptyResponse.set(conversationId, messagesWithEmptyResponse);

                  set({
                    conversations: conversationsWithEmptyResponse
                  });

                  console.log('Added initial response message:', initialResponseMessage);

                  // Process the continuation response
                  for await (const continuationChunk of continuationResponse) {
                    console.log('Continuation chunk:', JSON.stringify(continuationChunk, null, 2));
                    const content = continuationChunk.choices[0]?.delta?.content || '';
                    aiMessageContent += content;

                    // Get the current conversation
                    const currentConversation = get().conversations.get(conversationId) || [];

                    // Find the response message (it should be the last one)
                    const updatedResponseMessage = {
                      id: responseMessageId,
                      role: 'assistant' as Role,
                      content: aiMessageContent || 'Processing search results...',
                      isStreaming: true
                    };

                    console.log('Updating response message with content:', aiMessageContent);

                    // Find the index of the response message (should be the last one)
                    const responseMessageIndex = currentConversation.findIndex(msg => msg.id === responseMessageId);

                    if (responseMessageIndex !== -1) {
                      // Create a new array with the updated response message
                      const updatedMessages = [...currentConversation];
                      updatedMessages[responseMessageIndex] = updatedResponseMessage;

                      // Update the conversation
                      const updatedStreamingConversations = new Map(get().conversations);
                      updatedStreamingConversations.set(conversationId, updatedMessages);

                      set({
                        conversations: updatedStreamingConversations
                      });
                    } else {
                      console.error('Response message not found in conversation');

                      // Fallback: Create a new array with all messages except the last one
                      const allButLastMessage = currentConversation.slice(0, -1);

                      // Update the conversation with the updated response message
                      const updatedStreamingMessages = [...allButLastMessage, updatedResponseMessage];
                      const updatedStreamingConversations = new Map(conversationsWithSearchResults);
                      updatedStreamingConversations.set(conversationId, updatedStreamingMessages);

                      set({
                        conversations: updatedStreamingConversations
                      });
                    }



                    // No delay for snappy typing effect
                    // await new Promise(resolve => setTimeout(resolve, 2));
                  }

                  // Set searching state to false
                  set({ isSearchingWeb: false });

                  // Break out of the original streaming loop
                  break;
                } catch (error) {
                  console.error('Error handling web search function call:', error);
                  // Add error message to conversation
                  aiMessageContent = 'I encountered an error while searching the web. Please try again or rephrase your question.';
                  isCollectingToolCall = false;
                }
              }

              // Skip to next chunk if we're still collecting tool call data
              if (isCollectingToolCall) {
                continue;
              }
            }

            // Handle normal content chunks
            const content = chunk.choices[0]?.delta?.content || '';
            aiMessageContent += content;

            // Update the message content immediately
            const currentConversation = get().conversations.get(conversationId) || [];
            const currentMessage = currentConversation[currentConversation.length - 1];

            // Create updated message with the latest content
            const updatedStreamingMessage = {
              ...currentMessage,
              content: aiMessageContent
            };

            // Update the conversation with the latest content
            const updatedStreamingMessages = [...updatedMessages, updatedStreamingMessage];
            const updatedStreamingConversations = new Map(updatedConversations);
            updatedStreamingConversations.set(conversationId, updatedStreamingMessages);

            set({
              conversations: updatedStreamingConversations
            });

            // No delay for snappy typing effect
            // await new Promise(resolve => setTimeout(resolve, 2));
          } // End of for await loop
        } // End of if (enableStreaming)
        else {
          // Define the web_search function (same as in streaming case)
          const functions = [
            {
              type: "function",
              name: "web_search",
              description: "Performs a web search based on the provided query",
              parameters: {
                type: "object",
                required: ["query", "results_limit", "search_engine"],
                properties: {
                  query: {
                    type: "string",
                    description: "The search query."
                  },
                  results_limit: {
                    type: "number",
                    description: "The maximum number of search results to return."
                  },
                  search_engine: {
                    type: "string",
                    description: "The search engine to use for the web search.",
                    enum: ["Google", "Bing", "Yahoo"]
                  }
                },
                additionalProperties: false
              },
              strict: true
            }
          ];

          // Determine if we should force the web_search function (same as streaming case)
          let toolChoice: any = "none";
          if (shouldUseWebSearch) {
            toolChoice = "auto";
          }
          if (isWeatherQuery) {
            // Force the use of web_search for weather queries
            toolChoice = {
              type: "function",
              function: { name: "web_search" }
            };
          }

          console.log('Using tool_choice (non-streaming):', toolChoice);

          // Make the API request without streaming but with function calling
          const response = await openai.chat.completions.create({
            model: currentModel,
            messages: apiMessages as any,
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: topP,
            stream: false,
            tools: functions.map(func => ({
              type: "function",
              function: {
                name: func.name,
                description: func.description,
                parameters: func.parameters
              }
            })),
            tool_choice: toolChoice as any
          });

          // Handle non-streaming response
          const responseMessage = response.choices[0].message;
          console.log('Non-streaming response:', JSON.stringify(responseMessage, null, 2));

          // Check if the response includes a tool call
          if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            const toolCall = responseMessage.tool_calls[0];
            console.log('Tool call detected:', toolCall);

            // If this is a web_search function call
            if (toolCall.function.name === 'web_search' || toolCall.function.name.includes('web_search')) {
              try {
                // Try to parse the arguments, with fallback for malformed JSON
                let args;
                try {
                  args = JSON.parse(toolCall.function.arguments);
                } catch (parseError) {
                  console.error('Error parsing JSON:', parseError);
                  // Try to extract query using regex as fallback
                  const queryMatch = toolCall.function.arguments.match(/"query":\s*"([^"]+)"/);
                  const query = queryMatch ? queryMatch[1] : 'weather in Iloilo City';
                  args = {
                    query: query,
                    results_limit: 3,
                    search_engine: 'Google'
                  };
                }
                console.log('Parsed args:', args);

                // Set searching state
                set({ isSearchingWeb: true });

                // Show a temporary message that we're searching
                const searchingMessage = {
                  id: (Date.now() + 1).toString(),
                  role: 'assistant' as Role,
                  content: `Searching the web for information about "${args.query}"...`,
                  isStreaming: false
                };

                const searchingMessages = [...updatedMessages, searchingMessage];
                const searchingConversations = new Map(updatedConversations);
                searchingConversations.set(conversationId, searchingMessages);

                set({
                  conversations: searchingConversations
                });

                // Perform the web search
                console.log('Performing web search for:', args.query);
                const searchResults = await performWebSearch(
                  args.query,
                  args.results_limit || 3,
                  args.search_engine || 'Google'
                );
                console.log('Search results:', searchResults);

                // Add the search results to the conversation
                apiMessages.push({
                  role: 'tool',
                  tool_call_id: toolCall.id,
                  content: searchResults
                });

                // First, show the function call in the UI
                const functionCallMessage = {
                  id: Date.now().toString() + '-function-call',
                  role: 'function' as Role,
                  content: '',
                  functionName: 'web_search',
                  functionArgs: JSON.stringify(args, null, 2),
                  isStreaming: false
                };

                // Then, show the search results in the UI
                const searchResultMessage = {
                  id: Date.now().toString() + '-search',
                  role: 'function_result' as Role,
                  content: searchResults,
                  isSearchResult: true,
                  isStreaming: false
                };

                // Add both messages to the conversation
                const messagesWithSearchResults = [...updatedMessages, functionCallMessage, searchResultMessage];
                const conversationsWithSearchResults = new Map(updatedConversations);
                conversationsWithSearchResults.set(conversationId, messagesWithSearchResults);

                set({
                  conversations: conversationsWithSearchResults
                });

                // Continue the conversation with the search results
                console.log('Continuing conversation with search results');
                const continuationResponse = await openai.chat.completions.create({
                  model: currentModel,
                  messages: apiMessages as any,
                  temperature: temperature,
                  max_tokens: maxTokens,
                  top_p: topP,
                  stream: false
                });

                // Get the final response
                aiMessageContent = continuationResponse.choices[0].message.content || 'No response generated.';
                console.log('Final response:', aiMessageContent);

                // Add the AI's response as a separate message
                const responseMessage = {
                  id: Date.now().toString() + '-ai-response',
                  role: 'assistant' as Role,
                  content: aiMessageContent,
                  isStreaming: false
                };

                // Add the AI response message to the conversation
                const messagesWithAIResponse = [...messagesWithSearchResults, responseMessage];
                const conversationsWithAIResponse = new Map(conversationsWithSearchResults);
                conversationsWithAIResponse.set(conversationId, messagesWithAIResponse);

                set({
                  conversations: conversationsWithAIResponse
                });

                // Set searching state to false
                set({ isSearchingWeb: false });
              } catch (error) {
                console.error('Error handling web search function call:', error);
                aiMessageContent = 'I encountered an error while searching the web. Please try again or rephrase your question.';
              }
            } else {
              console.log('Unknown tool call:', toolCall.function.name);
              aiMessageContent = 'I attempted to use a tool but encountered an issue. Please try again.';
            }
          } else {
            // Normal response without tool calls
            console.log('Normal response without tool calls');
            aiMessageContent = responseMessage.content || 'No response generated.';
          }
        }
      } catch (streamError) {
        console.error('Error during streaming:', streamError);
        aiMessageContent = 'An error occurred while generating the response.';
      }

      // Get the current conversation
      const currentConversation = get().conversations.get(conversationId) || [];

      // Check if we already have search results and AI response messages
      const hasSearchResults = currentConversation.some(msg => msg.id.includes('-search'));
      const hasAIResponse = currentConversation.some(msg =>
        msg.id.includes('-response') || msg.id.includes('-ai-response')
      );

      console.log('Final message handling - hasSearchResults:', hasSearchResults, 'hasAIResponse:', hasAIResponse);

      // Only create a new message if we don't already have search results and AI response
      if (!hasSearchResults && !hasAIResponse) {
        // Create the final message without streaming properties but preserving the content
        const aiMessage = {
          id: streamingMessageId || (Date.now() + 1).toString(),
          role: 'assistant' as Role,
          content: aiMessageContent,
          isStreaming: false
        };

        // Replace any streaming message with the final version
        const finalMessages = currentConversation.filter(msg => !msg.isStreaming);
        finalMessages.push(aiMessage);

        const finalConversations = new Map(get().conversations);
        finalConversations.set(conversationId, finalMessages);

        set({
          conversations: finalConversations
        });
      } else {
        // If we already have search results and AI response, just update the streaming property
        const updatedMessages = currentConversation.map(msg => ({
          ...msg,
          isStreaming: false
        }));

        const finalConversations = new Map(get().conversations);
        finalConversations.set(conversationId, updatedMessages);

        set({
          conversations: finalConversations
        });
      }

      // Store logs if enabled
      if (storeLogs) {
        try {
          const logData = {
            timestamp: new Date().toISOString(),
            model: currentModel,
            temperature,
            maxTokens,
            topP,
            webSearch: shouldUseWebSearch,
            streaming: enableStreaming,
            request: apiMessages,
            response: aiMessageContent
          };

          // Store log in localStorage for now
          const logs = JSON.parse(localStorage.getItem('chat_logs') || '[]');
          logs.push(logData);
          localStorage.setItem('chat_logs', JSON.stringify(logs));
        } catch (logError) {
          console.error('Error storing logs:', logError);
        }
      }

      set({
        isLoadingResponse: false,
        isSearchingWeb: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      set({
        isLoadingResponse: false,
        isSearchingWeb: false,
        error: error.message || 'Failed to get response from OpenAI'
      });
    }
  },

  setCurrentConversation: (id) => {
    set({ currentConversationId: id, error: null });
  },

  clearConversations: () => {
    set({ conversations: new Map(), currentConversationId: null });
  },

  deleteConversation: (id) => {
    const { conversations, currentConversationId } = get();
    const updatedConversations = new Map(conversations);
    updatedConversations.delete(id);

    set({
      conversations: updatedConversations,
      currentConversationId: id === currentConversationId ? null : currentConversationId
    });
  },

  addFolder: (name) => {
    const folders = [...get().folders];
    folders.push({
      id: Date.now().toString(),
      name,
      conversationIds: []
    });
    set({ folders });
  },

  removeFolder: (id) => {
    const folders = get().folders.filter(folder => folder.id !== id);
    set({ folders });
  },

  moveConversationToFolder: (conversationId, folderId) => {
    const folders = [...get().folders];
    const folder = folders.find(f => f.id === folderId);

    if (folder) {
      folder.conversationIds.push(conversationId);
      set({ folders });
    }
  },

  setTemperature: (value) => {
    set({ temperature: value });
    localStorage.setItem('temperature', value.toString());
  },

  setMaxTokens: (value) => {
    set({ maxTokens: value });
    localStorage.setItem('max_tokens', value.toString());
  },

  setTopP: (value) => {
    set({ topP: value });
    localStorage.setItem('top_p', value.toString());
  },

  setStoreLogs: (value) => {
    set({ storeLogs: value });
    localStorage.setItem('store_logs', value.toString());
  },

  setEnableWebSearch: (value) => {
    set({ enableWebSearch: value });
    localStorage.setItem('enable_web_search', value.toString());
  },

  setEnableStreaming: (value) => {
    set({ enableStreaming: value });
    localStorage.setItem('enable_streaming', value.toString());
  },

  setForceWebSearch: (value) => {
    set({ forceWebSearch: value });
    localStorage.setItem('force_web_search', value.toString());
  },

  toggleForceWebSearch: () => {
    const currentValue = get().forceWebSearch;
    set({ forceWebSearch: !currentValue });
    localStorage.setItem('force_web_search', (!currentValue).toString());
  },

  resetModelConfig: () => {
    set({
      temperature: 1.0,
      maxTokens: 2048,
      topP: 1.0,
      enableWebSearch: true,
      enableStreaming: true,
      forceWebSearch: false
    });
    localStorage.setItem('temperature', '1.0');
    localStorage.setItem('max_tokens', '2048');
    localStorage.setItem('top_p', '1.0');
    localStorage.setItem('enable_web_search', 'true');
    localStorage.setItem('enable_streaming', 'true');
    localStorage.setItem('force_web_search', 'false');
  },

  clearError: () => set({ error: null })
}));