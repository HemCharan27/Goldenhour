// GoldenHour-Zero Multimodal Emergency Reasoning Service (Gemini API + Offline Resilient Engine)

const API_KEY_STORAGE_KEY = 'goldenhour_gemini_api_key';

export function getStoredApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export async function analyzeSceneWithGemini({
  imageSrc,
  scenarioContext,
  apiKey = getStoredApiKey()
}) {
  if (apiKey) {
    try {
      // If imageSrc is a data URL, strip the prefix
      let imagePart = null;
      if (imageSrc && imageSrc.startsWith('data:image')) {
        const match = imageSrc.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
        if (match) {
          imagePart = {
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          };
        }
      }

      const promptText = `You are GoldenHour-Zero, an advanced military-grade emergency medical dispatch & multimodal scene triage AI.
Analyze this emergency disaster scene:
Incident: ${scenarioContext?.title || 'Unknown Disaster'}
Overview: ${scenarioContext?.sceneOverview || 'Emergency scene under assessment'}

Perform START (Simple Triage and Rapid Treatment) triage and tactical hazard detection.
Provide output in valid JSON with this exact structure:
{
  "sceneSafetyAssessment": "string describing perimeter hazards and entry safety",
  "hazardsIdentified": [
    {"type": "FIRE_RISK|ELECTRICAL|HAZMAT|STRUCTURAL", "label": "string", "severity": "HIGH|MEDIUM|CRITICAL", "description": "string"}
  ],
  "casualties": [
    {
      "name": "Patient tag (e.g. Victim 1)",
      "triageCategory": "IMMEDIATE|DELAYED|MINOR|EXPECTANT",
      "triageCode": "RED|YELLOW|GREEN|BLACK",
      "injuries": ["list of detected trauma"],
      "vitalSigns": {"respiration": "string", "pulse": "string", "gcs": "string"},
      "recommendedActions": ["priority medical and extrication steps"],
      "estimatedGoldenHourRemainingMinutes": 35
    }
  ],
  "dispatchRecommendation": "Immediate tactical fleet dispatch recommendation"
}`;

      const contents = [
        {
          parts: [
            ...(imagePart ? [imagePart] : []),
            { text: promptText }
          ]
        }
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          return JSON.parse(jsonText);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to simulated tactical engine:', err);
    }
  }

  // High-fidelity fallback tactical analysis
  return {
    sceneSafetyAssessment: `Perimeter evaluated for ${scenarioContext?.title || 'Active MCI'}. Secondary hazards identified. Safe staging zone designated 50m upwind.`,
    hazardsIdentified: scenarioContext?.hazards || [
      { type: 'STRUCTURAL', label: 'Unstable Debris', severity: 'HIGH', description: 'Requires cribbing and stabilization before extrication.' },
      { type: 'FIRE_RISK', label: 'Fuel Leakage', severity: 'MEDIUM', description: 'Foam line charged and standing by.' }
    ],
    casualties: (scenarioContext?.casualties || []).map(c => ({
      name: c.name,
      triageCategory: c.triageCategory,
      triageCode: c.triageCode,
      injuries: c.injuries,
      vitalSigns: { respiration: c.respirations, pulse: c.perfusion, gcs: c.mentalStatus },
      recommendedActions: c.recommendedActions,
      estimatedGoldenHourRemainingMinutes: Math.floor(c.goldenHourExpirySeconds / 60)
    })),
    dispatchRecommendation: 'Dispatch 2x ALS Units (Medic 11, Medic 04), 1x Heavy Rescue 02 for hydraulic cutting. Pre-alert SF General Trauma Bay 1 & 2.'
  };
}

// Dispatch Copilot conversational response
export async function queryDispatcherCopilot({
  message,
  scenario,
  casualties,
  fleet,
  hospitals,
  apiKey = getStoredApiKey()
}) {
  if (apiKey) {
    try {
      const systemPrompt = `You are the GoldenHour-Zero Tactical Dispatch AI Copilot.
You assist emergency 911 dispatchers, incident commanders, and trauma medical directors in managing multi-casualty incidents (MCIs).
Current Incident: ${scenario.title} (${scenario.location.address})
Active Casualties: ${casualties.length} (${casualties.filter(c => c.triageCode === 'RED').length} RED, ${casualties.filter(c => c.triageCode === 'YELLOW').length} YELLOW, ${casualties.filter(c => c.triageCode === 'GREEN').length} GREEN, ${casualties.filter(c => c.triageCode === 'BLACK').length} BLACK).
Fleet Units: ${fleet.map(u => `${u.callSign}: ${u.status}`).join(', ')}
Hospitals: ${hospitals.map(h => `${h.shortName}: ${h.traumaBedsAvailable} beds, ${h.orRoomsReady} ORs`).join(', ')}

Be concise, decisive, professional, and grounded in ATLS (Advanced Trauma Life Support) and START triage guidelines. Use bullet points and clear tactical recommendations.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: `Dispatcher Query: ${message}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn('Gemini Copilot API error, fallback:', err);
    }
  }

  // Intelligent Context-Aware Copilot Fallback
  const lower = message.toLowerCase();
  
  if (lower.includes('bed') || lower.includes('hospital') || lower.includes('destination') || lower.includes('divert')) {
    const bestL1 = hospitals.find(h => h.badge.includes('LEVEL 1') && h.traumaBedsAvailable > 0);
    return `🏥 **Hospital Bed Status & Allocation Recommendation**:
- **Primary Trauma Facility**: **${bestL1 ? bestL1.name : 'SF General'}** has **${bestL1 ? bestL1.traumaBedsAvailable : 4} Trauma Beds** and **${bestL1 ? bestL1.orRoomsReady : 2} OR Suites** immediately ready.
- **Critical Red Casualties**: Direct routing recommended for Patient Alpha and Patient Bravo to avoid secondary transfer delay.
- **Blood Bank Reserve**: 52 units O-Negative available at ZSFG.
- **Diversion Notice**: St. Mary's is currently diverting high-acuity surgical trauma; use only for Green/Yellow overflow.`;
  }

  if (lower.includes('dispatch') || lower.includes('unit') || lower.includes('ambulance') || lower.includes('send') || lower.includes('medic')) {
    const available = fleet.filter(u => u.status === 'AVAILABLE');
    return `🚨 **Tactical Fleet Dispatch Recommendation**:
- **Immediate Tasking**:
  - Dispatch **Medic 11 (ALS)** to Patient Alpha (Entrapped, Tension Pneumothorax) - ETA ~3 min.
  - Dispatch **Medic 04 (ALS)** to Patient Bravo (Arterial Hemorrhage, Femur Fracture) - ETA ~5 min.
  - Dispatch **Rescue 02** with Jaws of Life for driver door/roof displacement.
- **Standby Reserve**: Keep **LifeFlight 1** on pad-alert in case transport ground gridlock exceeds 15 minutes.`;
  }

  if (lower.includes('start') || lower.includes('triage') || lower.includes('algorithm') || lower.includes('red') || lower.includes('tag')) {
    return `📋 **START (Simple Triage and Rapid Treatment) Criteria**:
1. **Can the patient walk?**
   - YES ➔ **GREEN (Minor / Walking Wounded)**
   - NO ➔ Check respirations.
2. **Respiration Assessment**:
   - Absent after airway repositioning ➔ **BLACK (Expectant)**
   - > 30 breaths/min ➔ **RED (Immediate)**
   - < 30 breaths/min ➔ Check perfusion.
3. **Perfusion Assessment**:
   - Radial pulse absent OR Cap refill > 2s ➔ **RED (Immediate)**
   - Radial pulse present / refill < 2s ➔ Check mental status.
4. **Mental Status**:
   - Cannot follow simple commands ➔ **RED (Immediate)**
   - Follows simple commands ➔ **YELLOW (Delayed)**`;
  }

  if (lower.includes('cpr') || lower.includes('arrest') || lower.includes('metronome') || lower.includes('chest')) {
    return `💓 **AHA Out-of-Hospital Cardiac Arrest Protocol**:
- **Compression Rate**: 100-120 per minute (Use the built-in CPR Metronome modal).
- **Depth**: At least 2 inches (5 cm), allow complete chest recoil.
- **AED Priority**: Attach pads immediately without interrupting compressions. Deliver single shock if Ventricular Fibrillation / Pulseless VT detected.
- **Airway**: 30:2 compression-to-ventilation ratio until supraglottic airway or endotracheal tube secured.`;
  }

  if (lower.includes('mist') || lower.includes('report') || lower.includes('handover') || lower.includes('atls')) {
    return `📄 **MIST Emergency Handover Summary**:
- **M (Mechanism)**: High-energy multi-vehicle collision, rollover with entrapment and vehicle fire.
- **I (Injuries)**: 2x Critical (Tension pneumothorax, open femur fracture with arterial bleed), 1x Moderate (Radius fracture), 1x Minor.
- **S (Signs)**: Tachycardia, respiratory compromise, hemorrhagic shock Class III.
- **T (Treatment)**: Bilateral needle decompression, CAT tourniquet applied, spinal motion restriction.`;
  }

  return `🤖 **GoldenHour-Zero Tactical Advisory**:
Scene status for **${scenario.title}**:
- **Golden Hour Clock**: 46 minutes remaining until physiological decompensation risk escalates.
- **High-Priority Action**: Authorize dual ALS ambulance dispatch and coordinate hydraulic extrication with Rescue 02.
- **Notification**: ZSFG Trauma Team alerted with pre-hospital notification code Red.
*You can ask me to "Dispatch all available units", "Check hospital bed availability", "Explain START triage", or "Generate MIST Handover Report".*`;
}
