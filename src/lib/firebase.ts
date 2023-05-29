// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBqwkYmQCMhT6DMt0TeRs01JANA9ypfcjE',
    authDomain: 'letsvote-1.firebaseapp.com',
    databaseURL: 'https://letsvote-1-default-rtdb.firebaseio.com',
    projectId: 'letsvote-1',
    storageBucket: 'letsvote-1.appspot.com',
    messagingSenderId: '916290679112',
    appId: '1:916290679112:web:77387b9e1d1992ae88837d',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)

export const pollsDB = collection(db, 'polls')

export const realtimeVotesDB = getDatabase(app)
