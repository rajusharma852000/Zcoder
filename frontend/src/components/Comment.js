import { useState, useRef, useEffect } from 'react';
import './Comment.css'
import Action from './Action.js';


const Comment = ({ comment, handleInsertNode, handleEditNode, handleDeleteNode }) => {
    const [input, setInput] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [expand, setExpand] = useState(false);
    const inputRef = useRef(null);

    //useEffect
    useEffect(() => {
        inputRef?.current?.focus();
    }, [editMode])

    const onAddComment = () => {
        if (editMode) {
            handleEditNode(comment.id, inputRef?.current?.innerText);
            setEditMode(false);
        }
        else {
            setExpand(true);
            handleInsertNode(comment.id, input);
            setShowInput(false);
            setInput("");
        }
    }
    const handleNewComment = () => {
        setExpand(!expand);
        setShowInput(true)
    }
    const handleDelete = () => {
        handleDeleteNode(comment.id);
    }
    return (
        <>
            <div className='comment-main'>
                <div className={comment.id === 1 ? 'inputContainer' : "commentContainer"}>
                    {
                        comment.id === 1 ?
                            <>
                                <div style={{ display: 'flex' }}>
                                    <input onChange={(e) => { setInput(e.target.value) }} value={input} type="text" className="inputContainer__input first_input" autoFocus placeholder='type...' />
                                    <Action type="COMMENT" className="reply comment" handleclick={onAddComment} />
                                </div>
                            </> :
                            <>
                                <span contentEditable={editMode}
                                    suppressContentEditableWarning={editMode}
                                    style={{ wordWrap: 'break-word' }}
                                    ref={inputRef}
                                >
                                    {comment.name}
                                </span>

                                <div style={{ display: 'flex', marginTop: '8px' }}>
                                    {editMode ?
                                        <>
                                            <Action className="reply" type="SAVE" handleclick={onAddComment} />
                                            <Action
                                                className="reply"
                                                type="CANCEL"
                                                handleclick={() => {
                                                    if (inputRef.current)
                                                        inputRef.current.innerText = comment.name;
                                                    setEditMode(false);
                                                }}
                                            />
                                        </> :
                                        <>
                                            <Action handleclick={handleNewComment} className="reply" type={
                                                <>
                                                    {expand ? '\u2B9F' : '\u2B9D'}{" "}REPLY
                                                </>
                                            } />
                                            <Action handleclick={() => { setEditMode(true) }} className="reply" type="EDIT" />
                                            <Action
                                                className="reply" type="DELETE"
                                                handleclick={handleDelete}

                                            />
                                        </>

                                    }
                                </div>
                            </>
                    }
                </div>
                <div style={{ display: expand ? 'block' : 'none', paddingLeft: '25px', marginBottom: '3px' }}>
                    {showInput &&
                        <>
                            <div style={{ display: 'flex' }}>
                                <input type="text" onChange={(e) => { setInput(e.target.value) }} value={input} className="inputContainer__input" autoFocus placeholder='type...' />
                                <Action className="reply" type="REPLY" handleclick={onAddComment} />
                                <Action className="reply"
                                    type="CANCEL"
                                    handleclick={() => {
                                        if (!comment?.items?.length) setExpand(false);
                                        setShowInput(false);
                                    }}
                                />
                            </div>
                        </>}
                    {comment?.items?.map((cmnt) => {
                        return <Comment
                            handleInsertNode={handleInsertNode}
                            handleEditNode={handleEditNode}
                            handleDeleteNode={handleDeleteNode}
                            comment={cmnt} />
                    })}
                </div>
            </div>
        </>
    )
}


export default Comment;