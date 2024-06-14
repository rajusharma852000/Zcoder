import React, { useState, useContext } from 'react';
import {noteContext} from '../context/notes/Context.js';
import './AddNote.css';

const AddNote = ({ refQuestionModal, showAlert }) => {
    const context = useContext(noteContext);
    const initialNote = { question: "", description: "", code: "", language: "Javascript", companyTag: "", link: "" };
    const [note, setNote] = useState(initialNote);
    const { addNote } = context;

    const onChange = (event) => {
        event.preventDefault();
        setNote({ ...note, [event.target.name]: event.target.value });
    }
    const handleClickSaveQuestion = (event) => {
        event.preventDefault();
        addNote(note);
        refQuestionModal.current.style.display = 'none';
        showAlert("Problem saved successfully", "success");
        setNote(initialNote);
    }
    const handleClickCloseQuestion = (event) => {
        event.preventDefault();
        refQuestionModal.current.style.display = 'none';

    }
    return (
        <>
            <form className='question-form' ref={refQuestionModal}>
                <div className="question-modal">
                    <label htmlFor="question" className="question-modal-label"><strong>Enter Problem Statement</strong></label>
                    <textarea onChange={onChange} placeholder='Cannot be empty' type="text" value={note.question} id="question" name='question' required />
                    <button onClick={handleClickSaveQuestion} disabled={note.question.length < 1} type="submit" className={`question-modal-button ${note.question.length < 1 ? 'question-modal-disabled-save-button': 'question-modal-save-button'}`}>Save</button>
                    <button onClick={handleClickCloseQuestion} type="submit" className="question-modal-button question-modal-close-button">Close</button>
                </div>
            </form>
        </>
    )
}

export default AddNote;

