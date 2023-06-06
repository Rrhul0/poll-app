import { addDoc, serverTimestamp } from 'firebase/firestore'
import { FormEvent, useState } from 'react'
import { auth, pollsDB, realtimeVotesDB } from '../lib/firebase'
import { toast } from 'react-toastify'
import ToastNotLoggedIn from './toastNotLoggedIn'
import { ref, set } from 'firebase/database'

export default function CreatePoll() {
    const [options, setOptions] = useState<number>(2)
    const [showForm, setShowForm] = useState(false)

    function onSubmitForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!auth.currentUser) {
            toast(<ToastNotLoggedIn />)
            return
        }

        const formData = new FormData(e.currentTarget)
        let optionsData = []
        for (let index = 0; index < options; index++) {
            optionsData.push(formData.get('option' + index))
        }
        const name = formData.get('poll_name')
        const data = {
            name,
            desc: formData.get('poll_desc'),
            options: optionsData,
            timestamp: serverTimestamp(),
        }

        addDoc(pollsDB, data).then(e => {
            toast(`${name} Poll added`)
            const totalRef = ref(realtimeVotesDB, 'poll-' + e.id)
            set(totalRef, Array(optionsData.length).fill(0))
        })
    }

    return (
        <>
            <button
                onClick={() => setShowForm(true)}
                className='rounded px-2 py-0.5 text-lg text-blue-500 duration-200 hover:bg-purple-200'
            >
                Create A Poll
            </button>
            {showForm && (
                <form
                    onSubmit={onSubmitForm}
                    className=' absolute right-2 top-16 z-50 flex flex-col gap-2 rounded-xl bg-slate-700 bg-opacity-70 px-3 py-2 backdrop-blur-sm'
                >
                    <label>
                        <span>Poll Name </span>
                        <input name='poll_name' placeholder='Name' className='w-full rounded pl-2' />
                    </label>
                    <label className='flex flex-col'>
                        <div>Poll Description </div>
                        <textarea name='poll_desc' className='rounded pl-2' />
                    </label>
                    {Array(options)
                        .fill(0)
                        .map((_, index) => (
                            <label key={index}>
                                <span>Option {index + 1} </span>
                                <input name={'option' + index} className='w-full rounded pl-2' />
                            </label>
                        ))}
                    <button type='button' onClick={() => setOptions(o => (o += 1))}>
                        Add more options
                    </button>
                    <div className='flex w-full justify-between px-4'>
                        <button
                            onClick={() => setShowForm(false)}
                            type='button'
                            className='rounded bg-red-500 px-2 py-0.5 text-slate-200 hover:bg-red-600'
                        >
                            Cancel
                        </button>
                        <button className='rounded border border-blue-500 px-2 py-0.5 duration-200 hover:bg-blue-500'>
                            Create
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}
