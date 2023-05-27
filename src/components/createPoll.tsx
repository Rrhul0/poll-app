import { addDoc, serverTimestamp, documentId } from 'firebase/firestore'
import { FormEvent } from 'react'
import { pollsDB } from '../lib/firebase'

export default function CreatePoll() {
    function onSubmitForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('poll_name'),
            desc: formData.get('poll_desc'),
            options: [formData.get('option1'), formData.get('option2')],
            timestamp: serverTimestamp(),
        }
        addDoc(pollsDB, data)
    }
    return (
        <>
            <form onSubmit={onSubmitForm} className='flex flex-col gap-2'>
                <label>
                    <span>Poll Name: </span>
                    <input name='poll_name' placeholder='Name' />
                </label>
                <label className='flex flex-col'>
                    <div>Poll Description</div>
                    <textarea name='poll_desc' />
                </label>
                <label>
                    <span>Option 1: </span>
                    <input name='option1' />
                </label>
                <label>
                    <span>Option 2: </span>
                    <input name='option2' />
                </label>
                <button>Create</button>
            </form>
        </>
    )
}
