import { addDoc, serverTimestamp, documentId } from 'firebase/firestore'
import { FormEvent, useState } from 'react'
import { pollsDB } from '../lib/firebase'

export default function CreatePoll() {
    const [options, setOptions] = useState<number>(2)

    function onSubmitForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        let optionsData = []
        for (let index = 0; index < options; index++) {
            optionsData.push(formData.get('option' + index))
        }
        const data = {
            name: formData.get('poll_name'),
            desc: formData.get('poll_desc'),
            options: optionsData,
            timestamp: serverTimestamp(),
        }
        addDoc(pollsDB, data)
    }

    return (
        <form onSubmit={onSubmitForm} className='flex flex-col gap-2'>
            <label>
                <span>Poll Name: </span>
                <input name='poll_name' placeholder='Name' />
            </label>
            <label className='flex flex-col'>
                <div>Poll Description</div>
                <textarea name='poll_desc' />
            </label>
            {Array(options)
                .fill(0)
                .map((_, index) => (
                    <label key={index}>
                        <span>Option {index + 1}: </span>
                        <input name={'option' + index} />
                    </label>
                ))}
            <button type='button' onClick={() => setOptions(o => (o += 1))}>
                Add more options
            </button>
            <button>Create</button>
        </form>
    )
}
