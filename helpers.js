// ============================================================
// src/utils/helpers.js
// Funciones utilitarias de la aplicación
// ============================================================

import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Formatear fechas ───────────────────────────────────────

/**
 * Formato largo: "lunes, 29 de junio de 2026"
 */
export const formatDateLong = (dateStr) => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    if (!isValid(d)) return 'Fecha inválida'
    return format(d, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return 'Fecha inválida'
  }
}

/**
 * Formato corto: "29 jun 2026"
 */
export const formatDateShort = (dateStr) => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    if (!isValid(d)) return ''
    return format(d, "d MMM yyyy", { locale: es })
  } catch {
    return ''
  }
}

/**
 * Formato de hora: "3:30 PM"
 */
export const formatTime = (dateStr) => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr)
    if (!isValid(d)) return ''
    return format(d, 'h:mm a')
  } catch {
    return ''
  }
}

/**
 * Combinado: "29 jun · 3:30 PM – 5:00 PM"
 */
export const formatReservationRange = (startStr, endStr) => {
  const date = formatDateShort(startStr)
  const start = formatTime(startStr)
  const end = formatTime(endStr)
  return `${date} · ${start} – ${end}`
}

// ── Estados de reserva ─────────────────────────────────────

export const RESERVATION_STATUSES = [
  { value: 'reserved', label: 'Reservado', color: '#10b981', bg: '#d1fae5' },
  { value: 'pending', label: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
  { value: 'cancelled', label: 'Cancelado', color: '#ef4444', bg: '#fee2e2' },
]

export const getStatusInfo = (statusValue) => {
  return RESERVATION_STATUSES.find((s) => s.value === statusValue) || RESERVATION_STATUSES[0]
}

// ── Paleta de colores para espacios ───────────────────────

export const SPACE_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violeta
  '#06b6d4', // Cyan
  '#f59e0b', // Ámbar
  '#10b981', // Esmeralda
  '#ef4444', // Rojo
  '#f97316', // Naranja
  '#84cc16', // Lima
  '#ec4899', // Rosa
  '#14b8a6', // Teal
]

// ── Conversión de fechas para FullCalendar ─────────────────

/**
 * Convierte una reserva de Firestore al formato de evento de FullCalendar
 */
export const reservationToEvent = (reservation, spaceName, spaceColor) => ({
  id: reservation.id,
  title: `${spaceName} — ${reservation.responsibleName}`,
  start: reservation.startDate,
  end: reservation.endDate,
  backgroundColor: spaceColor,
  borderColor: spaceColor,
  extendedProps: {
    ...reservation,
    spaceName,
  },
})

// ── Validaciones básicas ───────────────────────────────────

export const validateReservation = (data) => {
  const errors = {}
  if (!data.spaceId) errors.spaceId = 'Selecciona un espacio'
  if (!data.startDate) errors.startDate = 'Ingresa la fecha y hora de inicio'
  if (!data.endDate) errors.endDate = 'Ingresa la fecha y hora de fin'
  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    errors.endDate = 'La hora de fin debe ser posterior al inicio'
  }
  if (!data.responsibleName?.trim()) errors.responsibleName = 'Ingresa el nombre del responsable'
  return errors
}
