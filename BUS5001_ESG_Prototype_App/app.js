const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const parameterOutput = document.getElementById('parameterOutput');
const downloadTranscript = document.getElementById('downloadTranscript');
const runDemo = document.getElementById('runDemo');
const triageInput = document.getElementById('triageInput');
const triageBtn = document.getElementById('triageBtn');
const triageOutput = document.getElementById('triageOutput');
const triageSample = document.getElementById('triageSample');
const copyJson = document.getElementById('copyJson');

const transcript = [];
let lastAnalysis = {
  intent: 'welcome',
  confidence: 1,
  parameters: {},
  route: 'start'
};

const TEAM_ROUTES = {
  water_leak: 'Facilities and Sustainability Operations',
  energy_waste: 'Facilities Energy Management',
  waste_contamination: 'Waste and Recycling Team',
  supplier_policy: 'Procurement and ESG Governance',
  accessibility_barrier: 'Accessibility and Inclusion Team',
  governance_conduct: 'People, Governance and Compliance Team',
  general_policy: 'ESG Policy Support'
};

const TRAINING_HINTS = [
  { intent: 'report_esg_incident', phrases: ['water leak', 'bins contaminated', 'air conditioning running overnight', 'blocked entrance'] },
  { intent: 'ask_esg_policy', phrases: ['what is the recycling policy', 'approved sustainable supplier', 'energy policy'] },
  { intent: 'request_status_or_help', phrases: ['what happens next', 'who will review this', 'how do I report'] },
  { intent: 'escalate_sensitive_issue', phrases: ['urgent', 'unsafe', 'blocked access', 'supplier breach', 'governance concern'] },
  { intent: 'default_fallback', phrases: ['unclear or non-ESG message'] }
];

function addMessage(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatLog.appendChild(wrapper);
  chatLog.scrollTop = chatLog.scrollHeight;
  transcript.push({ timestamp: new Date().toISOString(), sender, text });
}

function extractLocation(text) {
  const patterns = [
    /building\s+[a-z0-9]+/i,
    /level\s+\d+/i,
    /floor\s+\d+/i,
    /near\s+([a-z\s]+?)(?:\.|,|$| has| is| was)/i,
    /in\s+([a-z\s]+?)(?:\.|,|$| has| is| was)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return (match[1] || match[0]).trim();
  }
  return 'not provided';
}

function classifyIssue(text) {
  const lower = text.toLowerCase();
  if (/water|leak|tap|pipe|flood/.test(lower)) return 'water_leak';
  if (/recycl|bin|waste|contaminat|disposal|rubbish|trash/.test(lower)) return 'waste_contamination';
  if (/air conditioning|aircon|ac\b|light|electric|energy|overnight|empty office|heating/.test(lower)) return 'energy_waste';
  if (/supplier|procurement|vendor|supply chain|sustainability policy/.test(lower)) return 'supplier_policy';
  if (/accessible|accessibility|wheelchair|blocked entrance|barrier|inclusion/.test(lower)) return 'accessibility_barrier';
  if (/conduct|harassment|governance|privacy|ethics|wellbeing/.test(lower)) return 'governance_conduct';
  if (/policy|procedure|standard|guideline|requirement/.test(lower)) return 'general_policy';
  return 'unknown';
}

function classifyUrgency(text, category) {
  const lower = text.toLowerCase();
  if (/fire|injury|danger|unsafe|hazard|emergency|immediate/.test(lower)) return 'CRITICAL';
  if (/all morning|two days|blocked|running|leak|breach|not meet|supplier/.test(lower)) return 'HIGH';
  if (/again|repeated|overnight|seems|concern/.test(lower)) return 'MEDIUM';
  if (category === 'accessibility_barrier' || category === 'supplier_policy') return 'HIGH';
  return 'LOW';
}

function detectIntent(text) {
  const category = classifyIssue(text);
  const lower = text.toLowerCase();
  let intent = 'default_fallback';
  let confidence = 0.38;

  if (/hello|hi|hey|start/.test(lower)) {
    intent = 'welcome';
    confidence = 0.95;
  } else if (/status|what happens next|who will review|help/.test(lower)) {
    intent = 'request_status_or_help';
    confidence = 0.83;
  } else if (category === 'general_policy') {
    intent = 'ask_esg_policy';
    confidence = 0.80;
  } else if (category !== 'unknown') {
    intent = 'report_esg_incident';
    confidence = 0.88;
  }

  if (/urgent|unsafe|blocked|supplier|breach|accessibility|governance|ethics/.test(lower) && category !== 'unknown') {
    intent = 'escalate_sensitive_issue';
    confidence = Math.max(confidence, 0.90);
  }

  return { intent, confidence };
}

