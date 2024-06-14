import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { noteContext } from '../context/notes/Context';
import Comment from './Comment.js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './DisplayItem.css';
import useNode from './useNode.js';

const DisplayItem = (props) => {
    const navigate = useNavigate();
    const context = useContext(noteContext);
    const { postId } = useParams();
    const { noteFound, findNote } = context;
    const customStyleTomorrow = { ...tomorrow, 'pre[class*="language-"]': { ...tomorrow['pre[class*="language-"]'], backgroundColor: '#000622', margin: '0px' } };
    const customAtomOneDark = { ...atomOneDark, hljs: { ...atomOneDark.hljs, backgroundColor: '#000622' } };
    const mystyle = {
        lineHeight: '1.5rem',
        fontFamily: 'sans-sarif',
        fontSize: '1rem',
    }

    //useEffect
    useEffect(() => {
        if (!localStorage.getItem('auth-token')) {
            navigate('/login');
        }
        else {
            findNote(postId);
            document.body.style.backgroundColor = 'black'
        }
        // eslint-disable-next-line
    }, [])

    //comment
    const comments = {
        id: 1,
        items: []
    }
    const [commentsData , setCommentsData] = useState(comments);
    const {insertNode, editNode, deleteNode} = useNode();
    const handleInsertNode = (folderId, item) =>{
        const finalStructure = insertNode(commentsData, folderId, item);    
        setCommentsData(finalStructure);
    }
    const handleEditNode = (folderId, value) =>{
        const finalStructure = editNode(commentsData, folderId, value);    
        setCommentsData(finalStructure);
    }
    const handleDeleteNode = (folderId) =>{
        const finalStructure = deleteNode(commentsData, folderId);    
        const temp = { ...finalStructure };
        setCommentsData(temp);
    }

    return (
        <>
            <div className="displayItem-body">

                {/*A. display item */}
                <div className="display-item-container">
                    {/*1. display question */}
                    <div style={mystyle} className="displayItem-question">
                        <h5 className='dispayItem-h5'>Question:</h5>
                        <SyntaxHighlighter language="jsx" style={customStyleTomorrow}
                            lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
                            wrapLines={true} >
                            {noteFound.question}
                        </SyntaxHighlighter>
                    </div>

                    {/*2. display answer */}
                    <div style={mystyle} className="displayItem-question">
                        <h5 className='dispayItem-h5'>Solution:</h5>
                        <SyntaxHighlighter language="javascript" style={customAtomOneDark}>
                            {noteFound.code}
                        </SyntaxHighlighter>
                    </div>
                </div>


                {/* display comment */}
                <div className='display-comment-container'>
                    <Comment
                    handleInsertNode={handleInsertNode}
                    handleEditNode={handleEditNode}
                    handleDeleteNode={handleDeleteNode}
                    comment={commentsData}/>
                </div>


            </div>



        </>
    );
}

export default DisplayItem;