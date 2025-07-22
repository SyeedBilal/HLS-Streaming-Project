import { useState } from 'react'

import VideoUpload from './VideoUpload'

import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { AuthProvider } from './AuthContext'
import LoginButton from './LoginButton'
import UserProfile from './UserProfile'


function App() {
  

  return (


       <AuthProvider>

    <BrowserRouter>
  
  <Routes >
    <Route path='/' element={<LoginButton />} />
    <Route path="/videoUpload" element={<VideoUpload />} />
    <Route path ="/player" element={<VideoPlayer />} />
    <Route path='/dashboard' element={<UserProfile />} />

  </Routes>
 
   
     </BrowserRouter>
      </AuthProvider>

    
  )
}

export default App