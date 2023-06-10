import { useState } from 'react'
import CreatePoll from './createPoll'

export default function CreatePollDialog() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button onClick={() => setOpen(true)}>Create New Poll</button>
            <div
                className={`absolute inset-0 z-10 grid place-items-center bg-slate-400 bg-opacity-25 backdrop-blur-sm ${
                    open ? 'block' : 'hidden'
                }`}
            >
                {open && <CreatePoll setOpen={setOpen} />}
            </div>
        </>
    )
}
