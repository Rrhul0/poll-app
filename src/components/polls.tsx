import { onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { pollsDB } from '../lib/firebase'
import Poll from './poll'

export interface TypePoll {
    id: string
    name: string
    desc: string
    timestamp: Timestamp
    options: string[]
}

export default function Polls() {
    const [polls, setPolls] = useState<TypePoll[]>([])

    useEffect(() => {
        const q = query(pollsDB, orderBy('timestamp', 'asc'))
        const unsub = onSnapshot(q, snapshot => {
            const gotPolls = snapshot.docs.map(doc => {
                const poll = { ...doc.data(), id: doc.id }
                return poll as TypePoll
            })
            setPolls(gotPolls)
        })
        return () => unsub()
    }, [])

    return (
        <ul className='flex flex-wrap gap-4'>
            {polls.map(poll => (
                <Poll key={poll.id} poll={poll} />
            ))}
        </ul>
    )
}
