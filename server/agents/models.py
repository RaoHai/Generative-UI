from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage

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
    messages: List[ChatMessage]
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