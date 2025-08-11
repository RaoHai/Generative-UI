'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface StreamingChatProps {
  apiEndpoint: string;
  apiKey?: string;
  placeholder?: string;
  className?: string;
  enableStreaming?: boolean;
}

export default function StreamingChat({ 
  apiEndpoint, 
  apiKey, 
  placeholder = "输入消息...",
  className = "",
  enableStreaming = true
}: StreamingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      if (enableStreaming) {
        await sendStreamingMessage(userMessage);
      } else {
        await sendRegularMessage(userMessage);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('请求被取消');
        return;
      }
      
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，发送消息时出现错误，请稍后重试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const sendStreamingMessage = async (userMessage: Message) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, assistantMessage]);

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage.content
          }
        ],
        model: 'gpt-3.5-turbo',
        stream: true
      }),
      signal: abortControllerRef.current?.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // 流结束
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, isStreaming: false }
                  : msg
              ));
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + content }
                    : msg
                ));
              }
            } catch (e) {
              console.warn('解析流数据失败:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const sendRegularMessage = async (userMessage: Message) => {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify({
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage.content
          }
        ],
        model: 'gpt-3.5-turbo',
        stream: false
      }),
      signal: abortControllerRef.current?.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.choices?.[0]?.message?.content || '抱歉，无法获取回复',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">💬</div>
            <p>开始对话吧！</p>
            {enableStreaming && (
              <p className="text-xs text-gray-400 mt-2">支持流式响应</p>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                )}
              </div>
              <div className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
                {message.isStreaming && (
                  <span className="ml-2 text-blue-500">正在生成...</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && !messages.some(m => m.isStreaming) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>正在思考...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          {isLoading && messages.some(m => m.isStreaming) ? (
            <button
              onClick={stopGeneration}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              停止
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          )}
        </div>
        
        {enableStreaming && (
          <div className="mt-2 text-xs text-gray-500">
            支持流式响应，实时显示 AI 回复
          </div>
        )}
      </div>
    </div>
  );
}
