import React from 'react'
import PropTypes from 'prop-types'

import useFetch from '../effects/useFetch'
/**
 * @type {Payload}
 * Typing the data
 * we are expecting to
 * receive from the end point
 */
type Payload = {
  date: string
  title: string
  explanation: string
  url: string
}

// Adding a type for PictureOfTheDay props
type PictureOfTheDayProps = {
  url: string
}

const PictureOfTheDay: React.FC<PictureOfTheDayProps> = ({
  url
}): React.ReactElement => {
  const { loading, data, reload, error, fetchLazy } = useFetch<Payload>(
    undefined
  )
  if (loading) {
    return (
      <>
        <h1>...Loading</h1>
      </>
    )
  }

  if (data) {
    const { title, date, explanation, url } = data
    return (
      <>
        <img src={url} style={{ width: '100%', maxWidth: 600 }} alt={title} />
        <span>Date: {date}</span>
        <h1>{title}</h1>
        <p>{explanation}</p>
        <button
          onClick={(): void => {
            console.log('RELOAD', reload())
          }}
        >
          Reload
        </button>
      </>
    )
  }

  // If not loading or received data show error message
  if (error) {
    return (
      <>
        <h1>Oops something went wrong!</h1>
        <button onClick={(): void => reload()}>Retry</button>
      </>
    )
  }
  return (
    <button
      onClick={(): void => {
        fetchLazy('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      }}
    >
      Get Picture
    </button>
  )
}

//Making sure that the url prop will be set
PictureOfTheDay.propTypes = {
  url: PropTypes.string.isRequired
}

export default PictureOfTheDay
