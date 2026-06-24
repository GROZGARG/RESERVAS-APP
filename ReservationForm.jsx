// ============================================================
// src/components/Reservations/ReservationForm.jsx
// Modal de formulario para crear / editar reservas
// ============================================================

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, FileText, Building2, Tag } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { RESERVATION_STATUSES, validateReservation } from './helpers.js'

export default function ReservationForm({ isOpen, onClose, onSubmit, spaces, initialData, initialDate }) {
  const isEditing = !!initialData

  // Estado del formulario
  const emptyForm = {
    spaceId: '',
    startDate: '',
    endDate: '',
    responsibleName: '',
    description: '',
    status: 'reserved',
  }

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Rellenar al editar o al hacer clic en una fecha del calendario
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Modo edición: convertir ISO a formato datetime-local
        const toLocal = (iso) => {
          if (!iso) return ''
          try {
            const d = typeof iso === 'string' ? parseISO(iso) : new Date(iso)
            return format(d, "yyyy-MM-dd'T'HH:mm")
          } catch { return '' }
        }
        setForm({
          spaceId: initialData.spaceId || '',
          startDate: toLocal(initialData.startDate),
          endDate: toLocal(initialData.endDate),
          responsibleName: initialData.responsibleName || '',
          description: initialData.description || '',
          status: initialData.status || 'reserved',
        })
      } else if (initialDate) {
        // Precarga la fecha seleccionada en el calendario
        const d = new Date(initialDate)
        const startStr = format(d, "yyyy-MM-dd'T'09:00")
        const endStr = format(d, "yyyy-MM-dd'T'10:00")
        setForm({ ...emptyForm, startDate: startStr, endDate: endStr })
      } else {
        setForm(emptyForm)
      }
      setErrors({})
    }
  }, [isOpen, initialData, initialDate])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async () => {
    // Convertir datetime-local a ISO
    const data = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
      endDate: form.endDate ? new Date(form.endDate).toISOString() : '',
    }

    const validationErrors = validateReservation(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    const ok = await onSubmit(data)
    setLoading(false)
    if (ok) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Encabezado */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? '✏️ Editar reserva' : '✨ Nueva reserva'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="modal-body">
          {/* Espacio */}
          <div className="form-group">
            <label className="form-label">
              <Building2 size={12} style={{ display: 'inline', marginRight: 4 }} />
              Espacio *
            </label>
            <select
              className={`form-select ${errors.spaceId ? 'error' : ''}`}
              value={form.spaceId}
              onChange={handleChange('spaceId')}
            >
              <option value="">— Selecciona un espacio —</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.spaceId && <span className="form-error">{errors.spaceId}</span>}
          </div>

          {/* Fechas en fila */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                Inicio *
              </label>
              <input
                type="datetime-local"
                className={`form-input ${errors.startDate ? 'error' : ''}`}
                value={form.startDate}
                onChange={handleChange('startDate')}
              />
              {errors.startDate && <span className="form-error">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                Fin *
              </label>
              <input
                type="datetime-local"
                className={`form-input ${errors.endDate ? 'error' : ''}`}
                value={form.endDate}
                onChange={handleChange('endDate')}
              />
              {errors.endDate && <span className="form-error">{errors.endDate}</span>}
            </div>
          </div>

          {/* Responsable */}
          <div className="form-group">
            <label className="form-label">
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />
              Responsable *
            </label>
            <input
              type="text"
              className={`form-input ${errors.responsibleName ? 'error' : ''}`}
              placeholder="Nombre completo del responsable"
              value={form.responsibleName}
              onChange={handleChange('responsibleName')}
            />
            {errors.responsibleName && <span className="form-error">{errors.responsibleName}</span>}
          </div>

          {/* Estado */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
              Estado
            </label>
            <div className="status-selector">
              {RESERVATION_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`status-option ${form.status === s.value ? 'selected' : ''}`}
                  style={{
                    '--status-color': s.color,
                    '--status-bg': s.bg,
                  }}
                  onClick={() => setForm((prev) => ({ ...prev, status: s.value }))}
                >
                  <span className="status-dot" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />
              Descripción
            </label>
            <textarea
              className="form-textarea"
              placeholder="Detalles opcionales de la reserva…"
              value={form.description}
              onChange={handleChange('description')}
              rows={3}
            />
          </div>
        </div>

        {/* Pie */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><span className="spinner-sm" /> Guardando…</>
            ) : isEditing ? 'Guardar cambios' : 'Crear reserva'}
          </button>
        </div>
      </div>

      <style>{`
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .status-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          border: 1.5px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .status-option:hover {
          border-color: var(--status-color);
          color: var(--status-color);
        }

        .status-option.selected {
          background: var(--status-bg);
          border-color: var(--status-color);
          color: var(--status-color);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
