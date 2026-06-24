import type { Note } from '../App'
import { motion } from 'framer-motion'

type Props = {
  notes: Note[]
  activeId?: string
  onSelect: (id: string | '') => void // 🌟 Updated to support dashboard clearing ('')
  onCreate: () => void

  onDeleteRequest: (id: string) => void

  view: 'notes' | 'trash'
  setView: (v: 'notes' | 'trash') => void

  onRestore: (id: string) => void
}

export default function Sidebar({
  notes,
  activeId,
  onSelect,
  onCreate,
  onDeleteRequest,
  view,
  setView,
  onRestore
}: Props) {
  return (
    <motion.div
      className="sidebar"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🌸 Header */}
      <div className="sidebar-header">
        {/* 🌟 Added click handler to go back to the dashboard state */}
        <h1 
          onClick={() => onSelect('')} 
          style={{ cursor: 'pointer' }}
          title="Go to Dashboard"
        >
          🌸 Blossom Notes
        </h1>
        <button onClick={onCreate}>+ New</button>
      </div>

      {/* 🗂️ Tabs */}
      <div className="tabs">
        <button
          className={view === 'notes' ? 'active' : ''}
          onClick={() => setView('notes')}
        >
          Notes 🌸
        </button>

        <button
          className={view === 'trash' ? 'active' : ''}
          onClick={() => setView('trash')}
        >
          Trash 🗑️
        </button>
      </div>

      {/* 📝 List */}
      <div className="note-list">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className={`note-item ${note.id === activeId ? 'active' : ''}`}
            onClick={() => {
              if (view === 'notes') {
                onSelect(note.id)
              }
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* 🌟 Stacked Layout for Title & Its Date Stamp */}
            <div className="note-title-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="note-title">{note.title}</div>
              {note.modifiedAt && (
                <span className="note-item-date" style={{ fontSize: '11px', color: '#ffa3be', marginTop: '2px' }}>
                  {note.modifiedAt}
                </span>
              )}
            </div>

            {/* 🗑️ DELETE (notes mode) */}
            {view === 'notes' && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteRequest(note.id)
                }}
              >
                ✕
              </button>
            )}

            {/* ♻️ RESTORE (trash mode) */}
            {view === 'trash' && (
              <button
                className="restore-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRestore(note.id)
                }}
              >
                Restore ♻️
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  
}