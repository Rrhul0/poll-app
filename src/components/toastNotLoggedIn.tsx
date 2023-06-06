import SignInButton from './signInButton'

export default function ToastNotLoggedIn() {
    return (
        <div>
            Not logged in! Please <SignInButton as='link' /> First.
        </div>
    )
}
