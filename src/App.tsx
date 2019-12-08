import React from 'react'
import './App.scss'

import PictureOfTheDay from './PictureOfTheDay'

const App: React.FC = () => {
  return (
    <div className="App">
      <PictureOfTheDay url="https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY" />
    </div>
  )
}

export default App
