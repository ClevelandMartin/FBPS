import './App.css'

interface StringProps {
  nutNote: string;
  noteList: string[];
  fretCount: number;
}

function String({ nutNote, noteList, fretCount }: StringProps) {
  const string = Array.from({ length: fretCount }, (_, fret) => {
    const noteIndex = (noteList.indexOf(nutNote) + fret) % noteList.length;
    return noteList[noteIndex];
  });

  return (
    <>
      <div>{string.map((fret, index) => <span key={index}>{fret} </span>)}</div>
    </>
  );
}

export default String
