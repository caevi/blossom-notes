import type { Note } from '../App'
import { motion } from 'framer-motion'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style' 
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import { useEffect, useState } from 'react'

type Props = {
  note?: Note
  notes: Note[]
  view: 'notes' | 'trash'
  onSelect: (id: string) => void
  onUpdate: (note: Note) => void
  onDeleteForever: (id: string) => void
}

export default function NoteEditor({ note, notes, view, onSelect, onUpdate, onDeleteForever }: Props) {
  // 🌟 Local state for the title to guarantee lightning-fast typing responses
  const [localTitle, setLocalTitle] = useState(note?.title || '')

  const getTimestamp = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // 🌸 Configure the Rich Text Editor Engine
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({
        HTMLAttributes: {
          class: 'embedded-note-image',
        },
      }),
    ],
    content: note?.content || '',
    onUpdate: ({ editor }) => {
      if (note) {
        onUpdate({
          ...note,
          content: editor.getHTML(), 
          modifiedAt: getTimestamp()
        })
      }
    },
  })

  // 🌟 FIX: Reset states ONLY when explicitly selecting/swapping to a different note document
  useEffect(() => {
    if (note) {
      setLocalTitle(note.title)
      
      if (editor && editor.getHTML() !== note.content) {
        editor.commands.setContent(note.content)
      }
    }
  }, [note?.id, editor])

  // 🌟 Sync editable permissions depending on if it's in the active list or trash bin
  useEffect(() => {
    if (editor) {
      editor.setEditable(view !== 'trash')
    }
  }, [view, editor])

  // Handle live title keystroke propagation safely
  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle)
    if (note) {
      onUpdate({
        ...note,
        title: newTitle,
        modifiedAt: getTimestamp()
      })
    }
  }

  // Handle local image file importing
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editor) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          editor.commands.setImage({ src: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // DASHBOARD GRID VIEW
  if (!note) {
    return (
      <motion.div className="editor dashboard-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="dashboard-header">
          <h2>{view === 'notes' ? 'Your Recent Blossoms 🌸' : 'Trash Bin 🗑️'}</h2>
          <p>{view === 'notes' ? 'Pick up right where you left off' : 'Items here will be permanently deleted if clicked ✕'}</p>
        </div>

        <div className="sticky-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              {view === 'notes' ? 'No notes found. Create a new one to start! 💕' : 'Your trash is completely clean! ✨'}
            </div>
          ) : (
            notes.map((n, index) => (
              <motion.div
                key={n.id}
                className="sticky-note"
                onClick={() => onSelect(n.id)}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.04, type: 'spring', stiffness: 90 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 15px 30px rgba(255, 143, 177, 0.2)' }}
              >
                {view === 'trash' && (
                  <button className="sticky-delete-forever" onClick={(e) => { e.stopPropagation(); onDeleteForever(n.id); }}>✕</button>
                )}
                <div className="sticky-date">{n.modifiedAt || 'No Date'}</div>
                <h3 className="sticky-title">{n.title}</h3>
                <p className="sticky-preview">{n.content.replace(/<[^>]*>/g, '')}</p>
                <div className="sticky-footer">{view === 'notes' ? '✨ Open note' : '♻️ View / Restore'}</div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    )
  }

  // ACTIVE EDITING STATE
  return (
    <motion.div className="editor" key={note.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
      <div className="editor-meta">
        <span className="editor-date">Last updated: {note.modifiedAt || 'Just now'}</span>
      </div>

      <input
        className="title-input"
        value={localTitle}
        disabled={view === 'trash'}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Untitled Note"
      />

      {/* 🌸 Modern Ribbon Formatting Toolbar */}
      {view !== 'trash' && editor && (
        <div className="toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
            <b>B</b>
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
            <u>U</u>
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
            <i>I</i>
          </button>
          
          {/* Quick Color Swatches */}
          <input 
            type="color" 
            onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#ff5c8a'}
            className="color-picker"
          />

          {/* Picture Import Upload Trigger */}
          <label className="image-upload-btn">
            🖼️ Photo
            <input type="file" accept="image/*" onChange={addImage} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      {/* Tiptap Canvas Area */}
      <div className="rich-editor-wrapper">
        <EditorContent editor={editor} className="content-input rich-editor" />
      </div>
    </motion.div>
  )
}