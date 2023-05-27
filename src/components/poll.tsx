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
        <li className='flex flex-col gap-2 rounded-xl bg-white px-8 py-6 drop-shadow-lg'>
            <div>
                <h2 className='text-center text-xl font-bold capitalize'>{poll.name}</h2>
                <p className='text-lg capitalize'>{poll.desc}</p>
            </div>
            <div className='flex gap-2'>
                {poll.options.map((option, index) => {
                    const percent = (votes[index] / totalVotes) * 100
                    return (
                        <button
                            key={index}
                            className='relative flex aspect-square w-1/2 flex-col items-center gap-2 overflow-hidden rounded-lg border px-2 py-3'
                            onClick={() => onClickVote(index)}
                        >
                            <div
                                className='absolute bottom-0 left-0 right-0 -z-10 bg-red-300 bg-opacity-60 blur-[2px] duration-300'
                                style={{ top: `${100 - percent}%` }}
                            />
                            <div className='capitalize'>{option}</div>
                            <div>{percent.toFixed(2)}%</div>
                            <div>{votes[index]} votes</div>
                        </button>
                    )
                })}
            </div>
        </li>
    )
}
