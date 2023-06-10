import { addDoc, serverTimestamp } from 'firebase/firestore'
import { FormEvent, useState } from 'react'
import { auth, pollsDB, realtimeVotesDB } from '../lib/firebase'
import { toast } from 'react-toastify'
import ToastNotLoggedIn from './toastNotLoggedIn'
import { ref, set } from 'firebase/database'

export default function CreatePoll({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [options, setOptions] = useState<number>(2)

    function onSubmitForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!auth.currentUser) {
            toast(<ToastNotLoggedIn />)
            return
        }

        const formData = new FormData(e.currentTarget)
        const name = formData.get('poll_name')
        const desc = formData.get('poll_desc')

        if (!name) {
            toast('Poll Name not Found!')
            return
        }
        if (!desc) {
            toast('Poll Description not Found!')
            return
        }
        let optionsData = []
        for (let index = 0; index < options; index++) {
            const val = formData.get('option' + index)
            if (!val) {
                toast('Option values are not filled!')
                return
            }
            optionsData.push(formData.get('option' + index))
        }

        const data = {
            name,
            desc,
            options: optionsData,
            timestamp: serverTimestamp(),
        }

        addDoc(pollsDB, data).then(e => {
            toast(`${name} Poll added`)
            const totalRef = ref(realtimeVotesDB, 'poll-' + e.id)
            set(totalRef, Array(optionsData.length).fill(0))
            setOpen(false)
        })
    }

    return (
        <>
            <form onSubmit={onSubmitForm} className='z-40 flex w-1/3 flex-col gap-2 rounded-xl bg-white p-6 text-black'>
                <label>
                    <span>Poll Name </span>
                    <input
                        autoFocus
                        name='poll_name'
                        placeholder='Name'
                        className='w-full rounded border border-blue-400 pl-2'
                    />
                </label>
                <label className='flex flex-col'>
                    <div>Poll Description </div>
                    <textarea name='poll_desc' className='rounded border border-blue-400 pl-2' />
                </label>
                {Array(options)
                    .fill(0)
                    .map((_, index) => (
                        <label key={index}>
                            <span>Option {index + 1} </span>
                            <input name={'option' + index} className='w-full rounded border border-blue-400 pl-2' />
                        </label>
                    ))}
                <button type='button' className='self-start text-blue-500' onClick={() => setOptions(o => (o += 1))}>
                    + Add more options
                </button>
                <div className='flex w-full justify-end gap-5 pt-4'>
                    <button
                        onClick={() => setOpen(false)}
                        type='button'
                        className='rounded-lg bg-red-500 px-6 py-2 text-slate-200 hover:bg-red-600'
                    >
                        Cancel
                    </button>
                    <button className='rounded-lg  border border-blue-500 px-6 py-2 duration-200 hover:bg-blue-500'>
                        Create
                    </button>
                </div>
            </form>
        </>
    )
}
