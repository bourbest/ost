import React from 'react'

// components
import Routes from './routes'
import NavBar from './containers/components/NavBar'

function App(props) {
  return (
    <div>
      <NavBar />
      <Routes />
    </div>
  )
}

export default App