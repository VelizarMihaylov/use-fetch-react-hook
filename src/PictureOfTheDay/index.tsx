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
  url: string | undefined
}

const PictureOfTheDay: React.FC<PictureOfTheDayProps> = (): React.ReactElement => {
  const { loading, data, error, reload, retries, fetchLazy } = useFetch<
    Payload
  >(undefined)
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
  // If the component errored 3 times show message
  if (error && retries > 3) {
    return (
      <>
        <p>Sorry it seems this functionality is not available at the moment</p>
        <p>Please get in touch with our customer support.</p>
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

  // The button that will invoke the lazyFetch and get the image
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
  url: PropTypes.string
}

export default PictureOfTheDay
