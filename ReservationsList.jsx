// ============================================================
// src/components/Reservations/ReservationsList.jsx
// Vista de lista de reservas con filtros
// ============================================================

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Pencil, Trash2, Eye } from 'lucide-react'
import { formatDateLong, formatTime, getStatusInfo } from './helpers.js'
import { useAuth } from './AuthContext.jsx'
import ReservationForm from './ReservationForm.jsx'
import ReservationDetail from './ReservationDetail.jsx'

export default function ReservationsList({ reservations, spaces, onAdd, onEdit, onDelete, getSpaceName, getSpaceColor }) {
  const { isAdmin } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [viewingReservation, setViewingReservation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpace, setFilterSpace] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Filtrado y búsqueda
  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const name = getSpaceName(r.spaceId)
      const matchSearch =
        !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.responsibleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchSpace = !filterSpace || r.spaceId === filterSpace
      const matchStatus = !filterStatus || r.status === filterStatus
      return matchSearch && matchSpace && matchStatus
    })
  }, [reservations, searchQuery, filterSpace, filterStatus, getSpaceName])

  const handleOpenEdit = (reservation) => {
    setEditingReservation(reservation)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingReservation(null)
  }

  const handleSubmit = async (data) => {
    if (editingReservation) {
      return await onEdit(editingReservation.id, data)
    } else {
      return await onAdd(data)
    }
  }

  return (
    <div className="rl-page">
      {/* Encabezado */}
      <div className="rl-header">
        <div>
          <h1 className="rl-title">Reservas</h1>
          <p className="rl-subtitle">{filtered.length} de {reservations.length} reservas</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Nueva reserva
          </button>
        )}
      </div>

      {/* Barra de filtros */}
      <div className="rl-filters card">
        <div className="rl-search-wrapper">
          <Search size={16} className="rl-search-icon" />
          <input
            type="text"
            className="rl-search"
            placeholder="Buscar por espacio, responsable o descripción…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rl-filter-row">
          <select
            className="form-select rl-select"
            value={filterSpace}
            onChange={(e) => setFilterSpace(e.target.value)}
          >
            <option value="">Todos los espacios</option>
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            className="form-select rl-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="reserved">Reservado</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
          </select>

          {(searchQuery || filterSpace || filterStatus) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setSearchQuery(''); setFilterSpace(''); setFilterStatus('') }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rl-empty card">
          <div className="rl-empty-icon">📅</div>
          <p className="rl-empty-title">No se encontraron reservas</p>
          <p className="rl-empty-sub">
            {searchQuery || filterSpace || filterStatus
              ? 'Prueba ajustando los filtros de búsqueda'
              : isAdmin ? 'Crea la primera reserva con el botón de arriba' : 'Aún no hay reservas registradas'}
          </p>
        </div>
      ) : (
        <div className="rl-list">
          {filtered.map((r) => {
            const spaceName = getSpaceName(r.spaceId)
            const spaceColor = getSpaceColor(r.spaceId)
            const status = getStatusInfo(r.status || 'reserved')

            return (
              <div
                key={r.id}
                className="rl-item card"
                style={{ borderLeft: `4px solid ${spaceColor}` }}
              >
                <div className="rl-item-main">
                  <div className="rl-item-header">
                    <div className="rl-item-space" style={{ color: spaceColor }}>
                      {spaceName}
                    </div>
                    <div className={`status-badge status-${r.status || 'reserved'}`}>
                      {status.label}
                    </div>
                  </div>

                  <div className="rl-item-info">
                    <div className="rl-info-row">
                      <span className="rl-info-label">📅</span>
                      <span>{formatDateLong(r.startDate)}</span>
                    </div>
                    <div className="rl-info-row">
                      <span className="rl-info-label">⏰</span>
                      <span>{formatTime(r.startDate)} – {formatTime(r.endDate)}</span>
                    </div>
                    <div className="rl-info-row">
                      <span className="rl-info-label">👤</span>
                      <span>{r.responsibleName}</span>
                    </div>
                    {r.description && (
                      <div className="rl-info-row">
                        <span className="rl-info-label">📝</span>
                        <span className="rl-description">{r.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="rl-item-actions">
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    title="Ver detalle"
                    onClick={() => setViewingReservation({ ...r, spaceName, spaceColor })}
                  >
                    <Eye size={15} />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Editar"
                        onClick={() => handleOpenEdit(r)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        title="Eliminar"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => {
                          if (window.confirm('¿Eliminar esta reserva?')) onDelete(r.id)
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modales */}
      <ReservationForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        spaces={spaces}
        initialData={editingReservation}
      />

      <ReservationDetail
        isOpen={!!viewingReservation}
        reservation={viewingReservation}
        onClose={() => setViewingReservation(null)}
        onEdit={handleOpenEdit}
        onDelete={onDelete}
      />

      <style>{`
        .rl-page { display: flex; flex-direction: column; gap: 20px; }

        .rl-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rl-title {
          font-size: 24px;
          font-weight: 800;
        }

        .rl-subtitle {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-top: 2px;
        }

        .rl-filters {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rl-search-wrapper {
          position: relative;
        }

        .rl-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .rl-search {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: 10px;
          border: 1.5px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text-primary);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }

        .rl-search:focus { border-color: var(--color-brand); }

        .rl-filter-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rl-select { width: auto; min-width: 160px; }

        .rl-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rl-item {
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: all 0.15s ease;
        }

        .rl-item:hover { box-shadow: var(--shadow-md); }

        .rl-item-main { flex: 1; min-width: 0; }

        .rl-item-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .rl-item-space {
          font-size: 15px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .rl-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rl-info-row {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-secondary);
          align-items: flex-start;
        }

        .rl-info-label { font-size: 13px; flex-shrink: 0; }

        .rl-description {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .rl-item-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
        }

        .rl-empty {
          text-align: center;
          padding: 60px 24px;
        }

        .rl-empty-icon { font-size: 48px; margin-bottom: 12px; }

        .rl-empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 6px;
        }

        .rl-empty-sub { font-size: 13px; color: var(--color-text-muted); }

        @media (max-width: 600px) {
          .rl-item { flex-direction: column; }
          .rl-item-actions { flex-direction: row; }
        }
      `}</style>
    </div>
  )
}
