import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  getDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase.js'

const RESERVATIONS_COLLECTION = 'reservations'
const SPACES_COLLECTION = 'spaces'

const missingConfigError = () => {
  const error = new Error('Falta configurar Firebase. Crea .env.local con tus credenciales.')
  error.code = 'app/missing-firebase-config'
  return error
}

const requireDb = () => {
  if (!db) throw missingConfigError()
  return db
}

export const subscribeToSpaces = (callback, onError = console.error) => {
  if (!db) {
    callback([])
    return () => {}
  }

  const q = query(collection(db, SPACES_COLLECTION), orderBy('name'))
  return onSnapshot(
    q,
    (snapshot) => {
      const spaces = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      callback(spaces)
    },
    onError
  )
}

export const createSpace = async (spaceData) => {
  const database = requireDb()
  return await addDoc(collection(database, SPACES_COLLECTION), {
    ...spaceData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateSpace = async (spaceId, spaceData) => {
  const database = requireDb()
  const ref = doc(database, SPACES_COLLECTION, spaceId)
  return await updateDoc(ref, {
    ...spaceData,
    updatedAt: serverTimestamp(),
  })
}

export const deleteSpace = async (spaceId) => {
  const database = requireDb()
  return await deleteDoc(doc(database, SPACES_COLLECTION, spaceId))
}

export const subscribeToReservations = (callback, spaceId = null, onError = console.error) => {
  if (!db) {
    callback([])
    return () => {}
  }

  const reservationsRef = collection(db, RESERVATIONS_COLLECTION)
  const q = spaceId
    ? query(reservationsRef, where('spaceId', '==', spaceId), orderBy('startDate'))
    : query(reservationsRef, orderBy('startDate'))

  return onSnapshot(
    q,
    (snapshot) => {
      const reservations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate?.()?.toISOString() || doc.data().startDate,
        endDate: doc.data().endDate?.toDate?.()?.toISOString() || doc.data().endDate,
      }))
      callback(reservations)
    },
    onError
  )
}

export const createReservation = async (reservationData) => {
  const database = requireDb()
  return await addDoc(collection(database, RESERVATIONS_COLLECTION), {
    ...reservationData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateReservation = async (reservationId, reservationData) => {
  const database = requireDb()
  const ref = doc(database, RESERVATIONS_COLLECTION, reservationId)
  return await updateDoc(ref, {
    ...reservationData,
    updatedAt: serverTimestamp(),
  })
}

export const deleteReservation = async (reservationId) => {
  const database = requireDb()
  return await deleteDoc(doc(database, RESERVATIONS_COLLECTION, reservationId))
}

export const getReservation = async (reservationId) => {
  const database = requireDb()
  const ref = doc(database, RESERVATIONS_COLLECTION, reservationId)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() }
  }

  return null
}

export const seedInitialData = async () => {
  if (!db) return

  const spacesSnap = await getDocs(collection(db, SPACES_COLLECTION))
  if (!spacesSnap.empty) return

  const batch = writeBatch(db)
  const defaultSpaces = [
    { name: 'Salon 1', description: 'Salon principal para eventos', capacity: 50, color: '#6366f1' },
    { name: 'Salon 2', description: 'Salon secundario multiuso', capacity: 30, color: '#8b5cf6' },
    { name: 'Salon 3', description: 'Salon para talleres y capacitaciones', capacity: 25, color: '#06b6d4' },
    { name: 'Auditorio', description: 'Auditorio principal para grandes eventos', capacity: 200, color: '#f59e0b' },
    { name: 'Sala de Reuniones', description: 'Sala ejecutiva para reuniones', capacity: 12, color: '#10b981' },
  ]

  defaultSpaces.forEach((space) => {
    const ref = doc(collection(db, SPACES_COLLECTION))
    batch.set(ref, { ...space, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  })

  await batch.commit()
}
