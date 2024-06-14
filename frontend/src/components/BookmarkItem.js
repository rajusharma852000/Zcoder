import React, { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bookmark.css';
import './AddNote.css';
import { noteContext, authContext } from '../context/notes/Context';
//importing syntax highlighter and themes//
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';



const BookmarkItem = (props) => {

    //prop drilling and context API
    const context = useContext(noteContext);
    const authcontext = useContext(authContext);
    const { deleteNote, editNote, addNote } = context;
    const { getUser, user } = authcontext;
    const { note, updateNote } = props;

    //creating refrences
    const refImportant = useRef(null);
    const refQuestionModal = useRef(null);
    const refLinkModal = useRef(null);

    //custom styles for syntax highlighter
    const customStyleTomorrow = { ...tomorrow, 'pre[class*="language-"]': { ...tomorrow['pre[class*="language-"]'], backgroundColor: '#000622', margin: '0px' } };
    const customAtomOneDark = { ...atomOneDark, hljs: { ...atomOneDark.hljs, backgroundColor: '#000622' } };
    const mystyle = {
        lineHeight: '1.5rem',
        fontFamily: 'sans-sarif',
        fontSize: '1rem',
    }

    //useState HOOK
    const navigate = useNavigate();
    const [noteToEdit, setNoteToEdit] = useState(note);
    const [selectedQuestion, setSelectedQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [visibility, setVisibility] = useState(note.visibility);
    const [bookmark, setBookmark] = useState(false);

    //useEffect
    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            getUser();
        }
        // eslint-disable-next-line
    }, [])

    //toogle (function)
    const toogleQuesstion = (show) => {
        if (selectedQuestion === show) {
            return setSelectedQuestion(!show);
        }
        return setSelectedQuestion(show);
    }
    const toogleAnswer = (show) => {
        if (selectedAnswer === show) {
            return setSelectedAnswer(!show);
        }
        return setSelectedAnswer(show);
    }

    //onClick handlers (function)
    const handleClickImportant = (event) => {
        const isImportant = !note.important;
        const updatedNote = { ...note, important: !note.important };
        editNote(updatedNote);
        if (isImportant) props.showAlert("Marked as important", "success");
    };
    const handleClickDelete = () => {
        deleteNote(note._id);
        props.showAlert("Deleted successfully", "success");
    }
    const handleClickEdit = () => {
        refQuestionModal.current.style.display = 'block';
    }
    const handleClickLink = () => {
        refLinkModal.current.style.display = 'block';
    }
    const handleClickRedirect = () => {
        if (noteToEdit.link.length > 0) window.open(noteToEdit.link, '_blank');
    }
    const handleClickUpdateQuestion = (event) => {
        event.preventDefault();
        editNote(noteToEdit);
        refQuestionModal.current.style.display = 'none';
        props.showAlert("Problem updated successfully", "success");
    }
    const handleClickCloseQuestion = (event) => {
        event.preventDefault();
        refQuestionModal.current.style.display = 'none';
    }
    const handleClickAddLink = (event) => {
        event.preventDefault();
        editNote(noteToEdit);
        refLinkModal.current.style.display = 'none';
        props.showAlert("Link added successfully", "success");
    }
    const handleClickCloseLink = (event) => {
        event.preventDefault();
        refLinkModal.current.style.display = 'none';
    }
    const handleClickBookmark = () => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        }
        else if (!bookmark) {
            setBookmark(true);
            addNote({ ...note, visibility: 'private' });
            props.showAlert("Problem bookmarked successfully", "success");
        }
    }

    //onChange handlers (function)
    const onChangeForQuestion = (event) => {
        event.preventDefault();
        setNoteToEdit({ ...noteToEdit, [event.target.name]: event.target.value });
    }
    const onChangeForLink = (event) => {
        event.preventDefault();
        setNoteToEdit({ ...noteToEdit, [event.target.name]: event.target.value });
    }
    const onChangeVisibility = (event) => {
        setVisibility(event.target.value);
        editNote({ ...note, visibility: event.target.value })
        props.showAlert(`Visibility: ${event.target.value}`, "success");

    }
    const handleClickComment = () =>{
        if(localStorage.getItem('auth-token')){
            navigate(`/DisplayItem/${note._id}`);
        }
        else{
            navigate('/login');
        }
    }
    const own = () => {
        if (user._id !== note.user) {
            return false;
        }
        return true;
    }

    return (
        <>
            {/*1. modal to add link question */}
            <form className='link-form' ref={refLinkModal}>
                <div className="link-modal">
                    <label htmlFor="link" className="link-modal-label"><strong>Enter the link</strong></label>
                    <input onChange={onChangeForLink} placeholder='link' type="text" value={noteToEdit.link} id="link" name='link' />
                    <button onClick={handleClickAddLink} disabled={noteToEdit.link.length < 1} type="submit" className={`question-modal-button ${noteToEdit.link.length < 1 ? 'question-modal-disabled-save-button' : 'question-modal-save-button'}`}>Add</button>
                    <button onClick={handleClickCloseLink} type="submit" className="question-modal-button question-modal-close-button">Close</button>
                </div>
            </form>
            {/*2. modal to update question */}
            <form className='question-form' ref={refQuestionModal}>
                <div className="question-modal">
                    <label htmlFor="question" className="question-modal-label"><strong>Enter Problem Statement</strong></label>
                    <textarea onChange={onChangeForQuestion} placeholder='question' type="text" value={noteToEdit.question} id="question" name='question' />
                    <button onClick={handleClickUpdateQuestion} disabled={noteToEdit.question.length < 1} type="submit" className={`question-modal-button ${noteToEdit.question.length < 1 ? 'question-modal-disabled-save-button' : 'question-modal-save-button'}`}>update</button>
                    <button onClick={handleClickCloseQuestion} type="submit" className="question-modal-button question-modal-close-button">Close</button>
                </div>
            </form>

            {/* 3. bookmark container */}
            <div className="bookmark-card">
                <div className="bookmark-problem-statement">

                    {/*4. accordian */}
                    <div className="bookmark-problem-title" onClick={() => toogleQuesstion(true)}>
                        <h5 className='bookmark-h3'>Question:</h5>
                        <span className='tool-icon accordian-icon'>{selectedQuestion === true ? '\u2B9F' : '\u2B9D'}</span>
                    </div>
                    {/*5. syntax highlighter */}
                    <div style={mystyle} className={selectedQuestion === true ? 'boomark-show-question' : 'boomark-hide-question'}>
                        <SyntaxHighlighter language="jsx" style={customStyleTomorrow}
                            lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
                            wrapLines={true} >
                            {note.question}
                        </SyntaxHighlighter>
                    </div>

                    {/*6. space */}
                    <br />
                    <hr style={{ boxShadow: '0 0 0 0.1px black' }} />
                    <br />

                    {/*7. accordian */}
                    <div className="bookmark-problem-title" onClick={() => toogleAnswer(true)}>
                        <h5 className='bookmark-h3'>Solution:</h5>
                        <span className='tool-icon accordian-icon'>{selectedAnswer === true ? '\u2B9F' : '\u2B9D'}</span>
                    </div>
                    {/*8. syntax Highlighter */}
                    <div style={mystyle} className={selectedAnswer === true ? 'boomark-show-question' : 'boomark-hide-question'}>
                        <SyntaxHighlighter language="javascript" style={customAtomOneDark}>
                            {note.code}
                        </SyntaxHighlighter>
                    </div>
                </div>

                {/*9. space */}
                <br />
                <hr style={{ boxShadow: '0 0 0 0.1px black' }} />
                <br />

                {/*10. tools */}
                <div className="bookmark-tools">
                    {localStorage.getItem('auth-token') &&
                        <>
                            {own() && !props.isDashboard && <>
                                <div onClick={() => { updateNote(note) }} style={{display: 'inline-block'}}>
                                    <span  className="tool-icon" id="plus-icon">+</span>
                                    <span className="tool-name">Solution</span>
                                </div>
                                <div ref={refImportant} onClick={handleClickImportant} style={{display: 'inline-block'}}>
                                    <span className="tool-icon" id="star-icon" style={{ color: `${note.important ? 'gold' : 'white'}` }}>&#9733;</span>
                                    <span className="tool-name">Important</span>
                                </div>
                                <div onClick={handleClickDelete} style={{display: 'inline-block'}}>
                                    <span  className="tool-icon" id="delete-icon">&#128465;</span>
                                    <span className="tool-name">Delete</span>
                                </div>
                                <div onClick={handleClickEdit} style={{display: 'inline-block'}}>
                                    <span  className="tool-icon" id="edit-icon">&#9998;</span>
                                    <span className="tool-name">Edit Question</span>
                                </div>
                                <div style={{display: 'inline-block'}}>
                                    <label className="tool-icon" id='lock-icon' htmlFor="visibility">{visibility === 'public' ? '\u{1F513}' : '\u{1F512}'}</label>
                                    <select onChange={onChangeVisibility} className='tool-name' id="visibility" value={visibility} name="visibility" style={{ cursor: 'pointer', backgroundColor: `${visibility === 'public' ? '#097555' : '#CF0A35'}` }}>
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                </div>
                                <div onClick={handleClickLink} style={{display: 'inline-block'}}>
                                    <span  className="tool-icon" id="link-icon">&#128279;</span>
                                    <span className="tool-name">Add Link</span>
                                </div>
                            </>}


                            {!own() && <>
                                <div onClick={handleClickBookmark} style={{display: 'inline-block'}}>
                                    <span className="tool-icon" id="bookmark-icon" >{bookmark ? "\u2714" : ''}</span>
                                    <span className="tool-name">Bookmark</span>
                                </div>
                            </>}
                        </>}
                    <div onClick={handleClickRedirect} style={{display: 'inline-block'}}>
                        <img src="/redirect.png" className="tool-icon" id="redirect-icon" alt="redirect" />
                        <span className="tool-name">Go to website</span>
                    </div>
                    <div onClick={handleClickComment} style={{display: 'inline-block'}}>
                        <span className="tool-icon" id="comment-icon">&#128488;</span>
                        <span className="tool-name">Comment</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookmarkItem;