export const brand = {
  colors: {
    black: '#000000',
    white: '#ffffff',
    burntOrange: '#E37226',
    brightOrange: '#FE980F',
    solidYellow: '#F4B12E',
    mutedYellow: '#E1B43E',
  },
  fonts: {
    display: "'Rubik', sans-serif",
    body: "'Inter', 'Geist', system-ui, sans-serif",
  },
  /** Chromatic bars — burnt → bright → solid → muted */
  chromatic: ['#E37226', '#FE980F', '#F4B12E', '#E1B43E'] as const,
  /** Abstract geometry — edge framing, kept secondary to type & photography */
  geometry: {
    shapeOpacity: { light: 0.13, dark: 0.34 },
    dotGridOpacity: { light: 0.07, dark: 0.09 },
    bracketColor: { light: '#E37226', dark: '#E1B43E' },
  },
  event: {
    name: 'GUILD SA AI Buildathon 01',
    date: '01 August 2026',
    dateISO: '2026-08-01',
    location: 'Eduvos Menlyn Campus',
    builders: 60,
    teams: 12,
    hours: 72,
    mentors: 10,
    mvps: 12,
    incubation: 2,
  },
  registrationOpenISO: '2026-07-01',
} as const

export type BrandColor = keyof typeof brand.colors
