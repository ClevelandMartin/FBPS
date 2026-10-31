import { motion } from 'motion/react'

interface StringProps {
  stringId: string;
  nutPitch: number;
  fretCount: number;
  keyNotes: string[];
  keyNoteColors: Record<string, string>;
  showIntervals: boolean;
  pentatonicNotes: string[];
  rootNote: string;
  hasHighlightSelection: boolean;
  activeHighlightNotes: string[];
  intervalHighlightNotes: string[];
  getNote: (pitch: number) => string;
}

function String({ stringId, nutPitch, fretCount, keyNotes, keyNoteColors, showIntervals, pentatonicNotes, rootNote, hasHighlightSelection, activeHighlightNotes, intervalHighlightNotes, getNote }: StringProps) {
  const pitches = Array.from({ length: fretCount - 1 }, (_, index) => nutPitch + index + 1);

  return (
    <div className="string-row" role="row" aria-label={`Notes starting from ${getNote(nutPitch)}`}>
      {pitches.map(pitch => {
        const note = getNote(pitch);
        const isKeyNote = keyNotes.includes(note);
        const isRootNote = note === rootNote;
        const isPentatonicNote = pentatonicNotes.includes(note);
        const isHighlighted = !hasHighlightSelection
          ? true
          : activeHighlightNotes.includes(note) || intervalHighlightNotes.includes(note);
        return (
        <div className="note-position" role="gridcell" key={pitch}>
          <motion.span
            layoutId={`string-${stringId}-pitch-${pitch}`}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            animate={{
              opacity: isHighlighted ? 1 : 0,
              backgroundColor: !hasHighlightSelection
                ? 'transparent'
                : isRootNote ? '#aebca8' : isKeyNote ? showIntervals ? keyNoteColors[note] : '#9dbbc8' : '#705744',
              color: isRootNote ? '#263b34' : isKeyNote ? '#20343c' : keyNotes.length ? '#b1a99f' : '#f0ebe4',
            }}
            className={`note-label${isKeyNote ? ' key-note' : ''}${isRootNote ? ' root-note' : ''}`}
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
