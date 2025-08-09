### Bootstrap

For using windows, Following these Steps.
```
py -3.12 -m venv venv

# Activate the new environment
venv\Scripts\Activate.ps1

# Install your existing requirements
pip install -r server/requirements.txt

# Install LangGraph CLI with in-memory support
pip install -U "langgraph-cli[inmem]"
```
