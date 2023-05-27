import CreatePoll from './components/createPoll'
import Polls from './components/polls'

function App() {
    return (
        <main className='min-w-screen min-h-screen bg-slate-200 p-6'>
            <Polls />
            <CreatePoll />
        </main>
    )
}

export default App
