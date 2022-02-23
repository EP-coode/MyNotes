import client from "../client";
import { CreateNote } from "../interfaces/createNote";
import { Note } from "../interfaces/note";
import { NotesFilter } from "../interfaces/notesFilter";

export async function getNotes(
  acces_token: string,
  { limit, page, phrase, orderByDateAsc, categories }: NotesFilter
): Promise<[Note]> {
  const params = new Map<string, string>();

  if (limit) {
    params.set("limit", limit.toString());
  }
  if (page) {
    params.set("page", page.toString());
  }
  if (phrase) {
    params.set("phrese", phrase);
  }
  if (orderByDateAsc) {
    params.set("orderByDateAsc", String(orderByDateAsc).toString());
  }
  if (categories) {
    params.set("categories", categories.join(","));
  }

  let endpoint = "/notes";
  let firstRound = true;
  params.forEach((v, paramName) => {
    if (firstRound) {
      firstRound = false;
      endpoint += "?";
      endpoint += `${paramName}=${v}`;
    }

    endpoint += `&${paramName}=${v}`;
  });

  return client<[Note], undefined>(endpoint, "GET", undefined, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function getNotesById(
  acces_token: string,
  noteId: number
): Promise<Note> {
  return client<Note, undefined>(`/note/${noteId}`, "GET", undefined, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function createNote(acces_token: string, createNote: CreateNote) {
  return client<Note, CreateNote>("/notes", "PATCH", createNote, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function updateNote(
  acces_token: string,
  noteId: number,
  createNote: CreateNote
) {
  return client<Note, CreateNote>(`/note/${noteId}`, "POST", createNote, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function deleteNote(acces_token: string, noteId: number) {
  return client(`/note/${noteId}`, "DELETE", undefined, {
    Authorization: `Bearer ${acces_token}`,
  });
}

export async function getTitleHints(
  acces_token: string,
  phrase: string
): Promise<[String]> {
  return client<[String], undefined>(
    `/notes/search-hints?title=${phrase}`,
    "GET",
    undefined,
    {
      Authorization: `Bearer ${acces_token}`,
    }
  );
}
