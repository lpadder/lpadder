import type { MidiJSON } from "@tonejs/midi";
import type { GroupedNotes } from "@/types/Midi";

import { getUIColor } from "@/utils/colors";
import { convertNoteLayout } from "@/utils/devices";
import { DEFAULT_NOVATION_PALETTE } from "@/utils/palettes";

export const parseMidiData = (midi_data: MidiJSON) => {
  /** Notes of the first track of the MIDI file. */
  const notes_data = midi_data.tracks[0].notes;

  /**
   * Here, we group the notes by time to setup the
   * setTimeouts for each group, when needed to.
   */
  const grouped_notes: GroupedNotes[] = [];

  /**
   * Delay in MS. Kind of a "hack" to prevent pads from blinking.
   * TODO: Make it configurable.
   */
  const delay = 20;

  // Group the notes by time.
  notes_data.forEach(note => {
    const start_time = note.time * 1000;
    const duration = (note.duration * 1000) + delay;

    const convert_results = convertNoteLayout(note.midi, "drum_rack", "programmer");
    if (!convert_results.success) return;

    const midi = convert_results.note;

    const velocity = note.velocity * 127;
    const color = DEFAULT_NOVATION_PALETTE[velocity];
    const ui_color = getUIColor(color);

    const parsed_note: typeof grouped_notes[number]["notes"][number] = {
      velocity,
      duration,
      ui_color,
      color,
      midi
    };

    // Find the group.
    const group = grouped_notes.find(
      group => group.start_time === start_time
    );

    // If the group doesn't exist, create it.
    if (!group) {
      grouped_notes.push({
        start_time,
        notes: [parsed_note]
      });

      return;
    }

    group.notes.push(parsed_note);
  });

  return grouped_notes;
};
