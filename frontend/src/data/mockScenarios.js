export const MOCK_SCENARIOS = [
  {
    id: 'mci-highway-101',
    title: 'Highway 101 Multi-Vehicle Rollover & Fire',
    category: 'Mass Casualty Incident (MCI)',
    severity: 'CRITICAL',
    timeElapsedMinutes: 14,
    goldenHourRemainingMinutes: 46,
    location: {
      address: 'US-101 Northbound at Exit 432 (Cesar Chavez)',
      lat: 37.7505,
      lng: -122.4065,
      weather: 'Clear, 64°F, Wind NW 12mph',
      trafficCondition: 'Highway blocked all lanes, severe gridlock'
    },
    sceneOverview: 'Semi-truck fuel tanker collided with two passenger vehicles at highway speeds. Tanker cab overturned; fuel spill detected with engine compartment fire. Multiple entrapped victims.',
    imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80',
    hazards: [
      { id: 'h1', type: 'FIRE_RISK', label: 'Engine Compartment Fire', severity: 'HIGH', radiusMeters: 25, description: 'Fuel spill spreading toward sedan undercarriage.' },
      { id: 'h2', type: 'ELECTRICAL', label: 'Downed Light Pole & Cable', severity: 'MEDIUM', radiusMeters: 15, description: 'Live electrical wiring on road shoulder.' },
      { id: 'h3', type: 'STRUCTURAL', label: 'Unstable Tanker Chassis', severity: 'HIGH', radiusMeters: 20, description: 'Risk of shift during extrication operations.' }
    ],
    audioFeed: {
      caller: 'Distressed Motorist (Caller #912)',
      duration: '01:42',
      audioQuality: 'Degraded / Wind Noise',
      transcript: '911, please hurry! A huge tanker truck just flipped on Highway 101! It crushed a silver Honda and another car caught fire! The driver in the crushed car is trapped and unconscious, his chest is barely moving! Another man was thrown onto the shoulder and his leg is bleeding out like crazy! There is smoke everywhere!',
      acousticEvents: [
        { label: 'Panic / Screaming', confidence: 0.96, timestamp: '00:04' },
        { label: 'Vehicle Crash Impact', confidence: 0.98, timestamp: '00:01' },
        { label: 'Flames / Crackling', confidence: 0.84, timestamp: '00:28' },
        { label: 'Respiratory Distress', confidence: 0.91, timestamp: '00:46' }
      ]
    },
    casualties: [
      {
        id: 'CAS-01',
        name: 'Patient Alpha (Sedan Driver)',
        age: 'Approx 35-40',
        gender: 'Male',
        triageCategory: 'IMMEDIATE', // Red
        triageCode: 'RED',
        locationInScene: { x: 38, y: 52, width: 18, height: 26 },
        status: 'Entrapped in driver compartment. Flail chest, paradoxical respiration.',
        respirations: '34 / min (Rapid, shallow, stridor)',
        perfusion: 'Capillary refill > 3 sec, radial pulse weak (138 bpm)',
        mentalStatus: 'Unresponsive to voice, responds to pain (GCS 8)',
        injuries: ['Tension Pneumothorax', 'Traumatic Brain Injury (GCS 8)', 'Severe Chest Contusion'],
        startAlgorithm: {
          ambulatory: false,
          breathing: true,
          rrUnder30: false, // > 30 = RED
          perfusionOk: false,
          mentalStatusOk: false
        },
        recommendedActions: [
          'Immediate bilateral needle decompression',
          'Urgent Hydraulic Extrication (Jaws of Life)',
          'High-flow O2 & C-Spine immobilization',
          'Direct routing to Level 1 Trauma OR'
        ],
        goldenHourExpirySeconds: 1680,
        assignedHospitalId: 'hosp-1'
      },
      {
        id: 'CAS-02',
        name: 'Patient Bravo (Ejected Passenger)',
        age: 'Approx 28-32',
        gender: 'Female',
        triageCategory: 'IMMEDIATE', // Red
        triageCode: 'RED',
        locationInScene: { x: 68, y: 65, width: 20, height: 22 },
        status: 'Found on shoulder 10m from vehicle. Massive arterial bleed from right thigh.',
        respirations: '26 / min',
        perfusion: 'Pulse 122 bpm, thready. Skin pale, diaphoretic.',
        mentalStatus: 'Confused, oriented to person only (GCS 13)',
        injuries: ['Open Right Femur Fracture', 'Severe Arterial Hemorrhage', 'Hemorrhagic Shock Class III'],
        startAlgorithm: {
          ambulatory: false,
          breathing: true,
          rrUnder30: true,
          perfusionOk: false, // Hemorrhage/delayed refill = RED
          mentalStatusOk: false
        },
        recommendedActions: [
          'Apply Combat Application Tourniquet (CAT) high and tight',
          'Administer IV Tranexamic Acid (TXA) 1g',
          'Rapid thermal blanket for hypothermia prevention',
          'ALS rapid load and go'
        ],
        goldenHourExpirySeconds: 1940,
        assignedHospitalId: 'hosp-1'
      },
      {
        id: 'CAS-03',
        name: 'Patient Charlie (Tanker Driver)',
        age: 'Approx 52',
        gender: 'Male',
        triageCategory: 'DELAYED', // Yellow
        triageCode: 'YELLOW',
        locationInScene: { x: 18, y: 38, width: 16, height: 28 },
        status: 'Self-extricated through shattered windshield. Sitting on concrete divider.',
        respirations: '20 / min (Adequate)',
        perfusion: 'Radial pulse 90 bpm, strong. Cap refill 2 sec.',
        mentalStatus: 'Alert and oriented x 4 (GCS 15). Complaining of neck and left forearm pain.',
        injuries: ['Closed Left Radius/Ulna Fracture', 'Cervical Strain', 'Facial Glass Abrasions'],
        startAlgorithm: {
          ambulatory: false,
          breathing: true,
          rrUnder30: true,
          perfusionOk: true,
          mentalStatusOk: true
        },
        recommendedActions: [
          'Apply C-collar and rigid splint to left forearm',
          'Pain management protocol',
          'Secondary transport via BLS unit'
        ],
        goldenHourExpirySeconds: 3100,
        assignedHospitalId: 'hosp-3'
      },
      {
        id: 'CAS-04',
        name: 'Patient Delta (Rear Passenger)',
        age: 'Approx 19',
        gender: 'Female',
        triageCategory: 'MINOR', // Green
        triageCode: 'GREEN',
        locationInScene: { x: 82, y: 40, width: 14, height: 24 },
        status: 'Walking along highway embankment. Visibly trembling, crying.',
        respirations: '18 / min',
        perfusion: 'Pulse 84 bpm, warm and dry',
        mentalStatus: 'Fully alert (GCS 15)',
        injuries: ['Superficial Seatbelt Contusions', 'Acute Psychological Shock'],
        startAlgorithm: {
          ambulatory: true // Walking wounded = GREEN
        },
        recommendedActions: [
          'Move to Green Triage Holding Area',
          'Warm blanket and psychological first aid',
          'Secondary clinical assessment by triage nurse'
        ],
        goldenHourExpirySeconds: 5200,
        assignedHospitalId: 'hosp-3'
      }
    ]
  },
  {
    id: 'mci-industrial-chlorine',
    title: 'Industrial Chemical Explosion & Toxic Plume',
    category: 'HAZMAT & Mass Casualty',
    severity: 'EXTREME',
    timeElapsedMinutes: 21,
    goldenHourRemainingMinutes: 39,
    location: {
      address: 'Bay Chem Processing Terminal, Pier 70, San Francisco',
      lat: 37.7602,
      lng: -122.3875,
      weather: 'Overcast, 58°F, Wind SE 18mph toward residential zone',
      trafficCondition: 'Industrial perimeter locked down by SFPD'
    },
    sceneOverview: 'Explosion of pressurized chlorine transfer pipeline. Toxic yellow-green plume dispersing downwind. Structural damage to warehouse roof; 5 workers caught in blast and toxic zone.',
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=1200&q=80',
    hazards: [
      { id: 'h201', type: 'TOXIC_GAS', label: 'Chlorine Gas Vapor (IDLH)', severity: 'CRITICAL', radiusMeters: 500, description: 'Immediate danger to life and health. Level A HAZMAT suits required.' },
      { id: 'h202', type: 'COLLAPSE', label: 'Partial Roof Truss Collapse', severity: 'HIGH', radiusMeters: 40, description: 'Buckled steel beams threatening loading bay.' }
    ],
    audioFeed: {
      caller: 'Plant Safety Supervisor (Radio Dispatch)',
      duration: '02:08',
      audioQuality: 'Static / Gas Mask Breathing',
      transcript: 'Mayday, Mayday! Bay Chem Terminal! Tank line 4 ruptured with detonation! We have an uncontrolled chlorine release drifting southeast! Four workers down inside the transfer dock! One person was caught directly under the blast wall, no signs of life! Everyone needs SCBA gear before entering!',
      acousticEvents: [
        { label: 'Detonation Blast', confidence: 0.99, timestamp: '00:02' },
        { label: 'Gas Leak / Hissing', confidence: 0.94, timestamp: '00:15' },
        { label: 'Severe Stridor / Coughing', confidence: 0.89, timestamp: '00:35' }
      ]
    },
    casualties: [
      {
        id: 'CAS-101',
        name: 'Worker Alpha (Dock Tech)',
        age: '44',
        gender: 'Male',
        triageCategory: 'IMMEDIATE',
        triageCode: 'RED',
        locationInScene: { x: 30, y: 60, width: 18, height: 25 },
        status: 'Severe chemical pneumonitis, copious pulmonary edema, marked cyanosis.',
        respirations: '42 / min, severe wheezing and foaming at mouth',
        perfusion: 'Pulse 146 bpm, SpO2 74% on ambient air',
        mentalStatus: 'Combative, hypoxic agitation (GCS 10)',
        injuries: ['Acute Chlorine Inhalation Toxicity', 'Non-Cardiogenic Pulmonary Edema', '2nd Degree Chemical Cornea Burns'],
        startAlgorithm: { ambulatory: false, breathing: true, rrUnder30: false, perfusionOk: false, mentalStatusOk: false },
        recommendedActions: ['Immediate decontamination zone extraction', 'Endotracheal intubation with PEEP', 'Inhaled bronchodilators & sodium bicarbonate'],
        goldenHourExpirySeconds: 1200,
        assignedHospitalId: 'hosp-2'
      },
      {
        id: 'CAS-102',
        name: 'Worker Bravo (Blast Casualty)',
        age: '29',
        gender: 'Female',
        triageCategory: 'IMMEDIATE',
        triageCode: 'RED',
        locationInScene: { x: 55, y: 70, width: 20, height: 20 },
        status: 'Blown 5 meters by blast wave. Penetrating shrapnel in right upper quadrant.',
        respirations: '32 / min',
        perfusion: 'Pulse 130 bpm, abdomen rigid and distended',
        mentalStatus: 'Lethargic (GCS 11)',
        injuries: ['Penetrating Abdominal Shrapnel', 'Blast Lung Injury', 'Hemorrhagic Shock'],
        startAlgorithm: { ambulatory: false, breathing: true, rrUnder30: false, perfusionOk: false, mentalStatusOk: false },
        recommendedActions: ['Evisceration dressing', 'High-flow O2 without high peak pressures', 'Immediate trauma laparotomy alert'],
        goldenHourExpirySeconds: 1500,
        assignedHospitalId: 'hosp-1'
      },
      {
        id: 'CAS-103',
        name: 'Worker Charlie (Loading Bay Operator)',
        age: '50',
        gender: 'Male',
        triageCategory: 'EXPECTANT',
        triageCode: 'BLACK',
        locationInScene: { x: 75, y: 45, width: 15, height: 20 },
        status: 'Crushed beneath collapsed blast wall section. Apneic, pulseless.',
        respirations: '0 / min',
        perfusion: 'No carotid pulse detected, fixed dilated pupils',
        mentalStatus: 'Unresponsive (GCS 3)',
        injuries: ['Catastrophic Craniocervical Trauma', 'Non-Survivable Traumatic Arrest'],
        startAlgorithm: { ambulatory: false, breathing: false, rrUnder30: false, perfusionOk: false, mentalStatusOk: false },
        recommendedActions: ['Do not compromise live rescue resources', 'Tag as Expectant / Black', 'Preserve scene for coroner investigation'],
        goldenHourExpirySeconds: 0,
        assignedHospitalId: null
      }
    ]
  },
  {
    id: 'mci-subway-cardiac',
    title: 'Powell St. Station Sudden Cardiac Arrest & Platform Crush',
    category: 'Rapid Medical Emergency',
    severity: 'HIGH',
    timeElapsedMinutes: 7,
    goldenHourRemainingMinutes: 53,
    location: {
      address: 'Powell Street BART / Muni Underground Concourse',
      lat: 37.7844,
      lng: -122.4080,
      weather: 'Underground Station, Ambient 70°F',
      trafficCondition: 'Train service suspended on Platform 2'
    },
    sceneOverview: 'Commuter suffered sudden witnessed cardiac arrest on crowded platform, creating crowd surge. Bystanders initiated chest compressions; station AED retrieved.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    hazards: [
      { id: 'h301', type: 'ELECTRICAL', label: 'Third Rail 600V DC Track Hazard', severity: 'CRITICAL', radiusMeters: 5, description: 'Power confirmed de-energized on Track 1.' }
    ],
    audioFeed: {
      caller: 'BART Station Agent #44',
      duration: '01:10',
      audioQuality: 'Station Echo / Intercom Noise',
      transcript: 'Emergency Dispatch! We have a male in his late 50s unresponsive on the downtown platform! A nurse here is doing CPR right now! We have the public AED attached, it is analyzing heart rhythm! We need paramedics down the escalator immediately!',
      acousticEvents: [
        { label: 'CPR Metronome Beep', confidence: 0.95, timestamp: '00:18' },
        { label: 'Public Address Echo', confidence: 0.92, timestamp: '00:05' },
        { label: 'AED Voice Prompt', confidence: 0.88, timestamp: '00:32' }
      ]
    },
    casualties: [
      {
        id: 'CAS-201',
        name: 'Patient Echo (Male Commuter)',
        age: '58',
        gender: 'Male',
        triageCategory: 'IMMEDIATE',
        triageCode: 'RED',
        locationInScene: { x: 48, y: 50, width: 22, height: 28 },
        status: 'Unresponsive, pulseless electrical activity (PEA) converting to Ventricular Fibrillation.',
        respirations: 'Agonal gasps < 4 / min',
        perfusion: 'Carotid pulse absent',
        mentalStatus: 'Unresponsive (GCS 3)',
        injuries: ['Out-of-Hospital Cardiac Arrest (OHCA)', 'Ventricular Fibrillation', 'Severe Cardiogenic Shock'],
        startAlgorithm: { ambulatory: false, breathing: false, rrUnder30: false, perfusionOk: false, mentalStatusOk: false },
        recommendedActions: [
          'Continue high-quality CPR at 100-120 compressions/min (active metronome)',
          'Deliver AED shock if advised',
          'Deploy LUCAS mechanical compression device upon medic arrival',
          'Immediate transport with ECMO-CPR alert to UCSF'
        ],
        goldenHourExpirySeconds: 600,
        assignedHospitalId: 'hosp-2'
      }
    ]
  }
];
