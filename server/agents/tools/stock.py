from langchain_core.tools import tool
from yahoo_finance import Share
from datetime import datetime, timedelta


@tool
def get_stock_data(stock_name: str) -> dict:
    """
    GET Stock Data from given stock name
    """
    print(f"get_stock_data: {stock_name}")

    try:
        # 使用 yfinance 获取股票数据
        share = Share(stock_name)

        # 获取最近5天的历史数据
        end_date = share.get_trade_datetime()
        start_date = end_date - timedelta(days=5)

        # 获取历史数据
        hist_data = share.get_historical(start=start_date, end=end_date)

        # 转换为字典格式
        result = {
            "stock_name": stock_name,
            "data": hist_data
        }

        return result

    except Exception as e:
        return {"error": f"Failed to get stock data: {str(e)}"}