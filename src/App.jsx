import MainRoute from './Router/MainRoute'
import { BrowserRouter } from 'react-router'

function App() {
  return (
    <>
      <BrowserRouter>
        <MainRoute />
      </BrowserRouter>
    </>
  )
}

export default App
