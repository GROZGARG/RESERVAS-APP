import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { auth } from './firebase.js'

const missingConfigError = () => {
  const error = new Error('Falta configurar Firebase. Crea .env.local con tus credenciales.')
  error.code = 'app/missing-firebase-config'
  return error
}

export const loginWithEmail = async (email, password) => {
  if (!auth) throw missingConfigError()
  return await signInWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
  if (!auth) return
  return await signOut(auth)
}

export const onAuthChange = (callback) => {
  if (!auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}

export const reauthenticate = async (currentPassword) => {
  if (!auth?.currentUser) throw missingConfigError()

  const user = auth.currentUser
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  return await reauthenticateWithCredential(user, credential)
}

export const changePassword = async (newPassword) => {
  if (!auth?.currentUser) throw missingConfigError()
  return await updatePassword(auth.currentUser, newPassword)
}

export { auth }
