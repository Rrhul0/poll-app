import { updateDoc, doc } from 'firebase/firestore'
import { FormEvent, useState } from 'react'
import { db } from '../lib/firebase'
import { TypePoll } from './polls'

export default function AddMoreOptions({ poll }: { poll: TypePoll }) {
    const [open, setOpen] = useState(false)

    function onSubmitOptions(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        let newOption = new FormData(e.currentTarget).get('option')
        const docu = doc(db, 'polls', poll.id)
        updateDoc(docu, { options: [...poll.options, newOption] }).then(() => {
            setOpen(false)
        })
    }

    return (
        <>
            <button onClick={() => setOpen(true)}>Add more options</button>
            {open ? (
                <div className='absolute inset-0 z-10 grid place-content-center bg-slate-100 bg-opacity-50 backdrop-blur-sm'>
                    <form
                        onSubmit={onSubmitOptions}
                        className={
                            'flex flex-col items-center gap-2 rounded-2xl bg-slate-300 bg-opacity-30 px-20 py-12 backdrop-blur-sm'
                        }
                    >
                        <label>
                            <div>New Option</div>
                            <input name='option' />
                        </label>
                        <button className='rounded-xl bg-purple-500 px-3 py-1 text-slate-100 hover:bg-purple-600'>
                            Add option
                        </button>
                        <button
                            type='button'
                            className='rounded-xl border border-red-500 px-3 py-0.5 text-red-500 hover:bg-red-500 hover:text-white'
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                ''
            )}
        </>
    )
}
