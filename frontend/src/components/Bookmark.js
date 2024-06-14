import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bookmark.css';
import { noteContext } from '../context/notes/Context.js';
import BookmarkItem from './BookmarkItem.js';
import AddNote from './AddNote.js';


const Bookmark = (props) => {
    //references
    const refSolutionModal = useRef(null);
    const refQuestionModal = useRef(null);
    const refClose = useRef(null);

    //Context API
    const context = useContext(noteContext);
    const { notes, editNote, getNotes, deleteAllNote } = context;

    //HOOKS
    const [note, setNote] = useState({ _id: "", question: "", description: "", code: "", language: "", companyTag: "", link: "", important: false });
    const navigate = useNavigate();


    //useEffect to protect unauthorised login
    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            getNotes();

            document.body.style.backgroundColor = 'black';
            document.getElementsByTagName('nav')[0].style.backgroundColor = 'black';
            document.getElementsByTagName('nav')[0].style.borderBottom = 'solid 1px rgb(135, 206, 235)';

            return () => {
                document.body.style.backgroundColor = '';
                document.getElementsByTagName('nav')[0].style.backgroundColor = '';
            };
        }
        else {
            navigate('/login');
        }
        // eslint-disable-next-line 
    }, []);

    //onChange handler
    const onChange = (event) => {
        event.preventDefault();
        setNote({ ...note, [event.target.name]: event.target.value });
    };

    //onClick handlers (function)
    const handleClickCloseAnswer = (event) => {
        event.preventDefault();
        refSolutionModal.current.style.display = 'none';
    };
    const handleClickSaveAnswer = (event) => {
        event.preventDefault();
        editNote({ ...note });
        refClose.current.click();
        props.showAlert("Solution saved successfuuly", "success");
    };
    const updateNote = (currentNote) => {
        refSolutionModal.current.style.display = 'block';
        setNote(currentNote);
    }
    const handleClickAddNewQuestion = () => {
        refQuestionModal.current.style.display = 'block';
    }
    const handleClickDeleteAllQuestions = async () => {
        const deleteCount = await deleteAllNote();
        if (deleteCount > 0) props.showAlert(`${deleteCount} notes were deleted successfully`, "success");
        else props.showAlert(`Nothing to delete`, "danger");
    }

    return (
        <>
            {/* Create a new Note: AddNote */}
            <AddNote refQuestionModal={refQuestionModal} showAlert={props.showAlert} />


            {/*Solution modal layout*/}
            <form className='solution-form' ref={refSolutionModal}>
                <div className="solution-modal">
                    <div className="solution-modal-body">
                        <textarea value={note.code} onChange={onChange} name="code" id="solution-modal-textarea" placeholder='Write solution'></textarea>
                        <div className='solution-modal-buttons'>
                            <button ref={refClose} onClick={handleClickCloseAnswer} type='button' className='solution-modal-button solution-modal-close-button'>Close</button>
                            <button onClick={handleClickSaveAnswer} disabled={note.code.length < 1} type='button' className={`solution-modal-button ${note.code.length < 1 ? 'solution-modal-disabled-save-button' : 'solution-modal-save-button'}`}>Save</button>
                        </div>
                    </div>
                </div>
            </form>


            <div>
                {/* Add and DeleteAll buttons */}
                <div className="bookmark-actions">
                    <button onClick={handleClickAddNewQuestion} type='button' className="bookmark-buttons" id='button-addMore'>{notes.length === 0 ? 'Add' : 'Add More'}</button>
                    <button onClick={handleClickDeleteAllQuestions} type='button' className="bookmark-buttons" id={notes.length < 1 ? 'disabled-button-deleteAll' : 'button-deleteAll'}>{notes.length === 0 ? 'Delete' : 'Delete All'}</button>
                </div>

                {/* Items/Elements to display*/}
                {Array.isArray(notes) && notes.map((note) => {
                    return <BookmarkItem note={note} updateNote={updateNote} key={note._id} showAlert={props.showAlert} isDashboard={false} />
                })}
            </div>

        </>
    );
}

export default Bookmark;