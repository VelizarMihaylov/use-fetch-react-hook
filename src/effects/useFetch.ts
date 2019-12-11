import { useReducer, useEffect, useState, Reducer } from 'react'

/**
 * @type {Action}
 * This type will represent the
 * action our reducer takes.
 * It has two params the action
 * `type` and the payload we expect
 *  to receive from the endpoint.
 * We are using a discriminated union type
 * for the action to make sure we are
 * covering all possible action types
 * our reducer will accept
 */

type Action<P> =
  | { type: 'FETCH_INIT' }
  | {
      type: 'FETCH_SUCCESS'
      payload: P
    }
  | {
      type: 'FETCH_FAILURE'
    }

/**
 *
 * @type {State}
 * This type is the initial
 * state our reducer expects.
 * It hold all the possible
 * states our app can be in
 * durning the fetch.
 */

type State<P> = {
  loading: boolean
  data: null | P
  error: boolean
}

/**
 * @function dataFetchReducer
 * Our fetch reducer
 */
const dataFetchReducer = <P>(state: State<P>, action: Action<P>): State<P> => {
  /**
   * The reducer will handle
   * the three cases based on
   * the action type it receives
   */
  switch (action.type) {
    // The initial loading state
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true
      }
    // We successfully received the data
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload
      }
    // The fetch failed
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: true
      }
    /**
     * If we don't receive an expected action
     * we assume it's a developer mistake
     * and we will throw an error asking them
     * to fix that
     */
    default:
      throw new Error(
        `Unknown action type received 
        for dataFetchReducer.
        Please make sure you are passing
        one of the following actions:
          * FETCH_INIT
          * FETCH_SUCCESS
          * FETCH_FAILURE
          :`
      )
  }
}

/**
 * We need to tweak the return type of
 * the useFetch hook to accommodate
 * for the retry method we are
 * gonna return
 */
type useFetchResult<P> = {
  loading: boolean
  data: null | P
  error: boolean
  reload: () => void
  fetchLazy: (url: string) => void
}

const useFetch = <P>(url: undefined | string): useFetchResult<P> => {
  /**
   * Here we are making use
   * of the useReducer hook
   * The hook accepts our reducer
   * we defined earlier and the
   * initial state of our app
   */
  const initialState = {
    loading: false,
    data: null,
    error: false
  }
  const [state, dispatch] = useReducer<Reducer<State<P>, Action<P>>>(
    dataFetchReducer,
    initialState
  )

  /**
   * We are gonna use useState to force re render
   * the component that contains our useFetch hook
   * the re render will trigger the fetch and we will
   * get the latest data from the endpoint
   */
  const [reload, setReload] = useState<number>(0)
  /**
   * We are gonna use state to set the fetch link
   * the initial value will be the url that the hook
   * is called with a string or undefined value.
   */
  const [link, setLink] = useState<undefined | string>(url)
  /**
   * Since fetching data is a side effect
   * for our React app it is a good idea
   * to keep it in the useEffect hook
   */
  useEffect(() => {
    if (link) {
      // Start fetching and fire up the loading state
      dispatch({ type: 'FETCH_INIT' })
      fetch(link)
        .then(response => {
          return response.json()
        })
        .then((data: P) => {
          // We got the data so lets add it to the state
          dispatch({ type: 'FETCH_SUCCESS', payload: data })
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            // The user aborted the fetch
            console.log('User aborted the fetch')
          } else {
            // Something actually went wrong trigger the error state
            console.log('ERROR', error.name)
            dispatch({ type: 'FETCH_FAILURE' })
          }
        })
    }
    /**
     * We are adding the reload state to
     * the array of dependencies for useEffect
     * since reload will be a new number every
     * time it's set we can be sure that the
     * fetch will be triggered when the retry
     * method is called
     */
  }, [link, reload])

  return {
    ...state,
    reload: (): void => {
      setReload(reload + 1)
    },
    /**
     * We are adding a new fetchLazy method
     * to the return value of our hook.
     * This method will accept a fetch url and
     * will trigger a fetch action.
     */
    fetchLazy: (url: string): void => {
      setLink(url)
    }
  }
}

export default useFetch
