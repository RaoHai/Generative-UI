import importlib
import os
from typing import Dict, Optional, Type
from llm.base import BaseLLMClient


class LLMTokenLike:
    token: str
    llm: str


llm_client_registry: Dict[str, Type["BaseLLMClient"]] = {}


def register_llm_client(name: str):
    """Decorator to register a new LLM client class."""

    def decorator(cls):
        if name in llm_client_registry:
            raise ValueError(f"Client '{name}' is already registered.")
        llm_client_registry[name] = cls
        return cls

    return decorator


def get_registered_llm_client():
    return llm_client_registry


def import_clients(directory: str = "providers"):
    """Dynamically import all Python modules in the given directory."""
    # 获取当前文件的绝对路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    clients_dir = os.path.join(current_dir, directory)

    for filename in os.listdir(clients_dir):
        if filename.endswith(".py") and not filename.startswith("__"):
            module_name = f"llm.{directory}.{filename[:-3]}"  # 去掉 .py 后缀
            importlib.import_module(module_name)


class LLM:
    llm_token: LLMTokenLike
    client: Optional[BaseLLMClient]

    def __init__(
            self,
            provider: str = "openai",
            model_name: str = "gpt-4o",
            temperature: Optional[float] = 0.2,
            n: Optional[int] = 1,
            top_p: Optional[float] = None
    ):
        self._client = self.get_llm_client(provider, model_name, temperature=temperature, n=n, top_p=top_p)

    def get_llm_client(
        self,
        provider: str = "openai",
        model_name: str = "gpt-4o",
        api_key: Optional[str | None] = None,
        temperature: Optional[float] = 0.2,
        n: Optional[int] = 1,
        top_p: Optional[float] = None,
        max_tokens: Optional[int] = 1500,
        streaming: Optional[bool] = False,
    ) -> BaseLLMClient:
        """Get an LLM client based on the specified name."""
        if provider in llm_client_registry:
            client_class = llm_client_registry[provider]
            return client_class(
                model_name=model_name,
                temperature=temperature,
                n=n,
                top_p=top_p,
                api_key=api_key,
                streaming=streaming,
                max_tokens=max_tokens,
            )

        raise ValueError(f"Provider '{provider}' not found.")

    def get_client(self) -> BaseLLMClient:
        return self._client.get_client()