import React from 'react'
import './App.scss'

import PictureOfTheDay from './PictureOfTheDay'

const App: React.FC = () => {
  return (
    <div className="App">
      <PictureOfTheDay url="http://dummy.restapiexample.com/api/v1/employee/1" />
    </div>
  )
}

export default App
