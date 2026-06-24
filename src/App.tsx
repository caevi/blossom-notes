import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import LovePopup from './components/LovePopup'
import FloatingHearts from './components/FloatingHearts'

import { seedNotes } from './data/seedNotes'
import './styles/theme.css'

export type Note = {
  id: string
  title: string
  content: string
  modifiedAt?: string
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.length > 0 ? parsed : seedNotes
    }
    return seedNotes
  })

  const [trash, setTrash] = useState<Note[]>(() => {
    const saved = localStorage.getItem('trash')
    return saved ? JSON.parse(saved) : []
  })

  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    return localStorage.getItem('activeNoteId') || ''
  })

  // ⚠️ This tracks notes queued for PERMANENT deletion
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [view, setView] = useState<'notes' | 'trash'>('notes')

  const activeNote = view === 'notes' 
    ? notes.find(n => n.id === activeNoteId)
    : trash.find(n => n.id === activeNoteId)

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('trash', JSON.stringify(trash))
  }, [trash])

  useEffect(() => {
    localStorage.setItem('activeNoteId', activeNoteId)
  }, [activeNoteId])

  // Helper to generate a clean, detailed timestamp (e.g., "Jun 24, 2026 • 1:44 AM")
  const generateTimestamp = () => {
    const datePart = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
    const timePart = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
    return `${datePart} • ${timePart}`
  }

  function createNote() {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note 💕',
      content: 'Start writing something sweet...',
      modifiedAt: generateTimestamp()
    }
    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)
    setView('notes')
  }

  function updateNote(updated: Note) {
    setNotes(notes.map(n => (n.id === updated.id ? updated : n)))
  }

  // 🚀 INSTANT TRASH
  function deleteNote(id: string) {
    const noteToDelete = notes.find(n => n.id === id)
    if (!noteToDelete) return

    setTrash([noteToDelete, ...trash])
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)

    if (id === activeNoteId) {
      setActiveNoteId('')
    }
  }

  // 🔒 PERMANENT ERASE
  function permanentlyDeleteNote(id: string) {
    setTrash(trash.filter(n => n.id !== id))
    if (id === activeNoteId) {
      setActiveNoteId('')
    }
    setConfirmDeleteId(null) // Close popup
  }

  function restoreNote(id: string) {
    const note = trash.find(n => n.id === id)
    if (!note) return

    setTrash(trash.filter(n => n.id !== id))
    setNotes([note, ...notes])
    setActiveNoteId(note.id)
  }

  return (
    <div className="app-container" style={{ position: 'relative' }}>
   
    


  

      <FloatingHearts />
      <LovePopup />

      <Sidebar
        notes={view === 'notes' ? notes : trash}
        activeId={activeNoteId}
        onSelect={setActiveNoteId}
        onCreate={createNote}
        onDeleteRequest={deleteNote}
        view={view}
        setView={(v) => {
          setView(v)
          setActiveNoteId('')
        }}
        onRestore={restoreNote}
      />

      <NoteEditor
        note={activeNote}
        notes={view === 'notes' ? notes : trash}
        view={view}
        onSelect={setActiveNoteId}
        onUpdate={updateNote}
        onDeleteForever={(id) => setConfirmDeleteId(id)}
      />

      {/* ⚠️ CONFIRM PERMANENT DELETE POPUP */}
      {confirmDeleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p style={{ fontWeight: 'bold', color: '#ff5c8a' }}>Warning! ⚠️</p>
            <p>Are you sure you want to delete this note forever? This cannot be undone. 🗑️</p>
            <div className="confirm-buttons">
              <button onClick={() => permanentlyDeleteNote(confirmDeleteId)}>Delete Forever</button>
              <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}