function analyseMessage(text) {
  const detection = detectIntent(text);
  const issueCategory = classifyIssue(text);
  const urgency = classifyUrgency(text, issueCategory);
  const location = extractLocation(text);
  const sensitiveFlag = ['supplier_policy', 'accessibility_barrier', 'governance_conduct'].includes(issueCategory);
  const team = TEAM_ROUTES[issueCategory] || 'ESG Support Desk';
  const route = detection.intent === 'default_fallback'
    ? 'fallback_clarification'
    : (urgency === 'CRITICAL' || urgency === 'HIGH' || sensitiveFlag)
      ? 'human_escalation_route'
      : 'standard_ticket_route';

  return {
    intent: detection.intent,
    confidence: Number(detection.confidence.toFixed(2)),
    parameters: {
      issue_category: issueCategory,
      location,
      urgency,
      sensitive_or_inclusion_flag: sensitiveFlag ? 'Y' : 'N',
      recommended_team: team
    },
    route,
    ticket_id: route === 'fallback_clarification' ? null : `ESG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  };
}

function botResponse(analysis) {
  if (analysis.intent === 'welcome') {
    return 'Hello. I can help report sustainability incidents such as water leaks, energy waste, recycling contamination, supplier concerns, or accessibility barriers. Please describe the issue and location.';
  }

  if (analysis.intent === 'request_status_or_help') {
    return 'After a report is submitted, low-risk items are logged as ESG tickets. High-risk, accessibility, supplier or governance concerns are escalated to the responsible human team for review.';
  }

  if (analysis.route === 'fallback_clarification') {
    return 'I could not clearly identify the ESG issue. Please include the issue type, location, and whether it needs urgent follow-up. For example: “Water leak in Building C running all morning.”';
  }

  const p = analysis.parameters;
  const escalationText = analysis.route === 'human_escalation_route'
    ? 'Because this is high priority or sensitive, I will escalate it to a human reviewer.'
    : 'This can be logged through the standard ESG support route.';

  return `Thank you. I identified this as ${p.issue_category.replaceAll('_', ' ')} at ${p.location}. Urgency: ${p.urgency}. Recommended team: ${p.recommended_team}. ${escalationText} Local ticket reference: ${analysis.ticket_id}.`;
}

function updateParameterView(analysis) {
  parameterOutput.textContent = JSON.stringify(analysis, null, 2);
}

function handleUserMessage(text) {
  if (!text.trim()) return;
  addMessage('user', text.trim());
  const analysis = analyseMessage(text.trim());
  lastAnalysis = analysis;
  updateParameterView(analysis);
  addMessage('bot', botResponse(analysis));
}

function triageMessage(text) {
  const analysis = analyseMessage(text);
  const category = analysis.parameters.issue_category;
  const sensitivity = analysis.parameters.sensitive_or_inclusion_flag === 'Y' ? 'MEDIUM' : 'LOW';
  const sentiment = /again|blocked|leak|concern|not meet|unsafe|running/.test(text.toLowerCase()) ? 'NEGATIVE' : 'NEUTRAL';
  const followup = analysis.route === 'fallback_clarification' ? 'N' : 'Y';
  const escalationReason = analysis.route === 'human_escalation_route'
    ? 'High urgency, sensitive category, accessibility impact or supplier compliance risk requires human review.'
    : analysis.route === 'fallback_clarification'
      ? 'Message is unclear and requires more information before triage.'
      : 'Standard operational issue suitable for routine workflow.';

  return {
    issue_category: category,
    urgency: analysis.parameters.urgency,
    sentiment,
    followup_required: followup,
    recommended_team: analysis.parameters.recommended_team,
    escalation_reason: escalationReason,
    data_sensitivity_risk: sensitivity,
    brief_summary: text.trim().slice(0, 180),
    baseline_method: 'local keyword and route-based classifier',
    confidence: analysis.confidence
  };
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  handleUserMessage(chatInput.value);
  chatInput.value = '';
});

document.querySelectorAll('.quick-actions button').forEach(button => {
  button.addEventListener('click', () => handleUserMessage(button.dataset.message));
});

runDemo.addEventListener('click', () => {
  chatLog.innerHTML = '';
  transcript.length = 0;
  addMessage('system', 'Sample executive demo started. This demonstrates one full user journey with parameter capture, branching, escalation and endpoint confirmation.');
  addMessage('bot', 'Hello. Please describe the ESG issue and location. I will route it to the correct team.');
  handleUserMessage('The accessible entrance near the main building has been blocked for two days.');
});

downloadTranscript.addEventListener('click', () => {
  const data = {
    exported_at: new Date().toISOString(),
    latest_analysis: lastAnalysis,
    training_hints: TRAINING_HINTS,
    transcript
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bus5001_esg_chatbot_transcript.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

triageBtn.addEventListener('click', () => {
  const text = triageInput.value.trim();
  if (!text) {
    triageOutput.textContent = JSON.stringify({ error: 'Please enter a message first.' }, null, 2);
    return;
  }
  triageOutput.textContent = JSON.stringify(triageMessage(text), null, 2);
});

triageSample.addEventListener('click', () => {
  triageInput.value = 'The air conditioning is running overnight in an empty office on Level 4.';
  triageOutput.textContent = JSON.stringify(triageMessage(triageInput.value), null, 2);
});

copyJson.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(triageOutput.textContent);
    copyJson.textContent = 'Copied';
    setTimeout(() => { copyJson.textContent = 'Copy JSON'; }, 1000);
  } catch (error) {
    alert('Copy failed. You can manually select and copy the JSON.');
  }
});

addMessage('bot', 'Welcome. I am the ESG Sustainability Support Assistant. Please report one ESG issue with location, such as a water leak, energy waste, recycling contamination, supplier policy concern or accessibility barrier.');
updateParameterView(lastAnalysis);
