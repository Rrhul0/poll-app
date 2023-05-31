import { onAuthStateChanged } from 'firebase/auth'
import { onValue, ref } from 'firebase/database'
import { useState, useEffect } from 'react'
import { auth, realtimeVotesDB } from '../lib/firebase'
import AddMoreOptions from './addMoreOptions'
import { type TypePoll } from './polls'
import VoteButton from './voteButton'

export default function Poll({ poll }: { poll: TypePoll }) {
    const [votes, setVotes] = useState<number[]>([])
    const [userVote, setUserVote] = useState<number | null>(null) //user vote index to this poll

    //subscribe to total vote count of each option of poll
    useEffect(() => {
        const totalVotesRef = ref(realtimeVotesDB, 'poll-' + poll.id)

        const unsub = onValue(totalVotesRef, snapshot => {
            const val = snapshot.val()
            if (!val) return
            setVotes(snapshot.val())
        })

        return () => unsub()
    }, [])

    //when user is logged in subscribe to theirs vote on this poll
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, () => {
            const user = auth.currentUser
            if (!user) {
                setUserVote(null)
                return
            }
            const userVoteRef = ref(realtimeVotesDB, user.uid + '/' + poll.id)
            const userVoteUnsub = onValue(userVoteRef, snap => setUserVote(snap.val()))

            return () => userVoteUnsub()
        })

        return () => unsub()
    }, [])

    return (
        <li className='relative flex flex-grow flex-col items-center gap-2 rounded-xl bg-white px-4 py-6 drop-shadow-lg '>
            <div>
                <h2 className='text-center text-xl font-bold capitalize'>{poll.name}</h2>
                <p className='text-lg capitalize'>{poll.desc}</p>
            </div>
            <div className='flex flex-wrap justify-center gap-2'>
                {poll.options.map((option, index) => (
                    <VoteButton
                        key={index}
                        index={index}
                        option={option}
                        pollId={poll.id}
                        votes={votes}
                        userVote={userVote}
                    />
                ))}
            </div>
            <AddMoreOptions poll={poll} />
        </li>
    )
}
