import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { assetRegistry, templateCount } from '../../data/assetRegistry'
import { brand } from '../../data/brand'
import { brandAssets } from '../../utils/assetPaths'

const nav = [
  { to: '/', label: 'Dashboard', shortLabel: 'Home' },
  { to: '/gallery', label: 'Asset Gallery', shortLabel: 'Gallery' },
  { to: '/timeline', label: 'Campaign Timeline', shortLabel: 'Timeline' },
]

function NavItems({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  return (
    <>
      {nav.map(({ to, label, shortLabel }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `${mobile ? 'block w-full px-4 py-3 text-base' : 'px-3 py-2 text-sm'} rounded-md font-medium transition ${
              isActive
                ? 'bg-[#E37226] text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`
          }
        >
          <span className="md:hidden">{shortLabel}</span>
          <span className="hidden md:inline">{label}</span>
        </NavLink>
      ))}
    </>
  )
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <img
              src={brandAssets.guildWhite}
              alt="GUILD SA"
              className="h-7 w-auto shrink-0 object-contain sm:h-8"
            />
            <div className="min-w-0">
              <p className="hidden truncate text-[10px] uppercase tracking-[0.18em] text-zinc-500 min-[375px]:block">
                Marketing Asset Hub
              </p>
            </div>
          </div>

          <nav className="hidden shrink-0 gap-1 md:flex">
            <NavItems />
          </nav>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-700 text-zinc-300 transition hover:border-zinc-500 hover:text-white md:hidden"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-zinc-800 px-2 py-2 md:hidden">
            <NavItems mobile onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-900 px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center text-[10px] leading-relaxed text-zinc-600 sm:text-xs">
        {assetRegistry.length} campaign assets · {templateCount} unique templates · AI Buildathon 01 ·{' '}
        {brand.event.date}
      </footer>
    </div>
  )
}
