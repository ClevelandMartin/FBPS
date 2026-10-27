import { motion } from 'motion/react'

interface StringProps {
  stringId: string;
  nutPitch: number;
  fretCount: number;
  keyNotes: string[];
  getNote: (pitch: number) => string;
}

function String({ stringId, nutPitch, fretCount, keyNotes, getNote }: StringProps) {
  const pitches = Array.from({ length: fretCount - 1 }, (_, index) => nutPitch + index + 1);

  return (
    <div className="string-row" role="row" aria-label={`Notes starting from ${getNote(nutPitch)}`}>
      {pitches.map(pitch => {
        const note = getNote(pitch);
        return (
        <div className="note-position" role="gridcell" key={pitch}>
          <motion.span
            layoutId={`string-${stringId}-pitch-${pitch}`}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className={keyNotes.includes(note) ? 'note-label key-note' : 'note-label'}
          >
            {note}
          </motion.span>
        </div>
        )
      })}
    </div>
  );
}

export default String
