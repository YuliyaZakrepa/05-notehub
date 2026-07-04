
 import type { Note, NoteTag} from "../types/note";

 import axios from "axios";
 const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  
 const BASE_URL = "https://notehub-public.goit.study/api/notes"
  
 interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
 }
 interface CreateNote{
    
      title: string;
      content: string;
      tag: NoteTag
}
type DeleteNote = Record<string, never>;


 export async function fetchNotes(search:string, page:number, perPage:number): Promise<FetchNotesResponse>{
const {data} = await axios.get<FetchNotesResponse>(BASE_URL,
    {params:{search, page, perPage}, 
    headers: {Authorization: `Bearer ${token}`}});

return data;
 }
 export async function createNote (newNote: CreateNote):Promise<Note>{
    const {data} = await axios.post<Note>(BASE_URL, newNote, {
    headers: {Authorization: `Bearer ${token}`}});
    return data;

 }
 export async function deleteNote(noteId: Note['id']):Promise<DeleteNote> {
    const {data} =await axios.delete<DeleteNote>(`${BASE_URL}/${noteId}`,{
    headers: {Authorization: `Bearer ${token}`}})
    return data;

    
 }