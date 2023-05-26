import { TypePoll } from './polls'

export default function Poll({ poll }: { poll: TypePoll }) {
    return (
        <li className='p-8 bg-slate-300 drop-shadow-lg rounded-lg'>
            <h2>{poll.name}</h2>
            <p>{poll.desc}</p>
            <div>
                <button>
                    <div>{poll.options?.[0]}</div>
                    <div>40%</div>
                    <div>4 votes</div>
                </button>
                <button>
                    <div>{poll.options?.[1]}</div>
                    <div>40%</div>
                    <div>4 votes</div>
                </button>
            </div>
        </li>
    )
}
