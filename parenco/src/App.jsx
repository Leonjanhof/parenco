import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Inpakstraat from './pages/Inpakstraat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/inpakstraat" element={<Inpakstraat />} />
      </Routes>
    </Router>
  )
}

export default App
