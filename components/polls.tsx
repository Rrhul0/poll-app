import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { pollsDB } from '../lib/firebase'
import Poll from './poll'

export interface TypePoll {
    name: string
    desc: string
    options: string[]
    option1?: string
    option2?: string
}

export default function Polls() {
    const [polls, setPolls] = useState<TypePoll[]>([])

    useEffect(() => {
        const unsub = onSnapshot(pollsDB, snapshot => {
            const gotPolls = snapshot.docs.map(doc => {
                return doc.data() as TypePoll
            })
            setPolls(gotPolls)
        })
        return () => unsub()
    })
    return (
        <ul className='flex flex-wrap gap-4'>
            {polls.map((poll, index) => (
                <Poll key={index} poll={poll} />
            ))}
        </ul>
    )
}
