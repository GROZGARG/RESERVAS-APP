// ============================================================
// src/hooks/useReservations.js
// Hook para sincronización en tiempo real de reservas
// ============================================================

import { useEffect, useState, useCallback } from 'react'
import { subscribeToReservations, createReservation, updateReservation, deleteReservation } from './firestore.js'
import toast from 'react-hot-toast'

const firebaseErrorMessage = (action, err) => {
  if (err?.code === 'permission-denied') {
    return `${action}: Firestore no tiene permisos. Revisa las reglas.`
  }

  if (err?.code === 'app/missing-firebase-config') {
    return `${action}: falta configurar Firebase.`
  }

  return `${action}${err?.code ? ` (${err.code})` : ''}`
}

export function useReservations(spaceFilter = null) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Suscripción en tiempo real
  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToReservations((data) => {
      setReservations(data)
      setLoading(false)
      setError(null)
    }, spaceFilter, (err) => {
      console.error(err)
      setError(err)
      setLoading(false)
      toast.error(firebaseErrorMessage('Error al cargar reservas', err))
    })

    return unsubscribe
  }, [spaceFilter])

  // ── Crear reserva ──────────────────────────────────────────
  const addReservation = useCallback(async (data) => {
    try {
      await createReservation(data)
      toast.success('Reserva creada exitosamente')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al crear la reserva', err))
      return false
    }
  }, [])

  // ── Actualizar reserva ─────────────────────────────────────
  const editReservation = useCallback(async (id, data) => {
    try {
      await updateReservation(id, data)
      toast.success('Reserva actualizada')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al actualizar la reserva', err))
      return false
    }
  }, [])

  // ── Eliminar reserva ───────────────────────────────────────
  const removeReservation = useCallback(async (id) => {
    try {
      await deleteReservation(id)
      toast.success('Reserva eliminada')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al eliminar la reserva', err))
      return false
    }
  }, [])

  return { reservations, loading, error, addReservation, editReservation, removeReservation }
}
