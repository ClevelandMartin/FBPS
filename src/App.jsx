import { Fragment, useState } from 'react'
import './App.css'
import String from './String'

function App() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  const [guitarStrings, setGuitarStrings] = useState([
    { id: 'low-e', nutNote: notes.at(4) },
    { id: 'a', nutNote: notes.at(9) },
    { id: 'd', nutNote: notes.at(2) },
    { id: 'g', nutNote: notes.at(7) },
    { id: 'b', nutNote: notes.at(11) },
    { id: 'high-e', nutNote: notes.at(4) },
  ])
  const [fretCount, setFretCount] = useState(13)

  const addFretToAll = () => {
    setFretCount(currentFretCount => currentFretCount + 1)
  }

  const removeFretFromAll = () => {
    setFretCount(currentFretCount => Math.max(0, currentFretCount - 1))
  }

  const addString = () => {
    setGuitarStrings(currentStrings => [
      ...currentStrings,
      {
        id: crypto.randomUUID(),
        nutNote: notes.at(4),
      },
    ])
  }

  const removeString = (id) => {
    setGuitarStrings(currentStrings => currentStrings.filter(string => string.id !== id))
  }

  const shiftNutNoteUp = (id) => {
      setGuitarStrings(currentStrings => currentStrings.map(string => (
        string.id === id ? { ...string, nutNote: notes[(notes.indexOf(string.nutNote) + 1) % notes.length] } : string
      )))
  }

  const shiftNutNoteDown = (id) => {
      setGuitarStrings(currentStrings => currentStrings.map(string => (
        string.id === id ? { ...string, nutNote: notes[(notes.indexOf(string.nutNote) - 1 + notes.length) % notes.length] } : string
      )))
  }

  return (
    <>
      <h1>Fretboard Positioning System</h1>
      <p>A tool for navigating the fretboard.</p>
      <p>By Cleveland Martin</p>
      &nbsp;
      <button onClick={addString}>Add String</button>
      <button onClick={addFretToAll}>Add Fret to All Strings</button>
      <button onClick={removeFretFromAll}>Remove Fret from All Strings</button>
      &nbsp;
      {[...guitarStrings].reverse().map(guitarString => (<Fragment key={guitarString.id}>
        <button style={{ width: '20%' }} onClick={() => shiftNutNoteUp(guitarString.id)}>Shift Nut Note Up</button>
        <button style={{ width: '20%' }} onClick={() => shiftNutNoteDown(guitarString.id)}>Shift Nut Note Down</button>
        <String
          nutNote={guitarString.nutNote}
          noteList={notes}
          fretCount={fretCount}
        />
        <button  style={{ width: '20%' }} onClick={() => removeString(guitarString.id)}>Remove String</button>
        &nbsp;

        </Fragment>
      ))}
    </>
  )
}

export default App
