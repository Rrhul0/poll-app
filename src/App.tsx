import CreatePoll from './components/createPoll'
import Polls from './components/polls'

function App() {
    return (
        <main className='p-4 bg-slate-200 min-h-screen min-w-screen'>
            <Polls />
            <CreatePoll />
        </main>
    )
}

export default App
