from typing import Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain_core.utils.function_calling import convert_to_openai_tool

from llm.base import BaseLLMClient
from core.types.models import MessageContent
from llm import register_llm_client
from utils.env import get_env_variable


OPEN_API_KEY = get_env_variable("OPENAI_API_KEY")


@register_llm_client("openai")
class OpenAIClient(BaseLLMClient):
    _client: ChatOpenAI

    def __init__(
        self,
        model_name: Optional[str] = "gpt-4o",
        temperature: Optional[float] = 0.2,
        n: Optional[int] = 1,
        top_p: Optional[float] = None,
        max_tokens: Optional[int] = 1500,
        streaming: Optional[bool] = False,
        api_key: Optional[str] = OPEN_API_KEY,
    ):
        self._client = ChatOpenAI(
            model_name=model_name,
            temperature=temperature,
            n=n,
            top_p=top_p,
            streaming=streaming,
            max_tokens=max_tokens,
            openai_api_key=api_key,
            stream_usage=True,
        )

    def get_client(self):
        return self._client

    def get_tools(self, tools: List[Any]):
        return [convert_to_openai_tool(tool) for tool in tools]

    def parse_content(self, content: List[MessageContent]):
        return [c.model_dump() for c in content]