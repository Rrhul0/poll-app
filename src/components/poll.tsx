import { onValue, ref, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { realtimeVotesDB } from '../lib/firebase'
import { TypePoll } from './polls'

export default function Poll({ poll }: { poll: TypePoll }) {
    const [votes, setVotes] = useState<number[]>(Array(poll.options.length).fill(0))

    const refDB = ref(realtimeVotesDB, 'poll-' + poll.id)

    useEffect(() => {
        const unsub = onValue(refDB, snapshot => {
            const val = snapshot.val()
            if (!val) return
            setVotes(snapshot.val())
        })
        return () => unsub()
    }, [])

    function onClickVote(optionIndex: number) {
        const newVotes = [...votes]
        if (optionIndex > newVotes.length - 1) return
        newVotes[optionIndex] += 1

        set(refDB, newVotes)
    }

    const totalVotes = votes.reduce((pv, cv) => pv + cv, 0) || 1

    return (
        <li className='px-8 py-6 bg-white drop-shadow-lg rounded-lg'>
            <h2 className='font-bold text-xl text-center capitalize'>{poll.name}</h2>
            <p className='text-lg capitalize'>{poll.desc}</p>
            <div className='flex gap-2'>
                {poll.options.map((option, index) => (
                    <button key={index} className='w-1/2 p-2 border rounded-lg' onClick={() => onClickVote(index)}>
                        <div>{option}</div>
                        <div>{((votes[index] / totalVotes) * 100).toFixed(2)}</div>
                        <div>{votes[index]} votes</div>
                    </button>
                ))}
            </div>
        </li>
    )
}
