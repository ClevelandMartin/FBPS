import { useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import './App.css'
import String from './String'

function App() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const MIN_FRETS = 12
  const MAX_FRETS = 22

  const [guitarStrings, setGuitarStrings] = useState([
    { id: 'low-e', pitch: 4 },
    { id: 'a', pitch: 9 },
    { id: 'd', pitch: 2 },
    { id: 'g', pitch: 7 },
    { id: 'b', pitch: 11 },
    { id: 'high-e', pitch: 4 },
  ])
  const [fretCount, setFretCount] = useState(MIN_FRETS + 1)
  const [selectedKey, setSelectedKey] = useState('')

  const addFretToAll = () => {
    setFretCount(currentFretCount => Math.min(MAX_FRETS + 1, currentFretCount + 1))
  }

  const removeFretFromAll = () => {
    setFretCount(currentFretCount => Math.max(MIN_FRETS + 1, currentFretCount - 1))
  }

  const addString = () => {
    setGuitarStrings(currentStrings => [
      {
        id: crypto.randomUUID(),
        pitch: 4,
      },
      ...currentStrings,
    ])
  }

  const removeString = (id) => {
    setGuitarStrings(currentStrings => currentStrings.filter(string => string.id !== id))
  }

  const shiftNutNoteUp = (id) => {
      setGuitarStrings(currentStrings => currentStrings.map(string => (
        string.id === id ? { ...string, pitch: string.pitch + 1 } : string
      )))
  }

  const shiftNutNoteDown = (id) => {
      setGuitarStrings(currentStrings => currentStrings.map(string => (
        string.id === id ? { ...string, pitch: string.pitch - 1 } : string
      )))
  }

  const displayedStrings = [...guitarStrings].reverse()
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]
  const selectedKeyIndex = notes.indexOf(selectedKey)
  const keyNotes = selectedKey
    ? majorScaleIntervals.map(interval => notes[(selectedKeyIndex + interval) % notes.length])
    : []
  const getNote = pitch => notes[(pitch % notes.length + notes.length) % notes.length]

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Instrument workspace</p>
          <h1>Fretboard Positioning System</h1>
          <p className="subtitle">A clear view of every note along the strings.</p>
        </div>
        <p className="byline">By Cleveland Martin</p>
      </header>

      <section className="workbench" aria-label="Guitar fretboard controls and notes">
        <div className="toolbar" aria-label="Fretboard controls">
          <div className="toolbar-group">
            <button type="button" className="control-button" onClick={addFretToAll} disabled={fretCount >= MAX_FRETS + 1}>Add fret</button>
            <button type="button" className="control-button" onClick={removeFretFromAll} disabled={fretCount <= MIN_FRETS + 1}>Remove fret</button>
          </div>
          <p className="board-summary">{guitarStrings.length} strings <span aria-hidden="true">/</span> {fretCount - 1} frets</p>
        </div>

        <LayoutGroup id="fretboard-notes">
        <div className="board-composition" style={{ '--string-count': guitarStrings.length, '--fret-count': Math.max(fretCount - 1, 1) }}>
          <aside className="string-control-panel" aria-label="String controls">
            <h2 className="string-controls-heading">Tuning</h2>
            {displayedStrings.map((guitarString, stringIndex) => (
              <div className="string-controls" key={guitarString.id}>
                <div className="string-actions">
                  <button type="button" className="tuning-button" onClick={() => shiftNutNoteUp(guitarString.id)} aria-label={`Raise string ${guitarStrings.length - stringIndex} open note`} title="Raise open note">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 14 6-6 6 6" />
                    </svg>
                  </button>
                  <button type="button" className="tuning-button" onClick={() => shiftNutNoteDown(guitarString.id)} aria-label={`Lower string ${guitarStrings.length - stringIndex} open note`} title="Lower open note">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 10 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </aside>

          <div className="fretboard-scroll" aria-label="Guitar fretboard">
            <div className="open-note-column" aria-label="Open string notes">
              {displayedStrings.map(guitarString => (
                <div className="open-note" key={guitarString.id}>
                  <motion.span
                    key={`${guitarString.id}-${guitarString.pitch}`}
                    layoutId={`string-${guitarString.id}-pitch-${guitarString.pitch}`}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className={keyNotes.includes(getNote(guitarString.pitch)) ? 'note-label key-note' : 'note-label'}
                  >
                    {getNote(guitarString.pitch)}
                  </motion.span>
                </div>
              ))}
            </div>
            <div className="fretboard-column">
              <div className="fretboard-layout">
                {displayedStrings.map(guitarString => (
                  <String
                    key={guitarString.id}
                    stringId={guitarString.id}
                    nutPitch={guitarString.pitch}
                    fretCount={fretCount}
                    keyNotes={keyNotes}
                    getNote={getNote}
                  />
                ))}
              </div>
              <div className="fret-labels" aria-label="Fret numbers">
                {Array.from({ length: Math.max(fretCount - 1, 0) }, (_, index) => <span className="fret-label" key={index}>{index + 1}</span>)}
              </div>
              <div className="key-selector">
                <label htmlFor="key-select">Key</label>
                <select id="key-select" value={selectedKey} onChange={event => setSelectedKey(event.target.value)}>
                  <option value="">None</option>
                  {notes.map(note => <option key={note} value={note}>{note}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="string-delete-column" aria-label="String actions">
            {displayedStrings.map((guitarString, stringIndex) => (
              <button
                className="icon-button trash-button"
                type="button"
                key={guitarString.id}
                onClick={() => removeString(guitarString.id)}
                aria-label={`Remove string ${guitarStrings.length - stringIndex}`}
                title="Remove string"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="m19 6-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            ))}
            <button className="icon-button add-string-button" type="button" onClick={addString} aria-label="Add string" title="Add string">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
        </LayoutGroup>
        <p className="board-caption">Open strings begin at 0. Each column advances one semitone.</p>
      </section>
    </main>
  )
}

export default App
