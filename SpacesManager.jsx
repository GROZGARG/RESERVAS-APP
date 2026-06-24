// ============================================================
// src/components/Spaces/SpacesManager.jsx
// Gestión de espacios (solo administrador)
// ============================================================

import { useState } from 'react'
import { Plus, Pencil, Trash2, Building2, Users, X } from 'lucide-react'
import { SPACE_COLORS } from './helpers.js'

export default function SpacesManager({ spaces, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editingSpace, setEditingSpace] = useState(null)

  const handleOpenEdit = (space) => {
    setEditingSpace(space)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingSpace(null)
  }

  const handleDelete = (space) => {
    if (window.confirm(`¿Eliminar el espacio "${space.name}"? Las reservas asociadas permanecerán pero sin espacio asignado.`)) {
      onDelete(space.id)
    }
  }

  return (
    <div className="sm-page">
      {/* Encabezado */}
      <div className="sm-header">
        <div>
          <h1 className="sm-title">Gestión de Espacios</h1>
          <p className="sm-subtitle">{spaces.length} espacios registrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Nuevo espacio
        </button>
      </div>

      {/* Grid de espacios */}
      {spaces.length === 0 ? (
        <div className="sm-empty card">
          <Building2 size={48} style={{ color: 'var(--color-text-muted)', marginBottom: 12 }} />
          <p className="sm-empty-title">No hay espacios registrados</p>
          <p className="sm-empty-sub">Crea el primer espacio con el botón de arriba</p>
        </div>
      ) : (
        <div className="sm-grid">
          {spaces.map((space) => (
            <div key={space.id} className="sm-card card">
              <div className="sm-card-header" style={{ background: `${space.color}18` }}>
                <div className="sm-card-icon" style={{ background: space.color }}>
                  <Building2 size={20} />
                </div>
                <div className="sm-card-actions">
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => handleOpenEdit(space)}
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => handleDelete(space)}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="sm-card-body">
                <h3 className="sm-space-name">{space.name}</h3>
                {space.description && (
                  <p className="sm-space-desc">{space.description}</p>
                )}
                {space.capacity && (
                  <div className="sm-space-capacity">
                    <Users size={13} />
                    <span>Capacidad: {space.capacity} personas</span>
                  </div>
                )}
                <div className="sm-space-color-row">
                  <span className="sm-color-dot" style={{ background: space.color }} />
                  <span className="sm-color-value">{space.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <SpaceForm
          initialData={editingSpace}
          onClose={handleClose}
          onSubmit={async (data) => {
            const ok = editingSpace ? await onEdit(editingSpace.id, data) : await onAdd(data)
            if (ok) handleClose()
          }}
        />
      )}

      <style>{`
        .sm-page { display: flex; flex-direction: column; gap: 20px; }

        .sm-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sm-title { font-size: 24px; font-weight: 800; }

        .sm-subtitle { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }

        .sm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .sm-card { overflow: hidden; }

        .sm-card-header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sm-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sm-card-actions { display: flex; gap: 4px; }

        .sm-card-body { padding: 14px 16px 18px; }

        .sm-space-name {
          font-size: 16px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin-bottom: 4px;
        }

        .sm-space-desc {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .sm-space-capacity {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }

        .sm-space-color-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .sm-color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
        }

        .sm-color-value {
          font-size: 12px;
          font-family: monospace;
          color: var(--color-text-muted);
        }

        .sm-empty {
          padding: 60px 24px;
          text-align: center;
        }

        .sm-empty-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .sm-empty-sub { font-size: 13px; color: var(--color-text-muted); }
      `}</style>
    </div>
  )
}

// ── Formulario de espacio ──────────────────────────────────
function SpaceForm({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    capacity: initialData?.capacity || '',
    color: initialData?.color || SPACE_COLORS[0],
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await onSubmit({ ...form, capacity: form.capacity ? Number(form.capacity) : null })
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Editar espacio' : 'Nuevo espacio'}
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ej: Salón 1, Auditorio…"
              value={form.name}
              onChange={handleChange('name')}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-textarea"
              placeholder="Descripción opcional del espacio"
              value={form.description}
              onChange={handleChange('description')}
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Capacidad (personas)</label>
            <input
              type="number"
              className="form-input"
              placeholder="Ej: 50"
              value={form.capacity}
              onChange={handleChange('capacity')}
              min={1}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color del espacio</label>
            <div className="color-picker">
              {SPACE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando…' : initialData ? 'Guardar cambios' : 'Crear espacio'}
          </button>
        </div>
      </div>

      <style>{`
        .color-picker {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 4px 0;
        }

        .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }

        .color-swatch:hover {
          transform: scale(1.15);
        }

        .color-swatch.selected {
          border-color: white;
          box-shadow: 0 0 0 2px currentColor, 0 2px 8px rgba(0,0,0,0.2);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
