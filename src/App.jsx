import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import TodayView from '@/components/pages/TodayView'
import ProjectView from '@/components/pages/ProjectView'
import UpcomingView from '@/components/pages/UpcomingView'
import SearchView from '@/components/pages/SearchView'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TodayView />} />
            <Route path="today" element={<TodayView />} />
            <Route path="upcoming" element={<UpcomingView />} />
            <Route path="project/:projectId" element={<ProjectView />} />
            <Route path="search" element={<SearchView />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App