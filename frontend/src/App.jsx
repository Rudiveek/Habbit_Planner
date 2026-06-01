import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Progress from './pages/Progress'
import HabitDetails from './pages/HabitDetails'

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/habit/:id" element={<HabitDetails />} />
      </Routes>
    </div>
  )
}

export default App