export const INITIAL_FLEET = [
  {
    id: 'unit-med-11',
    callSign: 'Medic 11 (ALS)',
    unitType: 'ALS_AMBULANCE',
    badge: 'ALS PARAMEDIC',
    crew: '2x Paramedic (Critical Care)',
    status: 'AVAILABLE', // AVAILABLE | DISPATCHED | EN_ROUTE | AT_SCENE | TRANSPORTING
    lat: 37.7650,
    lng: -122.4200,
    etaMinutes: 3,
    equipment: ['Lifepak 15 Monitor/Defib', 'Video Laryngoscope', 'RSI Meds', 'TXA & FFP'],
    assignedPatientId: null,
    targetLocation: null
  },
  {
    id: 'unit-med-04',
    callSign: 'Medic 04 (ALS)',
    unitType: 'ALS_AMBULANCE',
    badge: 'ALS PARAMEDIC',
    crew: '2x Paramedic',
    status: 'AVAILABLE',
    lat: 37.7720,
    lng: -122.3980,
    etaMinutes: 5,
    equipment: ['LUCAS Chest Compression System', 'Lifepak Defib', 'Rapid IV Infuser'],
    assignedPatientId: null,
    targetLocation: null
  },
  {
    id: 'unit-rescue-02',
    callSign: 'Rescue 02 (Heavy Extrication)',
    unitType: 'HEAVY_RESCUE',
    badge: 'HAZMAT / EXTRICATION',
    crew: '4x Technical Rescue Specialists',
    status: 'AVAILABLE',
    lat: 37.7580,
    lng: -122.4120,
    etaMinutes: 4,
    equipment: ['Hydraulic Cutters & Spreaders (Jaws of Life)', 'Air Lifting Bags', 'Thermal Imaging HUD', 'Level A SCBA Suits'],
    assignedPatientId: null,
    targetLocation: null
  },
  {
    id: 'unit-lifeflight-1',
    callSign: 'LifeFlight 1 (Medevac)',
    unitType: 'AIR_AMBULANCE',
    badge: 'CRITICAL AIR TRANSPORT',
    crew: '1x Flight Nurse, 1x Flight Paramedic, 1x Pilot',
    status: 'STANDBY',
    lat: 37.7250,
    lng: -122.3780,
    etaMinutes: 8,
    equipment: ['Blood Products Onboard (4u PRBC/FFP)', 'Transport Ventilator', 'Sonosite Ultrasound'],
    assignedPatientId: null,
    targetLocation: null
  },
  {
    id: 'unit-eng-14',
    callSign: 'Engine 14 (Suppression)',
    unitType: 'FIRE_SUPPRESSION',
    badge: 'FIRE ATTACK / EMT',
    crew: '1x Captain, 3x Firefighter EMTs',
    status: 'DISPATCHED',
    lat: 37.7530,
    lng: -122.4080,
    etaMinutes: 2,
    equipment: ['1,000 Gallon Water Tank', 'Class B Foam System', 'Vehicle Stabilization Struts'],
    assignedPatientId: null,
    targetLocation: null
  }
];
