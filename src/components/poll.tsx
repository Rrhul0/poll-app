import { child, get, onValue, ref, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { auth, realtimeVotesDB } from '../lib/firebase'
import AddMoreOptions from './addMoreOptions'
import { TypePoll } from './polls'

export default function Poll({ poll }: { poll: TypePoll }) {
    const [votes, setVotes] = useState<number[]>([])

    const refDB = ref(realtimeVotesDB, 'poll-' + poll.id)

    useEffect(() => {
        const unsub = onValue(refDB, snapshot => {
            const val = snapshot.val()
            if (!val) return
            setVotes(snapshot.val())
        })
        return () => unsub()
    }, [])

    async function onClickVote(optionVotes: number, optionIndex: number) {
        // const newRef = ref(realtimeVotesDB, 'poll-' + poll.id + '/' + optionIndex)
        // set(newRef, optionVotes + 1)

        //test
        const user = auth.currentUser
        if (!user) return

        const testVoteIndexRef = ref(realtimeVotesDB, user.uid + '/' + poll.id)
        let prevVoteOption: number = (await get(child(testVoteIndexRef, '/'))).val()
        if (prevVoteOption) {
            //decrease 1 vote from last option total vote count
            const prevOptionVoteCount = ref(realtimeVotesDB, 'poll-' + poll.id + '/' + prevVoteOption)
            set(prevOptionVoteCount, votes[prevVoteOption] - 1)
        }

        set(testVoteIndexRef, optionIndex) //replace the new vote option to user's vote

        //inrease the new vote count by 1
        const totalRef = ref(realtimeVotesDB, 'poll-' + poll.id + '/' + optionIndex)
        set(totalRef, optionVotes + 1)
    }

    const totalVotes = votes.reduce((pv, cv) => pv + cv, 0) || 1

    return (
        <li className='relative flex flex-grow flex-col items-center gap-2 rounded-xl bg-white px-4 py-6 drop-shadow-lg '>
            <div>
                <h2 className='text-center text-xl font-bold capitalize'>{poll.name}</h2>
                <p className='text-lg capitalize'>{poll.desc}</p>
            </div>
            <div className='flex flex-wrap justify-center gap-2'>
                {poll.options.map((option, index) => {
                    const optionVotes = votes[index] || 0
                    const percent = (optionVotes / totalVotes) * 100 || 0
                    return (
                        <button
                            key={index}
                            className='relative flex aspect-square w-40 flex-col items-center gap-2 overflow-hidden rounded-lg border px-2 py-3'
                            onClick={() => onClickVote(optionVotes, index)}
                        >
                            <div
                                className='absolute bottom-0 left-0 right-0 -z-10 bg-red-300 bg-opacity-60 blur-[2px] duration-300'
                                style={{ top: `${100 - percent}%` }}
                            />
                            <div className='capitalize'>{option}</div>
                            <div>{percent.toFixed(2)}%</div>
                            <div>{optionVotes} votes</div>
                        </button>
                    )
                })}
            </div>
            <AddMoreOptions poll={poll} />
        </li>
    )
}
