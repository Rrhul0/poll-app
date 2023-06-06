import { ToastContainer } from 'react-toastify'
import Header from './components/header'
import Polls from './components/polls'
import 'react-toastify/dist/ReactToastify.min.css'

function App() {
    return (
        <main className='min-w-screen min-h-screen bg-slate-200'>
            <Header />
            <div className='p-6'>
                <Polls />
            </div>
            <ToastContainer />
        </main>
    )
}

export default App
