import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@carbon/styles/css/styles.css'
import './index.css'
import App from './App.tsx'
import CollectionsPage from './pages/CollectionsPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import StudyPage from './pages/StudyPage.tsx'
import CollectionDetailPage from './pages/CollectionDetailPage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import { CollectionsProvider } from './context/CollectionsContext'
import { FlashcardsProvider } from './context/FlashcardsContext'
import { Theme } from '@carbon/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter + providers globales inicializan contexto y rutas de toda la app. */}
    <BrowserRouter>
      <Theme theme="g10">
        <CollectionsProvider>
          <FlashcardsProvider>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="study" element={<StudyPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="collections/:collectionRef" element={<CollectionDetailPage />} />
              </Route>
            </Routes>
          </FlashcardsProvider>
        </CollectionsProvider>
      </Theme>
    </BrowserRouter>
  </StrictMode>,
)
