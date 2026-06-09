# BUS5001 Assessment 3 - ESG Chatbot and Triage Prototype App

This folder contains a working local prototype app for BUS5001 Assessment 3. It is designed as supporting evidence for Q1 and Q3.

## What the app demonstrates

### Q1 ESG Chatbot Prototype
- One focused ESG use case: sustainability incident reporting assistant.
- Five Dialogflow CX-style intents:
  - `report_esg_incident`
  - `ask_esg_policy`
  - `request_status_or_help`
  - `escalate_sensitive_issue`
  - `default_fallback`
- Structured parameter capture:
  - issue category
  - location
  - urgency
  - sensitive/inclusion flag
  - recommended team
- Branching and routing:
  - standard ticket route
  - human escalation route
  - fallback clarification route
- Endpoint:
  - local ticket confirmation and recommended responsible team

### Q3 ESG Message Triage Prototype
- Paste an ESG message.
- Generate JSON output including issue category, urgency, sentiment, follow-up requirement, recommended team, escalation reason, data sensitivity risk and summary.
- A simple rule-based baseline is included in `/q3/baseline_triage.py`.

## How to run the app

### Option 1: Open directly
Open `index.html` in Google Chrome, Microsoft Edge or Firefox.

### Option 2: Run with a local server
From this folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

On Windows, you can double-click `start_app.bat` if Python is installed.

## Important submission note

This app is not a replacement for the required Dialogflow CX implementation. The assessment brief asks for screenshots and demonstration evidence from Dialogflow CX. Use this app as a supporting local prototype and proof of conversation design.

For final submission, add:
- Dialogflow CX screenshots
- Microsoft Stream or Echo365 demo video link under 2 minutes
- GitHub repository link for Q3 and Q4 evidence logs

## Suggested demo script

1. Open the app.
2. Click **Run sample flow**.
3. Show the user message: accessible entrance blocked for two days.
4. Show captured parameters and route: human escalation route.
5. Use the Q3 triage box and click **Use sample**.
6. Show JSON output.
7. Explain that no live organisational data is sent because this is a local academic prototype.

## Files included

- `index.html` - main app page
- `styles.css` - app styling
- `app.js` - chatbot and triage logic
- `server.py` - optional local Python server
- `start_app.bat` - Windows shortcut to start local server
- `q3/baseline_triage.py` - simple baseline classifier
- `q3/revised_prompt_template.txt` - improved LLM prompt template
- `q3/sample_llm_outputs.json` - sample JSON outputs for report evidence
- `dialogflow_cx/intents_and_training_phrases.csv` - intents/training phrases for Dialogflow CX setup
- `dialogflow_cx/entities_parameters.csv` - suggested parameters/entities
- `dialogflow_cx/flow_map.mmd` - Mermaid conversation flow diagram
- `dialogflow_cx/dialogflow_build_guide.md` - step-by-step setup guide
