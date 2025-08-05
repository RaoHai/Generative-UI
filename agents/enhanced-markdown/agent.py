import random
from typing import List, Optional

from langchain_openai import ChatOpenAI
from datetime import datetime, timedelta

from langchain_core.messages import ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import MessagesState
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool

class State(MessagesState):
    steps: List[dict] = []
    next_step: Optional[str]

@tool
def get_stock_data(stock_name: str) -> dict:
    """
        GET Stock Data from given stock name
    """
    print(f"get_stock_data: {stock_name}")

    stock_data = {
        stock_name: []
    }
    
    # 设置基准价格和日期
    base_price = 150.0
    start_date = datetime(2024, 1, 1)
    
    for i in range(100):
        # 生成日期（从2024年1月1日开始，每天一条数据）
        current_date = start_date + timedelta(days=i)
        
        # 生成价格波动（基于前一天的收盘价）
        if i == 0:
            open_price = base_price
        else:
            open_price = stock_data[stock_name][i-1]["close"]
        
        # 生成价格波动（±3%）
        price_change = random.uniform(-0.03, 0.03)
        close_price = open_price * (1 + price_change)
        
        # 生成最高价和最低价
        high_price = max(open_price, close_price) * random.uniform(1.0, 1.02)
        low_price = min(open_price, close_price) * random.uniform(0.98, 1.0)
        
        # 生成成交量（100万到1000万股之间）
        volume = random.randint(1000000, 10000000)
        
        stock_data[stock_name].append({
            "date": current_date.strftime("%Y-%m-%d"),
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": volume
        })
    
    return stock_data 

async def process_tools_node(state: State) -> State:
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

async def generate_report(state: State) -> State:
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
    
    model = ChatOpenAI(model="gpt-4o")

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

async def chat_node(state: State) -> State:    
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
    model = ChatOpenAI(model="gpt-4o")
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

workflow = StateGraph(State)

workflow.add_node("chat_node", chat_node)
workflow.add_node("process_tools", process_tools_node)
workflow.add_node("generate_report", generate_report)

workflow.set_entry_point("chat_node")

# 添加路由逻辑
def route_after_chat(state: State) -> str:
    return state["next_step"]

def route_after_tools(state: State) -> str:
    return state["next_step"]

def route_after_generate(state: State) -> str:
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
