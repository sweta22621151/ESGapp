# Dialogflow CX Build Guide for BUS5001 Q1

Use this guide to recreate the prototype in Dialogflow CX for the required screenshots and demo video.

## 1. Agent setup

Create a Dialogflow CX agent named:

`ESG Sustainability Support Assistant`

Suggested region: any available region permitted by your student account.

## 2. Use case

Use case: Sustainability incident reporting assistant.

Purpose: Staff can report sustainability incidents such as water leaks, energy waste, waste contamination, supplier policy concerns and accessibility barriers. The bot captures issue details and routes the report to the correct team.

## 3. Create intents

Create these intents using the CSV file in this folder:

1. `report_esg_incident`
2. `ask_esg_policy`
3. `request_status_or_help`
4. `escalate_sensitive_issue`
5. `default_fallback`

Add at least 3-5 training phrases for each main intent.

## 4. Create parameters/entities

Create or capture these parameters:

- `issue_category`
- `location`
- `urgency`
- `sensitive_or_inclusion_flag`
- `recommended_team`

At minimum, the assessment requires at least one entity or structured parameter. This design includes several.

## 5. Pages and route design

Suggested pages:

1. `Start Page`
   - Greeting: "Hello, I am the ESG Sustainability Support Assistant. Please describe the sustainability issue and location."
   - Routes to report, policy, help or fallback.

2. `Collect Incident Details`
   - Ask for missing issue category or location.
   - Capture parameters.

3. `Route Decision`
   - If urgency is HIGH/CRITICAL or the issue involves supplier/accessibility/governance concerns, route to `Escalate to Human Reviewer`.
   - Otherwise, route to `Create ESG Ticket`.

4. `Create ESG Ticket`
   - Confirm standard ticket and recommended team.

5. `Escalate to Human Reviewer`
   - Confirm human escalation and responsible team.

6. `Fallback Clarification`
   - Ask the user to explain the issue more clearly.

## 6. Example test conversation

User: There is a water leak in Building C that has been running all morning.  
Bot: Thank you. I identified this as water leak at Building C. Urgency: HIGH. Recommended team: Facilities and Sustainability Operations. Because this is high priority, I will escalate it to a human reviewer.

## 7. Screenshots to include in report

Capture screenshots of:

- Agent overview
- Flow diagram/pages
- Intents and training phrases
- Parameters/entities/forms
- Route decision or condition
- Fallback response
- Test conversation

## 8. Demo video

Keep the demonstration under 2 minutes. Suggested structure:

- 10 seconds: introduce use case
- 40 seconds: show Dialogflow CX flow and intents
- 40 seconds: run test conversation
- 20 seconds: explain escalation, privacy and accessibility consideration
