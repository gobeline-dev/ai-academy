import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import AchievementToast from './components/AchievementToast.jsx'
import Home from './pages/Home.jsx'
import ModulesPage from './pages/ModulesPage.jsx'
import ModulePage from './pages/ModulePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import MapPage from './pages/MapPage.jsx'
import PyramidPage from './pages/PyramidPage.jsx'
import { useProgress } from './hooks/useProgress.js'
import { useTheme } from './hooks/useTheme.js'
import modules from './data/modules.json'

export default function App() {
  const progressHook = useProgress(modules)
  const { newlyUnlocked, shiftNewlyUnlocked } = progressHook
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header modules={modules} progressHook={progressHook} theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1 }}>
        <div key={location.pathname} className="page-transition">
          <Routes>
            <Route path="/"                                    element={<Home modules={modules} progressHook={progressHook} />} />
            <Route path="/modules"                             element={<ModulesPage modules={modules} progressHook={progressHook} />} />
            <Route path="/module/:slug"                        element={<ModulePage modules={modules} progressHook={progressHook} />} />
            <Route path="/module/:slug/lesson/:lessonId"       element={<LessonPage modules={modules} progressHook={progressHook} />} />
            <Route path="/module/:slug/quiz"                   element={<QuizPage modules={modules} progressHook={progressHook} />} />
            <Route path="/module/:slug/flashcards"             element={<FlashcardsPage modules={modules} />} />
            <Route path="/module/:slug/map"                    element={<MapPage modules={modules} />} />
            <Route path="/parcours"                            element={<PyramidPage modules={modules} progressHook={progressHook} />} />
            <Route path="/achievements"                        element={<AchievementsPage modules={modules} progressHook={progressHook} />} />
          </Routes>
        </div>
      </main>
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <span>AI Academy © 2026 — </span>
        <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          L'IA expliquée de A à Z
        </span>
      </footer>

      <AchievementToast newlyUnlocked={newlyUnlocked} onShift={shiftNewlyUnlocked} />
    </div>
  )
}
