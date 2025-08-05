import random
from typing import Optional

from langchain_openai import ChatOpenAI
from datetime import datetime, timedelta

from langgraph.graph import StateGraph, START, END
from langgraph.types import Command
from langgraph.graph.message import MessagesState
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool

class State(MessagesState):
    next_step: Optional[str]

@tool
def get_stock_data(stock_name: str) -> dict:
    """
        获取指定股票的数据
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

def write_file(state: State) -> State:
    return state

async def chat_node(state: State) -> State:
    system_prompt = """
        You are a stock market analyst expert.
        You are given a stock ticker and a date.
        You need to analyze the stock market and provide a report.
        The report should be in Html format.
    """

    model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    model_with_tools = model.bind_tools([get_stock_data, write_file])

    response = await model_with_tools.ainvoke([
        SystemMessage(content=system_prompt),
        *state["messages"]
    ])

    return Command(
        goto=END,
        update={
            "messages": state["messages"] + [response]
        }
    )

workflow = StateGraph(State)

workflow.add_node("chat_node", chat_node)

workflow.set_entry_point("chat_node")
workflow.add_edge(START, "chat_node")
workflow.add_edge("chat_node", END)


graph = workflow.compile()