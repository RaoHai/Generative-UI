from typing import List, Optional
from langgraph.graph.message import MessagesState

from llm.base import BaseLLMClient
from llm import LLM

class AgentState(MessagesState):
    provider: Optional[str] = "openai"
    model: Optional[str] = "gpt-4o"
    steps: List[dict] = []
    next_step: Optional[str]


def get_llm_client(state: AgentState) -> BaseLLMClient:
    llm = LLM(provider=state["provider"], model_name=state["model"])
    print(f"get_llm_client: {llm}")
    return llm.get_client()