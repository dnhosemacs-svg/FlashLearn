import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CollectionsPage from './pages/CollectionsPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import StudyPage from './pages/StudyPage.tsx'
import CollectionDetailPage from './pages/CollectionDetailPage.tsx'
import { CollectionsProvider } from './context/CollectionsContext'
import { FlashcardsProvider } from './context/FlashcardsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CollectionsProvider>
        <FlashcardsProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="study" element={<StudyPage />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="collections/:collectionId" element={<CollectionDetailPage />} />
            </Route>
          </Routes>
        </FlashcardsProvider>
      </CollectionsProvider>
    </BrowserRouter>
  </StrictMode>,
)
