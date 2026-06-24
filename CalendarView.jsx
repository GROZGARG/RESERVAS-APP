// ============================================================
// src/components/Calendar/CalendarView.jsx
// Vista de calendario con FullCalendar (mensual/semanal/diaria)
// ============================================================

import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { Plus } from 'lucide-react'
import { reservationToEvent } from './helpers.js'
import { useAuth } from './AuthContext.jsx'
import { useTheme } from './ThemeContext.jsx'
import ReservationForm from './ReservationForm.jsx'
import ReservationDetail from './ReservationDetail.jsx'

export default function CalendarView({
  reservations,
  spaces,
  onAdd,
  onEdit,
  onDelete,
  getSpaceName,
  getSpaceColor,
}) {
  const { isAdmin } = useAuth()
  const { isDark } = useTheme()
  const calendarRef = useRef(null)

  const [showForm, setShowForm] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [viewingReservation, setViewingReservation] = useState(null)
  const [initialDate, setInitialDate] = useState(null)

  // Convertir reservas al formato de FullCalendar
  const events = reservations.map((r) =>
    reservationToEvent(r, getSpaceName(r.spaceId), getSpaceColor(r.spaceId))
  )

  // Clic en un evento → mostrar detalles
  const handleEventClick = ({ event }) => {
    const { extendedProps } = event
    setViewingReservation({
      ...extendedProps,
      id: event.id,
      spaceName: getSpaceName(extendedProps.spaceId),
      spaceColor: getSpaceColor(extendedProps.spaceId),
    })
  }

  // Clic en una fecha vacía (solo admin) → abrir formulario con fecha prellenada
  const handleDateClick = ({ date }) => {
    if (!isAdmin) return
    setInitialDate(date)
    setEditingReservation(null)
    setShowForm(true)
  }

  // Drag & drop de evento → actualizar fecha (solo admin)
  const handleEventDrop = async ({ event, revert }) => {
    if (!isAdmin) { revert(); return }
    const ok = await onEdit(event.id, {
      startDate: event.start.toISOString(),
      endDate: event.end?.toISOString() || event.start.toISOString(),
    })
    if (!ok) revert()
  }

  // Resize de evento → actualizar hora fin (solo admin)
  const handleEventResize = async ({ event, revert }) => {
    if (!isAdmin) { revert(); return }
    const ok = await onEdit(event.id, {
      endDate: event.end?.toISOString(),
    })
    if (!ok) revert()
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingReservation(null)
    setInitialDate(null)
  }

  const handleSubmit = async (data) => {
    if (editingReservation) {
      return await onEdit(editingReservation.id, data)
    }
    return await onAdd(data)
  }

  return (
    <div className="cal-page">
      {/* Encabezado */}
      <div className="cal-header">
        <div>
          <h1 className="cal-title">Calendario de reservas</h1>
          <p className="cal-subtitle">Visualiza y gestiona todas las reservas</p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => { setEditingReservation(null); setInitialDate(null); setShowForm(true) }}
          >
            <Plus size={16} />
            Nueva reserva
          </button>
        )}
      </div>

      {/* Leyenda de espacios */}
      <div className="cal-legend card">
        {spaces.map((s) => (
          <div key={s.id} className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: s.color }} />
            <span className="cal-legend-label">{s.name}</span>
          </div>
        ))}
      </div>

      {/* FullCalendar */}
      <div className="cal-wrapper card">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          events={events}
          editable={isAdmin}
          selectable={isAdmin}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista',
          }}
          height="auto"
          eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
          eventDisplay="block"
          dayMaxEvents={4}
          moreLinkText={(n) => `+${n} más`}
          nowIndicator={true}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </div>

      {/* Modales */}
      <ReservationForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        spaces={spaces}
        initialData={editingReservation}
        initialDate={initialDate}
      />

      <ReservationDetail
        isOpen={!!viewingReservation}
        reservation={viewingReservation}
        onClose={() => setViewingReservation(null)}
        onEdit={(r) => { setEditingReservation(r); setViewingReservation(null); setShowForm(true) }}
        onDelete={onDelete}
      />

      <style>{`
        .cal-page {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cal-title {
          font-size: 24px;
          font-weight: 800;
        }

        .cal-subtitle {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 2px;
        }

        .cal-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
          padding: 12px 18px;
        }

        .cal-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: var(--color-text-secondary);
        }

        .cal-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cal-legend-label { font-weight: 500; }

        .cal-wrapper {
          padding: 20px;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .cal-wrapper { padding: 12px 8px; }
        }
      `}</style>
    </div>
  )
}
