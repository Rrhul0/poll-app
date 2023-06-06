import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function SignInButton({ as }: { as?: 'link' | 'button' }) {
    function onClickSignIn() {
        const provider = new GoogleAuthProvider()
        provider.addScope('profile')
        provider.addScope('email')
        signInWithPopup(auth, provider)
    }
    return (
        <button
            className={
                as === 'link'
                    ? 'text-blue-500 underline-offset-2 duration-200 hover:underline'
                    : 'rounded border border-blue-500 px-2 py-0.5 duration-200 hover:bg-blue-500'
            }
            onClick={onClickSignIn}
        >
            Sign In
        </button>
    )
}
