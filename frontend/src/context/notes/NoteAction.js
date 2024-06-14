import { noteContext } from "./Context.js";
import React, { useState } from 'react';

const NoteAction = (props) => {
    const host = "http://localhost:5000";
    const [notes, setNote] = useState([]);
    const [publicNotes, setPublicNotes] = useState([]);
    const [noteFound, setNoteFound] = useState({});


    //get public notes
    const getPublicNotes = async () => {
        const response = await fetch(`${host}/api/note/fetchpublicnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        setPublicNotes(json.notes);
    }

    //get all notes
    const getNotes = async () => {
        const response = await fetch(`${host}/api/note/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
        });
        const json = await response.json();
        setNote(json.notes);
    }


    //add a note
    const addNote = async ({ question, code, description, companyTag, language, link, visibility, important }) => {
        const response = await fetch(`${host}/api/note/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ question, code, description, companyTag, language, link, visibility, important })
        })
        const json = await response.json();
        const note = json.note;
        setNote(notes.concat(note));
    }


    const editNote = async ({ _id, question, description, companyTag, language, code, link, visibility, important }) => {
        // API call to update the note
        await fetch(`${host}/api/note/updatenote/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({ question, description, companyTag, language, code, link, visibility, important })
        });
    
        // Update the note in the local state
        const newNotes = notes.map((note) => {
            if (note._id === _id) {
                return { ...note, question, description, companyTag, language, code, link, visibility, important }
            }
            return note;
        });
        setNote(newNotes);
    }
    

    //find a note by id
    const findNote = async(noteid) =>{
        const response = await fetch(`${host}/api/note/findnote/${noteid}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
        });
        const json = await response.json();
        setNoteFound(json.note[0]);
    }


    //Delete a note
    const deleteNote = async (_id) => {
        //todo call to API
        await fetch(`${host}/api/note/deletenote/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
        });
        //setnote
        setNote(notes.filter((note) => { return note._id !== _id }))
    }


    //Delete all notes
    const deleteAllNote = async () => {
        //todo call to API
        const response = await fetch(`${host}/api/note/deleteall`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
        });
        const json = await response.json();
        setNote([]);
        return json.deleteCount;
        //setnote
    }





    //Add a comment id to Note
    const addCommentIdToNote = async (noteId, commentId) => {
        //todo call to API
        const response = await fetch(`${host}/api/note/addcommentid/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({commentId})
        });
        const json = await response.json();
        setNote(json.note);
        //setnote
    }



    //Delete a comment id from Note
    const deleteCommentIdFromNote = async (noteId, commentId) => {
        //todo call to API
        const response = await fetch(`${host}/api/note/deletecommentid/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token')
            },
            body: JSON.stringify({commentId})
        });
        const json = await response.json();
        setNote(json.note);
        //setnote
    }





    return (
        <noteContext.Provider value={{ publicNotes, notes, getNotes, addNote, editNote, deleteNote, deleteAllNote, getPublicNotes, noteFound, findNote, addCommentIdToNote, deleteCommentIdFromNote }}>
            {props.children}
        </noteContext.Provider>
    )

}

export default NoteAction;