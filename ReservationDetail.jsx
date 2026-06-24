// ============================================================
// src/components/Reservations/ReservationDetail.jsx
// Modal de detalles de una reserva (lectura + acciones admin)
// ============================================================

import { X, Pencil, Trash2, Calendar, Clock, User, FileText, Building2, Tag } from 'lucide-react'
import { formatDateLong, formatTime, getStatusInfo } from './helpers.js'
import { useAuth } from './AuthContext.jsx'

export default function ReservationDetail({ isOpen, reservation, onClose, onEdit, onDelete }) {
  const { isAdmin } = useAuth()

  if (!isOpen || !reservation) return null

  const status = getStatusInfo(reservation.status || 'reserved')

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.')) {
      onDelete(reservation.id)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box detail-box">
        {/* Encabezado con color del espacio */}
        <div
          className="detail-header"
          style={{ background: `linear-gradient(135deg, ${reservation.spaceColor}22, ${reservation.spaceColor}08)` }}
        >
          <div className="detail-header-content">
            <div className="detail-space-dot" style={{ background: reservation.spaceColor }} />
            <div>
              <div className="detail-space-name">{reservation.spaceName}</div>
              <div
                className={`status-badge status-${reservation.status || 'reserved'}`}
                style={{ marginTop: 6 }}
              >
                {status.label}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="detail-body">
          <dl className="detail-grid">
            <DetailRow icon={<Calendar size={15} />} label="Fecha">
              {formatDateLong(reservation.startDate)}
            </DetailRow>

            <DetailRow icon={<Clock size={15} />} label="Horario">
              {formatTime(reservation.startDate)} — {formatTime(reservation.endDate)}
            </DetailRow>

            <DetailRow icon={<User size={15} />} label="Responsable">
              {reservation.responsibleName}
            </DetailRow>

            {reservation.description && (
              <DetailRow icon={<FileText size={15} />} label="Descripción">
                {reservation.description}
              </DetailRow>
            )}
          </dl>
        </div>

        {/* Pie — acciones de admin */}
        {isAdmin && (
          <div className="modal-footer">
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
              Eliminar
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button
              className="btn btn-primary"
              onClick={() => { onEdit(reservation); onClose() }}
            >
              <Pencil size={14} />
              Editar
            </button>
          </div>
        )}

        {!isAdmin && (
          <div className="modal-footer">
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>

      <style>{`
        .detail-box {
          max-width: 440px;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--color-border);
          border-radius: 20px 20px 0 0;
        }

        .detail-header-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .detail-space-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-top: 3px;
          flex-shrink: 0;
        }

        .detail-space-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--color-text-primary);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .detail-body {
          padding: 20px 24px;
        }

        .detail-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .detail-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .detail-row-icon {
          color: var(--color-brand);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .detail-row-content {}

        .detail-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-text-muted);
          margin-bottom: 2px;
        }

        .detail-value {
          font-size: 14px;
          color: var(--color-text-primary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}

function DetailRow({ icon, label, children }) {
  return (
    <div className="detail-row">
      <div className="detail-row-icon">{icon}</div>
      <div className="detail-row-content">
        <div className="detail-label">{label}</div>
        <div className="detail-value">{children}</div>
      </div>
    </div>
  )
}
