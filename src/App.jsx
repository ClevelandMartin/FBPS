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
  const [selectedMode, setSelectedMode] = useState('ionian')
  const [showIntervals, setShowIntervals] = useState(false)
  const [showPentatonic, setShowPentatonic] = useState(false)
  const [showIonianPentatonic, setShowIonianPentatonic] = useState(false)

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
  const modes = {
    ionian: [0, 2, 4, 5, 7, 9, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    aeolian: [0, 2, 3, 5, 7, 8, 10],
    locrian: [0, 1, 3, 5, 6, 8, 10],
  }
  const selectedKeyIndex = notes.indexOf(selectedKey)
  const keyNotes = selectedKey
    ? modes[selectedMode].map(interval => notes[(selectedKeyIndex + interval) % notes.length])
    : []
  const scaleDegreeColors = ['#aebca8', '#9dbbc8', '#d6cb98', '#b8b4aa', '#c7895e', '#c6817c', '#a899bd']
  const keyNoteColors = Object.fromEntries(keyNotes.map((note, degreeIndex) => [note, scaleDegreeColors[degreeIndex]]))
  const pentatonicNotes = selectedKey
    ? modes[selectedMode]
      .filter((_, degreeIndex) => [0, 1, 2, 4, 5].includes(degreeIndex))
      .map(interval => notes[(selectedKeyIndex + interval) % notes.length])
    : []
  const modeTonicOffsets = {
    ionian: 0,
    dorian: 2,
    phrygian: 4,
    lydian: 5,
    mixolydian: 7,
    aeolian: 9,
    locrian: 11,
  }
  const relativeIonianIndex = (selectedKeyIndex - modeTonicOffsets[selectedMode] + notes.length) % notes.length
  const ionianPentatonicNotes = selectedKey
    ? [0, 2, 4, 7, 9].map(interval => notes[(relativeIonianIndex + interval) % notes.length])
    : []
  const outlinedPentatonicNotes = [
    ...(showPentatonic ? pentatonicNotes : []),
    ...(showIonianPentatonic ? ionianPentatonicNotes : []),
  ]
  const activeHighlightNotes = showPentatonic
    ? pentatonicNotes
    : showIonianPentatonic
      ? ionianPentatonicNotes
      : selectedKey
        ? keyNotes
        : []
  const intervalHighlightNotes = selectedKey && showIntervals
    ? showPentatonic
      ? pentatonicNotes
      : showIonianPentatonic
        ? ionianPentatonicNotes
        : keyNotes
    : []
  const intervalLegend = [
    { label: 'Root', color: scaleDegreeColors[0] },
    { label: '2nd', color: scaleDegreeColors[1] },
    { label: '3rd', color: scaleDegreeColors[2] },
    { label: '4th', color: scaleDegreeColors[3] },
    { label: '5th', color: scaleDegreeColors[4] },
    { label: '6th', color: scaleDegreeColors[5] },
    { label: '7th', color: scaleDegreeColors[6] },
  ]
  const hasHighlightSelection = activeHighlightNotes.length > 0 || intervalHighlightNotes.length > 0
  const fretInlayMarkers = Array.from({ length: fretCount - 1 }, (_, index) => index + 1)
    .flatMap(fretNumber => {
      const normalized = fretNumber % 12
      if (normalized === 3 || normalized === 5 || normalized === 7 || normalized === 9) {
        return [{ fretNumber, stringPositions: [2] }]
      }

      if (normalized === 0) {
        return [{ fretNumber, stringPositions: [0, 4] }]
      }

      return []
    })
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

          <div className="board-controls" aria-label="Fretboard controls">
            <div className="toolbar-group">
              <button type="button" className="control-button" onClick={addFretToAll} disabled={fretCount >= MAX_FRETS + 1}>Add fret</button>
              <button type="button" className="control-button" onClick={removeFretFromAll} disabled={fretCount <= MIN_FRETS + 1}>Remove fret</button>
            </div>
            <p className="board-summary">{guitarStrings.length} strings <span aria-hidden="true">/</span> {fretCount - 1} frets</p>
          </div>

          <div className="fretboard-scroll" aria-label="Guitar fretboard">
            <div className="open-note-column" aria-label="Open string notes">
              {displayedStrings.map(guitarString => {
                const note = getNote(guitarString.pitch)
                const isKeyNote = keyNotes.includes(note)
                const isRootNote = note === selectedKey
                const isPentatonicNote = outlinedPentatonicNotes.includes(note)
                const isHighlighted = !hasHighlightSelection
                  ? true
                  : activeHighlightNotes.includes(note) || intervalHighlightNotes.includes(note)
                return (
                  <div className="open-note" key={guitarString.id}>
                  <motion.span
                    key={`${guitarString.id}-${guitarString.pitch}`}
                    layoutId={`string-${guitarString.id}-pitch-${guitarString.pitch}`}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    animate={{
                      opacity: isHighlighted ? 1 : 0,
                      backgroundColor: !selectedKey && !showIntervals && !showPentatonic && !showIonianPentatonic
                        ? 'transparent'
                        : isRootNote ? '#aebca8' : isKeyNote ? showIntervals ? keyNoteColors[note] : '#9dbbc8' : 'transparent',
                      color: isRootNote ? '#263b34' : isKeyNote ? '#20343c' : selectedKey ? '#95836e' : '#3d3024',
                    }}
                    className={`note-label${isKeyNote ? ' key-note' : ''}${isRootNote ? ' root-note' : ''}`}
                  >
                    {note}
                  </motion.span>
                  </div>
                )
              })}
            </div>
            <div className="fretboard-column">
              <div className="fretboard-layout">
                <div className="fretboard-marker-layer" aria-hidden="true">
                  {fretInlayMarkers.flatMap(({ fretNumber, stringPositions }) => {
                    const color = showIntervals && selectedKey ? '#d1b68b' : '#b49367'

                    return stringPositions.map(stringIndex => (
                      <div
                        key={`${fretNumber}-${stringIndex}`}
                        className={`fretboard-marker-set${stringPositions.length > 1 ? ' fretboard-marker-set--double' : ''}`}
                        style={{
                          left: `${((fretNumber - 0.5) / (fretCount - 1)) * 100}%`,
                          top: `${((stringIndex + 0.5) / guitarStrings.length) * 100}%`,
                        }}
                      >
                        <span className="fretboard-marker" style={{ backgroundColor: color }} />
                      </div>
                    ))
                  })}
                </div>
                {displayedStrings.map(guitarString => (
                  <String
                    key={guitarString.id}
                    stringId={guitarString.id}
                    nutPitch={guitarString.pitch}
                    fretCount={fretCount}
                    keyNotes={keyNotes}
                    keyNoteColors={keyNoteColors}
                    showIntervals={showIntervals}
                    pentatonicNotes={outlinedPentatonicNotes}
                    rootNote={selectedKey}
                    hasHighlightSelection={hasHighlightSelection}
                    activeHighlightNotes={activeHighlightNotes}
                    intervalHighlightNotes={intervalHighlightNotes}
                    getNote={getNote}
                  />
                ))}
              </div>
              <div className="fret-labels" aria-label="Fret numbers">
                {Array.from({ length: Math.max(fretCount - 1, 0) }, (_, index) => <span className="fret-label" key={index}>{index + 1}</span>)}
              </div>
              <div className="scale-selectors">
                <div className="key-selector">
                  <label htmlFor="key-select">Key</label>
                  <select
                    id="key-select"
                    value={selectedKey}
                    onChange={event => {
                      const nextKey = event.target.value
                      setSelectedKey(nextKey)
                      if (!nextKey) {
                        setShowIntervals(false)
                        setShowPentatonic(false)
                        setShowIonianPentatonic(false)
                      }
                    }}
                  >
                    <option value="">None</option>
                    {notes.map(note => <option key={note} value={note}>{note}</option>)}
                  </select>
                </div>
                <div className="key-selector">
                  <label htmlFor="mode-select">Mode</label>
                  <select id="mode-select" value={selectedMode} onChange={event => setSelectedMode(event.target.value)}>
                    {Object.keys(modes).map(mode => <option key={mode} value={mode}>{mode[0].toUpperCase() + mode.slice(1)}</option>)}
                  </select>
                </div>
                <label className={`pentatonic-toggle${!selectedKey ? ' is-disabled' : ''}`} htmlFor="show-intervals">
                  <input
                    id="show-intervals"
                    type="checkbox"
                    checked={showIntervals}
                    disabled={!selectedKey}
                    onChange={event => {
                      if (!selectedKey) return
                      setShowIntervals(event.target.checked)
                    }}
                  />
                  Show Intervals
                </label>
                <label className={`pentatonic-toggle${!selectedKey ? ' is-disabled' : ''}`} htmlFor="show-pentatonic">
                  <input
                    id="show-pentatonic"
                    type="checkbox"
                    checked={showPentatonic}
                    disabled={!selectedKey}
                    onChange={event => {
                      if (!selectedKey) return
                      const checked = event.target.checked
                      setShowPentatonic(checked)
                      if (checked) setShowIonianPentatonic(false)
                    }}
                  />
                  Show pentatonic
                </label>
                <label className={`pentatonic-toggle${!selectedKey ? ' is-disabled' : ''}`} htmlFor="show-ionian-pentatonic">
                  <input
                    id="show-ionian-pentatonic"
                    type="checkbox"
                    checked={showIonianPentatonic}
                    disabled={!selectedKey}
                    onChange={event => {
                      if (!selectedKey) return
                      const checked = event.target.checked
                      setShowIonianPentatonic(checked)
                      if (checked) setShowPentatonic(false)
                    }}
                  />
                  Ionian Pentatonic
                </label>
                <div className="interval-legend" aria-label="Interval color key">
                  {intervalLegend.map(({ label, color }) => (
                    <div className="interval-legend-item" key={label}>
                      <span className="interval-swatch" style={{ backgroundColor: color }} aria-hidden="true" />
                      <span className="interval-label">{label}</span>
                    </div>
                  ))}
                </div>
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
