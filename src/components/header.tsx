import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../lib/firebase'

export default function Header() {
    const [user, setUser] = useState(auth.currentUser)
    const [showMenu, setShowMenu] = useState(false)

    function onClickSignIn() {
        const provider = new GoogleAuthProvider()
        provider.addScope('profile')
        provider.addScope('email')
        signInWithPopup(auth, provider)
    }
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, () => setUser(auth.currentUser))
        return () => unsub()
    })

    return (
        <header className='flex h-20 items-center justify-between bg-slate-800 px-6 text-slate-200'>
            <h1 className='text-3xl font-bold'>Poll App</h1>
            <div className='flex gap-4'>
                <button className='rounded px-2 py-0.5 text-lg text-blue-500 duration-200 hover:bg-purple-200'>
                    Create A Poll
                </button>
                {!user ? (
                    <button
                        className='rounded border border-blue-500 px-2 py-0.5 duration-200 hover:bg-blue-500'
                        onClick={onClickSignIn}
                    >
                        Sign In
                    </button>
                ) : (
                    <button
                        onClick={() => setShowMenu(o => !o)}
                        className='grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gray-300'
                    >
                        {user.photoURL ? (
                            <span
                                className='h-10 w-10 bg-white bg-cover bg-no-repeat'
                                style={{ backgroundImage: `url('${user.photoURL}')` }}
                            ></span>
                        ) : (
                            <div className='text-2xl font-semibold text-purple-600'>
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div
                            className={`absolute right-2 top-16 z-50 flex  flex-col gap-2 rounded-xl bg-slate-700 bg-opacity-50 px-3 py-2 backdrop-blur-sm ${
                                showMenu ? ' ' : 'hidden'
                            }`}
                        >
                            <strong>{user.displayName || user.email?.split('@')[0]}</strong>
                            <small>{user.email}</small>
                            <button
                                onClick={e => {
                                    signOut(auth).then()
                                }}
                                className='rounded-lg bg-purple-100 text-xl text-slate-400 transition-all duration-200 hover:bg-purple-200'
                            >
                                Log Out
                            </button>
                        </div>
                    </button>
                )}
            </div>
        </header>
    )
}
