import { h, render } from 'preact' // eslint-disable-line no-unused-vars
import App from './components/App'
import createStore from './store/createStore'
import { fetchInitialState, updateLocation } from './store/actions/ActionCreators'
import { getUrl } from './store/selectors/meta'
import ensurePolyfills from './utils/ensurePolyfills'

const app = document.getElementById('app')

ensurePolyfills(() => {
  const store = createStore(window.__STATE__, window.fetch)
  window.addEventListener('popstate', (e) => {
    store.dispatch(updateLocation(window.location.pathname + window.location.search))
  })
  store.subscribe(() => {
    const url = getUrl(store.getState())
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url)
    }
  })
  store.dispatch(updateLocation(window.location.pathname + window.location.search))
  store.dispatch(fetchInitialState())
  render(<App store={store} />, app, app.lastChild)
})
