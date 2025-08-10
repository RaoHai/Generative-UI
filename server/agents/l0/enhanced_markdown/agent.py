from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage

from agents.tools.stock import get_stock_data
from agents.state import AgentState, get_llm_client


async def process_tools_node(state: AgentState) -> AgentState:
    """处理工具调用的节点"""
    # 获取最后一条消息
    last_message = state["messages"][-1]

    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        # 处理工具调用
        tool_messages = []
        for tool_call in last_message.tool_calls:
            if tool_call['name'] == 'get_stock_data':
                stock_name = tool_call['args']['stock_name']
                result = get_stock_data(stock_name)
                tool_messages.append(ToolMessage(
                    content=str(result),
                    tool_call_id=tool_call['id']
                ))

        return {
            "messages": state["messages"] + tool_messages,
            "next_step": "generate_report"
        }

    return {
        "messages": state["messages"],
        "next_step": "end"
    }

async def generate_report(state: AgentState) -> AgentState:
    """
        生成报告
    """
    generate_role_define_prompt = """
    ### Role Definition
        You are a stock market analyst expert.
    ### Task
        You are given a stock ticker and a date.
        You need to analyze the stock market and provide a report.
        The report should be in markdown with enhanced symbols and components.
        - use <highlight> to highlight the important parts of the text.
        - use <CandlestickChart> to draw the candlestick chart.
    ### Example
        <CandlestickChart title="AAPL" />
    """

    model = get_llm_client(state)

    # Run the model to generate a response
    response = await model.ainvoke([
        SystemMessage(content=generate_role_define_prompt),
        *state["messages"],
    ], RunnableConfig(recursion_limit=25))

    messages = state["messages"] + [response]

    return {
        "messages": messages,
        "next_step": "process_tools"
    }

async def chat_node(state: AgentState) -> AgentState:
    system_prompt = """
        You are a stock market analyst expert.
        You are given a stock ticker and a date.
        You need to analyze the stock market and provide a report.

        You will follow the following steps:
        1. Get the stock data
        2. Analyze the stock data
        3. Write the report

        You will use the following tools:
        - get_stock_data: Get the stock data
    """
    model = get_llm_client(state)
    model_with_tools = model.bind_tools([get_stock_data], parallel_tool_calls=False)

    # Run the model to generate a response
    response = await model_with_tools.ainvoke([
        SystemMessage(content=system_prompt),
        *state["messages"],
    ], RunnableConfig(recursion_limit=25))

    messages = state["messages"] + [response]

    return {
        "messages": messages,
        "next_step": "process_tools"
    }

workflow = StateGraph(AgentState)

workflow.add_node("chat_node", chat_node)
workflow.add_node("process_tools", process_tools_node)
workflow.add_node("generate_report", generate_report)

workflow.set_entry_point("chat_node")

# 添加路由逻辑
def route_after_chat(state: AgentState) -> str:
    return state["next_step"]

def route_after_tools(state: AgentState) -> str:
    return state["next_step"]

def route_after_generate(state: AgentState) -> str:
    return state["next_step"]

workflow.add_edge(START, "chat_node")

workflow.add_conditional_edges("chat_node", route_after_chat, {
    "process_tools": "process_tools",
    "end": END
})

workflow.add_conditional_edges("process_tools", route_after_tools, {
    "generate_report": "generate_report",
    "end": END
})

workflow.add_conditional_edges("generate_report", route_after_generate, {
    "process_tools": "process_tools",
    "end": END
})

graph = workflow.compile()
