import CreatePoll from './components/createPoll'
import Header from './components/header'
import Polls from './components/polls'

function App() {
    return (
        <main className='min-w-screen min-h-screen bg-slate-200'>
            <Header />
            <div className='p-6'>
                <Polls />
            </div>
            <CreatePoll />
        </main>
    )
}

export default App
