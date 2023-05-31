import { ref, set } from 'firebase/database'
import { auth, realtimeVotesDB } from '../lib/firebase'

interface props {
    pollId: string
    option: string
    index: number
    votes: number[]
    userVote: number | null
}

export default function VoteButton({ pollId, option, index, votes, userVote }: props) {
    const totalVotes = votes.reduce((pv, cv) => pv + cv, 0) || 1

    const optionVotes = votes[index] || 0
    const percent = (optionVotes / totalVotes) * 100 || 0

    async function onClickVote(optionVotes: number, optionIndex: number) {
        const user = auth.currentUser
        if (!user) return

        const prevVoteOption = userVote
        if (prevVoteOption === optionIndex) return //clicking the already voted option

        if (prevVoteOption) {
            //decrease 1 vote from last option total vote count
            const prevOptionVoteCount = ref(realtimeVotesDB, 'poll-' + pollId + '/' + prevVoteOption)
            set(prevOptionVoteCount, votes[prevVoteOption] - 1)
        }

        //replace the new vote option to user's vote
        const userVoteRef = ref(realtimeVotesDB, user.uid + '/' + pollId)
        set(userVoteRef, optionIndex)

        //inrease the new vote count by 1
        const totalRef = ref(realtimeVotesDB, 'poll-' + pollId + '/' + optionIndex)
        set(totalRef, optionVotes + 1)
    }

    return (
        <button
            key={index}
            className={`relative flex aspect-square w-40 flex-col items-center gap-2 overflow-hidden rounded-lg border px-2 py-3 ${
                index === userVote ? 'border-red-400' : ''
            }`}
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
}
