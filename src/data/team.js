// Team roster. Swap `photo` for a real image path once uploaded
// (e.g. /team/name.jpg dropped into /public/team/) and it'll replace
// the placeholder avatar automatically -- see TeamCard's fallback logic.

export const TEAM = [
  {
    id: 't-01',
    name: 'Kwame Asante Okyere',
    role: 'Founder / Lead CAD',
    track: 'cad',
    photo: null,
    specialty: 'Parametric Modeling',
    weakness: 'Waking up before 11 AM',
    level: 'LV. 4',
    stats: { cad: 88, cfd: 52, cae: 61, speed: 74 },
    handles: [
      { label: 'GitHub', url: 'https://github.com/okyereasante08-afk' },
    ],
  },
  {
    id: 't-02',
    name: 'Ama Serwaa',
    role: 'Fluid Dynamics Lead',
    track: 'cfd',
    photo: null,
    specialty: 'Wind-Tunnel Simulation',
    weakness: 'Explaining Navier–Stokes to non-engineers',
    level: 'LV. 5',
    stats: { cad: 60, cfd: 91, cae: 68, speed: 65 },
    handles: [
      { label: 'LinkedIn', url: '#' },
    ],
  },
  {
    id: 't-03',
    name: 'Kojo Mensah',
    role: 'Structural / CAE',
    track: 'cae',
    photo: null,
    specialty: 'Fatigue & Failure Analysis',
    weakness: 'Over-engineering things that were already fine',
    level: 'LV. 4',
    stats: { cad: 55, cfd: 58, cae: 89, speed: 70 },
    handles: [
      { label: 'LinkedIn', url: '#' },
    ],
  },
  {
    id: 't-04',
    name: 'Efua Boateng',
    role: 'Rapid Prototyping',
    track: 'cad',
    photo: null,
    specialty: 'Additive Manufacturing',
    weakness: 'Print bed adhesion, every single time',
    level: 'LV. 3',
    stats: { cad: 79, cfd: 40, cae: 48, speed: 92 },
    handles: [
      { label: 'Instagram', url: '#' },
    ],
  },
]
