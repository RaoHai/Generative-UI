from typing import List, Optional
from langgraph.graph.message import MessagesState

from llm.base import BaseLLMClient
from langchain_core.language_models import BaseChatModel
from llm import LLM

class AgentState(MessagesState):
    provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"
    prompt: Optional[str] = None
    steps: List[dict] = []
    next_step: Optional[str]


def get_llm_client(state: AgentState) -> BaseChatModel:
    llm = LLM(provider=state["provider"], model_name=state["model"])
    print(f"get_llm_client: {llm}")
    return llm.get_client()