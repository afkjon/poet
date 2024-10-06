import { FirebaseProvider } from './providers/FirebaseProvider'
import './App.css'
import BoardList from './components/BoardList'
import Footer from './components/Footer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryProvider = new QueryClient()

  return (
    <FirebaseProvider>
      <QueryClientProvider client={queryProvider}>
        <BoardList />
        <Footer />
      </QueryClientProvider>
    </FirebaseProvider>
  )
}

export default App
