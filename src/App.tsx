import React from 'react'
import {Routes, Route} from 'react-router-dom'
import {RecoilRoot} from 'recoil'

// Consts
import {DRAWER_WIDTH} from './Const/App'

// Pages
import Dashboard from './Pages/Dashboard'
import Title from './Pages/Title'
import Alt from './Pages/Alt'
import Headline from './Pages/Headline'

// Components
import Box from '@mui/material/Box'
import Navigation from './Components/Navigation'
import Toolbar from '@mui/material/Toolbar'

const App: React.FunctionComponent = () => {
  return (
    <RecoilRoot>
      <Box sx={{display: 'flex'}}>
        <Navigation />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}
        >
          <Toolbar sx={{display: {xs: 'block', sm: 'none'}}} />

          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/title" element={<Title />} />
            <Route path="/alt" element={<Alt />} />
            <Route path="/headline" element={<Headline />} />
          </Routes>
        </Box>
      </Box>
    </RecoilRoot>
  )
}

export default App
