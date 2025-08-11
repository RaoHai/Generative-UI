### Bootstrap

#### Setup venv
```bash
python3 -m venv venv
# Activate the new environment
source venv/bin/activate
```

For using windows, Following these Steps.

```bash
py -3.12 -m venv venv

# Activate the new environment
venv\Scripts\Activate.ps1
```

```bash
# Install your existing requirements
pip install -r server/requirements.txt

# Install LangGraph CLI with in-memory support
pip install -U "langgraph-cli[inmem]"

# run start
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Deploy on AWs

```
sam build --use-container --config-file .aws/generative-ui-ap-southeast.toml
```

```
sam deploy --guided --no-confirm-changeset --config-file .aws/generative-ui-ap-southeast.toml
```