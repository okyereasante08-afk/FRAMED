export const PROJECTS = [
  { id: 'p-01', title: 'Modular Drone Chassis', track: 'cad', trackLabel: 'CAD', category: 'mechanical', year: '2026', blurb: 'Parametric quad-rotor frame designed for rapid field repair — snap-fit arms, tool-less battery swap.', tags: ['SolidWorks', 'Sheet Metal', 'FDM Print'] },
  { id: 'p-02', title: 'Cooling Duct — EV Battery Pack', track: 'cfd', trackLabel: 'CFD', category: 'automobile', year: '2026', blurb: 'Airflow-optimized duct geometry cutting peak cell temperature by simulated thermal load reduction.', tags: ['ANSYS Fluent', 'Thermal', 'Automotive'] },
  { id: 'p-03', title: 'Cantilever Bracket — Fatigue Study', track: 'cae', trackLabel: 'CAE', category: 'mechanical', year: '2025', blurb: 'Topology-optimized load bracket validated against cyclic fatigue before a single unit was machined.', tags: ['FEA', 'Topology Opt.', 'Aluminum 6061'] },
  { id: 'p-04', title: 'Campus Innovation Pavilion', track: 'cad', trackLabel: 'CAD', category: 'housing', year: '2025', blurb: 'Timber-frame pavilion concept for a student maker space, modeled for full architectural walkthrough.', tags: ['Architecture', 'Revit', 'WebXR Ready'] },
  { id: 'p-05', title: 'Wind-Tunnel Fairing Study', track: 'cfd', trackLabel: 'CFD', category: 'automobile', year: '2025', blurb: 'Iterative fairing shape refinement chasing lower drag coefficient across a swept speed range.', tags: ['OpenFOAM', 'Aerodynamics'] },
  { id: 'p-06', title: 'Gearbox Housing — Stress Envelope', track: 'cae', trackLabel: 'CAE', category: 'mechanical', year: '2024', blurb: 'Full stress-envelope mapping across the operating range, catching a resonance mode before prototyping.', tags: ['Modal Analysis', 'FEA'] },
]

export const TRACK_META = {
  cad: { label: 'CAD', full: 'Computer-Aided Design' },
  cfd: { label: 'CFD', full: 'Computational Fluid Dynamics' },
  cae: { label: 'CAE', full: 'Computer-Aided Engineering' },
}

export const CATEGORY_META = {
  housing: { label: 'Housing' },
  automobile: { label: 'Automobile' },
  mechanical: { label: 'Mechanical' },
  plastics: { label: 'Plastics' },
  molds: { label: 'Molds' },
}
