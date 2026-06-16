import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { GalleryPage } from './pages/GalleryPage'
import { TimelinePage } from './pages/TimelinePage'
import { AssetDetailPage } from './pages/AssetDetailPage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="assets/:id" element={<AssetDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
