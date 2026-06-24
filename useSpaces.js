// ============================================================
// src/hooks/useSpaces.js
// Hook para sincronización en tiempo real de espacios
// ============================================================

import { useEffect, useState, useCallback } from 'react'
import { subscribeToSpaces, createSpace, updateSpace, deleteSpace } from './firestore.js'
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

export function useSpaces() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToSpaces((data) => {
      setSpaces(data)
      setLoading(false)
    }, (err) => {
      console.error(err)
      setLoading(false)
      toast.error(firebaseErrorMessage('Error al cargar espacios', err))
    })
    return unsubscribe
  }, [])

  const addSpace = useCallback(async (data) => {
    try {
      await createSpace(data)
      toast.success('Espacio creado exitosamente')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al crear el espacio', err))
      return false
    }
  }, [])

  const editSpace = useCallback(async (id, data) => {
    try {
      await updateSpace(id, data)
      toast.success('Espacio actualizado')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al actualizar el espacio', err))
      return false
    }
  }, [])

  const removeSpace = useCallback(async (id) => {
    try {
      await deleteSpace(id)
      toast.success('Espacio eliminado')
      return true
    } catch (err) {
      console.error(err)
      toast.error(firebaseErrorMessage('Error al eliminar el espacio', err))
      return false
    }
  }, [])

  // Obtener color de un espacio por ID
  const getSpaceColor = useCallback(
    (spaceId) => spaces.find((s) => s.id === spaceId)?.color || '#6366f1',
    [spaces]
  )

  const getSpaceName = useCallback(
    (spaceId) => spaces.find((s) => s.id === spaceId)?.name || 'Espacio desconocido',
    [spaces]
  )

  return { spaces, loading, addSpace, editSpace, removeSpace, getSpaceColor, getSpaceName }
}
