import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import StudentHelp from './pages/StudentHelp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="student-help" element={<StudentHelp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
