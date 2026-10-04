// Real team roster. `status` is one of: 'online', 'offline',
// 'open-to-work', 'occupied' -- drives the colored status dot and
// label shown on each card and in the detail panel.
export const TEAM = [
  {
    id: 'turibius-nyaaba',
    name: 'Turibius Nyaaba',
    role: 'Product Design Engineer',
    specialties: ['CAD/CAM', 'CFD', 'CAE'],
    photo: '/team/turibius.jpg',
    status: 'online',
    linkedin: 'https://www.linkedin.com/in/turibius-nyaaba/',
    email: 'nyaabaturibius@gmail.com',
  },
  {
    id: 'josephkerry-kwadzokpo',
    name: 'Josephkerry (Edinam) Kwadzokpo',
    role: 'Biomedical Engineer',
    specialties: ['EDA/PCB Design', 'CAD', 'Research & Development'],
    photo: '/team/jkerry.jpg',
    status: 'open-to-work',
    linkedin: 'https://www.linkedin.com/in/joseph-kerry/',
    email: 'josephkerrypedia@gmail.com',
  },
]

export const STATUS_META = {
  'online': { label: 'Online', color: '#2f56c9' },
  'offline': { label: 'Offline', color: '#6a80a3' },
  'open-to-work': { label: 'Open to work', color: '#1a8f5c' },
  'occupied': { label: 'Occupied', color: '#a66c16' },
}
