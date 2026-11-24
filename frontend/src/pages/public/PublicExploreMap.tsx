import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../../api/client';
import { Issue, PilotProject } from '../../types';
import { MapPin, Filter, Sparkles, Building2, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

// Marker Icons by status
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(15,23,42,0.35);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const iconSubmitted = createIcon('#64748b'); // slate
const iconTriaged = createIcon('#a855f7');   // purple
const iconChallenge = createIcon('#0284c7'); // blue
const iconPilot = createIcon('#10b981');     // emerald
const iconResolved = createIcon('#059669');  // dark emerald

export const PublicExploreMap: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pilots, setPilots] = useState<PilotProject[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/issues'),
      api.get('/pilots')
    ])
      .then(([issuesRes, pilotsRes]) => {
        setIssues(issuesRes.data);
        setPilots(pilotsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case 'AI_ANALYZED': return iconTriaged;
      case 'CHALLENGE_FORMULATED':
      case 'UNDER_STUDENT_DEV':
      case 'PROTOTYPE_SUBMITTED':
      case 'EVALUATED': return iconChallenge;
      case 'IN_PILOT': return iconPilot;
      case 'RESOLVED': return iconResolved;
      default: return iconSubmitted;
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === 'ALL') return true;
    if (filter === 'TRIAGED') return issue.status === 'AI_ANALYZED';
    if (filter === 'CHALLENGES') return ['CHALLENGE_FORMULATED', 'UNDER_STUDENT_DEV', 'PROTOTYPE_SUBMITTED'].includes(issue.status);
    if (filter === 'PILOTS') return issue.status === 'IN_PILOT';
    if (filter === 'RESOLVED') return issue.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      {/* Floating Header Control Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20 shadow-card">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center text-teal-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-navy-950 tracking-tight">Smart City Problem & Pilot Map</h2>
            <p className="text-[11px] text-slate-500">Live GIS visualization of municipal challenges and student field deployments</p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold ml-2 border border-slate-200">
            {filteredIssues.length} Pins Active
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center space-x-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {[
            { id: 'ALL', label: 'All Issues' },
            { id: 'TRIAGED', label: 'AI Triaged' },
            { id: 'CHALLENGES', label: 'Active Challenges' },
            { id: 'PILOTS', label: 'Field Pilots' },
            { id: 'RESOLVED', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === f.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center space-x-4 text-[11px] text-slate-600">
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span><span>Reported</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span><span>AI Triaged</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span><span>Student Challenge</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span><span>Field Pilot</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span><span>Resolved</span></span>
        </div>
      </div>

      {/* Map Surface */}
      <div className="flex-1 w-full relative">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredIssues.map(issue => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={getMarkerIcon(issue.status)}
            >
              <Popup>
                <div className="space-y-2 p-1 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {issue.category || 'CIVIC ISSUE'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-navy-950 leading-tight">{issue.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{issue.description}</p>
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{issue.address || issue.city}</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
