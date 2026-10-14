import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  Ambulance, 
  Building2, 
  Flame, 
  Compass, 
  ShieldAlert, 
  Send,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';
import { audioEngine } from '../../services/speechService';

// Component to dynamically re-center map on scenario change
function MapCenterController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

// Custom DivIcons for tactical appearance
const createIncidentIcon = () => {
  return L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(239, 68, 68, 0.3); border: 2px solid #ef4444; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #ef4444; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #ef4444;">
          <svg style="width: 14px; height: 14px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const createFleetIcon = (unit) => {
  const isDispatched = unit.status === 'DISPATCHED' || unit.status === 'EN_ROUTE';
  const color = isDispatched ? '#ef4444' : '#3b82f6';
  const bg = isDispatched ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)';

  return L.divIcon({
    className: 'custom-fleet-icon',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 8px; background: ${bg}; border: 1.5px solid ${color};"></div>
        <div style="width: 22px; height: 22px; border-radius: 6px; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">
          🚑
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createHospitalIcon = (hospital) => {
  const isL1 = hospital.badge.includes('LEVEL 1');
  const color = isL1 ? '#a855f7' : '#0ea5e9';

  return L.divIcon({
    className: 'custom-hospital-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 26px; height: 26px; border-radius: 50%; background: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; color: ${color}; font-weight: bold; box-shadow: 0 0 10px ${color}80;">
          <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export default function TacticalMap({
  scenario,
  fleet,
  hospitals,
  onDispatchUnit
}) {
  const incidentCenter = [scenario.location.lat, scenario.location.lng];
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Generate tactical routing coordinates for dispatched units
  const routeLines = fleet
    .filter(u => u.status === 'DISPATCHED' || u.status === 'EN_ROUTE')
    .map(unit => ({
      id: unit.id,
      positions: [
        [unit.lat, unit.lng],
        incidentCenter
      ],
      color: '#ef4444'
    }));

  // Route line from incident to primary Level 1 trauma hospital
  const primaryHospital = hospitals.find(h => h.badge.includes('LEVEL 1')) || hospitals[0];
  const hospitalRoute = primaryHospital
    ? [incidentCenter, [primaryHospital.lat, primaryHospital.lng]]
    : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
      {/* Map Header */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Navigation className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white tracking-wider uppercase">
            Tactical GIS Dispatch & Fleet Telemetry
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
            {fleet.filter(u => u.status === 'DISPATCHED').length} UNITS EN ROUTE
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Incident
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Fleet
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Trauma L1
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-950">
        <MapContainer
          center={incidentCenter}
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <MapCenterController center={incidentCenter} />

          {/* Dark Tactical Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Incident Exclusion Zone Circle */}
          <Circle
            center={incidentCenter}
            radius={200}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '4, 8'
            }}
          />

          {/* Incident Epicenter Marker */}
          <Marker position={incidentCenter} icon={createIncidentIcon()}>
            <Popup>
              <div className="p-1 space-y-1">
                <div className="font-bold text-red-400 text-xs font-mono uppercase">
                  🚨 {scenario.title}
                </div>
                <div className="text-[11px] text-slate-300">
                  {scenario.location.address}
                </div>
                <div className="text-[10px] text-amber-300 font-mono">
                  {scenario.location.trafficCondition}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Fleet Markers */}
          {fleet.map(unit => (
            <Marker
              key={unit.id}
              position={[unit.lat, unit.lng]}
              icon={createFleetIcon(unit)}
            >
              <Popup>
                <div className="p-1.5 space-y-1.5 font-sans min-w-[180px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{unit.callSign}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-blue-500/20 text-blue-300 font-semibold">
                      {unit.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Crew: {unit.crew}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ETA to Scene: ~{unit.etaMinutes} mins
                  </div>
                  {unit.status === 'AVAILABLE' && (
                    <button
                      onClick={() => {
                        audioEngine.playEmergencyTone();
                        audioEngine.speakAnnouncement(`Dispatching ${unit.callSign} to scene.`);
                        onDispatchUnit(unit.id);
                      }}
                      className="w-full mt-1 px-2.5 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-1 shadow"
                    >
                      <Send className="w-3 h-3" /> Dispatch Unit
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hospital Markers */}
          {hospitals.map(h => (
            <Marker
              key={h.id}
              position={[h.lat, h.lng]}
              icon={createHospitalIcon(h)}
            >
              <Popup>
                <div className="p-1.5 space-y-1 min-w-[200px]">
                  <div className="font-bold text-purple-300 text-xs">
                    {h.name}
                  </div>
                  <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 inline-block">
                    {h.badge}
                  </div>
                  <div className="text-[11px] text-slate-300 pt-1 space-y-0.5 font-mono">
                    <div>🛏️ Trauma Bays: <strong className="text-white">{h.traumaBedsAvailable} available</strong></div>
                    <div>🔬 OR Suites: <strong className="text-white">{h.orRoomsReady} ready</strong></div>
                    <div>🩸 O-Neg Blood: <strong className="text-white">{h.bloodBankUnitsONeg} units</strong></div>
                    <div>🚁 Helipad: <strong className="text-emerald-400">{h.helipadStatus}</strong></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Dispatched Unit Routes */}
          {routeLines.map(route => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{
                color: route.color,
                weight: 3,
                dashArray: '6, 8',
                opacity: 0.8
              }}
            />
          ))}

          {/* Hospital Transport Route */}
          {hospitalRoute && (
            <Polyline
              positions={hospitalRoute}
              pathOptions={{
                color: '#a855f7',
                weight: 2.5,
                opacity: 0.6
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Fleet Status Ribbon */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center overflow-x-auto gap-2.5 text-xs">
        {fleet.map(unit => {
          const isEnRoute = unit.status === 'DISPATCHED' || unit.status === 'EN_ROUTE';
          return (
            <div
              key={unit.id}
              className={`px-3 py-2 rounded-xl border flex items-center space-x-2.5 shrink-0 transition ${
                isEnRoute
                  ? 'bg-red-950/40 border-red-500/60 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isEnRoute ? 'bg-red-500 animate-ping' : 'bg-blue-400'}`} />
              <div>
                <div className="font-bold text-white text-xs">{unit.callSign}</div>
                <div className="text-[10px] font-mono text-slate-400">
                  {unit.status} • ETA {unit.etaMinutes}m
                </div>
              </div>
              {unit.status === 'AVAILABLE' && (
                <button
                  onClick={() => {
                    audioEngine.playEmergencyTone();
                    audioEngine.speakAnnouncement(`Dispatching ${unit.callSign}`);
                    onDispatchUnit(unit.id);
                  }}
                  className="ml-1 px-2 py-1 text-[10px] font-bold rounded bg-red-600 hover:bg-red-500 text-white font-mono uppercase"
                >
                  Send
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
