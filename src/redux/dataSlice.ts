import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NoteType {
  id: number
  title: string; 
  text: string;
}

interface DataSliceType {
  notes: NoteType[];
  privateNotes: NoteType[];
}

const initialState = {
    notes: [],
    privateNotes: []
} as DataSliceType

const dataSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    saveNote(state, action: PayloadAction<NoteType>){
      const index = state.notes.map(note => note.id).indexOf(action.payload.id);

      if(index === -1){
        state.notes = [action.payload, ...state.notes]
      }
      else{
        state.notes[index] = action.payload;
      }      
    },
    savePrivateNote(state, action: PayloadAction<NoteType>){
      const index = state.privateNotes.map(note => note.id).indexOf(action.payload.id);

      if(index === -1){
        state.privateNotes = [action.payload, ...state.privateNotes]
      }
      else{
        state.privateNotes[index] = action.payload;
      }      
    },
    removeNote(state, action: PayloadAction<number>){
      try{
        const index = state.notes.map(note => note.id).indexOf(action.payload);
        const newData = state.notes.splice(index, 1);

        state.notes = newData;
      }
      catch(ex) {
        console.warn('filed remove note with id', action.payload)
      }
    },
    removePrivateNote(state, action: PayloadAction<number>){
      try{
        const index = state.privateNotes.map(note => note.id).indexOf(action.payload);
        const newData = state.privateNotes.splice(index, 1);

        state.privateNotes = newData;
      }
      catch(ex) {
        console.warn('filed remove note with id', action.payload)
      }
    },
  }
})

export const { saveNote, savePrivateNote, removeNote, removePrivateNote } = dataSlice.actions
export default dataSlice.reducer;