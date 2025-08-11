from typing import List, Literal, Optional, Dict, Any, TypeAlias, Union
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from enum import Enum
from datetime import datetime

class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str

    def to_langchain_message(self) -> BaseMessage:
        """转换为 LangChain 消息格式"""
        if self.role == "user":
            return HumanMessage(content=self.content)
        elif self.role == "assistant":
            return AIMessage(content=self.content)
        elif self.role == "system":
            return SystemMessage(content=self.content)
        else:
            return HumanMessage(content=self.content)

class ChatRequest(BaseModel):
    provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"
    prompt: Optional[str] = None
    messages: Optional[List[ChatMessage]] = []
    stream: Optional[bool] = True
    config: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    content: str
    role: str = "assistant"
    finish_reason: Optional[str] = None

class StreamChunk(BaseModel):
    delta: Optional[str] = None
    finish_reason: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

class EventType(str, Enum):
    """LangGraph 事件类型枚举"""
    CHAT_START = "chat_start"
    CHAT_TOKEN = "chat_token"
    CHAT_END = "chat_end"
    TOOL_START = "tool_start"
    TOOL_END = "tool_end"
    STEP_START = "step_start"
    STEP_END = "step_end"
    ERROR = "error"
    DEBUG = "debug"

class EventData(BaseModel):
    """标准化事件数据结构"""
    type: EventType
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    step_name: Optional[str] = None
    tool_name: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

class StreamEvent(BaseModel):
    """流式事件包装器"""
    event: EventData
    run_id: str
    thread_id: str

class ImageURL(BaseModel):
    url: str
    """
    The external URL of the image, must be a supported image types: jpeg, jpg, png,
    gif, webp.
    """

    detail: Optional[Literal["auto", "low", "high"]] = None
    """Specifies the detail level of the image.

    `low` uses fewer tokens, you can opt in to high resolution using `high`. Default
    value is `auto`
    """


class ImageURLContentBlock(BaseModel):
    image_url: ImageURL
    type: Literal["image_url"]


class ImageRawURLContentBlock(BaseModel):
    image_url: str
    type: Literal["image_url"]


class TextContentBlock(BaseModel):
    text: str

    type: Literal["text"]
    """Always `text`."""

MessageContent: TypeAlias = Union[ImageURLContentBlock, TextContentBlock]

# OpenAI 兼容格式的数据模型
class OpenAIMessage(BaseModel):
    """OpenAI 格式的消息"""
    role: str  # "user", "assistant", "system"
    content: str
    name: Optional[str] = None

class OpenAIChoice(BaseModel):
    """OpenAI 响应选择"""
    index: int
    message: Optional[OpenAIMessage] = None
    delta: Optional[Dict[str, Any]] = None
    finish_reason: Optional[str] = None

class OpenAIUsage(BaseModel):
    """OpenAI 使用统计"""
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

class OpenAIChatCompletionResponse(BaseModel):
    """OpenAI /chat/completions 响应格式"""
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[OpenAIChoice]
    usage: Optional[OpenAIUsage] = None

class OpenAIChatCompletionStreamResponse(BaseModel):
    """OpenAI /chat/completions 流式响应格式"""
    id: str
    object: str = "chat.completion.chunk"
    created: int
    model: str
    choices: List[OpenAIChoice]

def convert_to_chat_request(openai_request: ChatRequest) -> ChatRequest:
    """将 OpenAI 请求转换为内部 ChatRequest 格式"""
    messages = [
        ChatMessage(role=msg.role, content=msg.content)
        for msg in openai_request.messages
    ]

    return ChatRequest(
        provider="openai",  # 默认提供商
        model=openai_request.model,
        messages=messages,
        stream=openai_request.stream,
    )

