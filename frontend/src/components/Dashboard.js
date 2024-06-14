import React, { useEffect, useContext } from 'react';
import './Bookmark.css';
import { noteContext } from '../context/notes/Context.js';
import BookmarkItem from './BookmarkItem.js';


const Dashboard = (props) => {
  //Context API
  const context = useContext(noteContext);
  const { getPublicNotes, publicNotes } = context;

  //useEffect to protect unauthorised login
  useEffect(() => {
    getPublicNotes();

    document.body.style.backgroundColor = 'black';
    document.getElementsByTagName('nav')[0].style.backgroundColor = 'black';
    document.getElementsByTagName('nav')[0].style.borderBottom = 'solid 1px rgb(135, 206, 235)';

    return () => {
      document.body.style.backgroundColor = '';
      document.getElementsByTagName('nav')[0].style.backgroundColor = '';
    };
    // eslint-disable-next-line
  }, [])

  const updateNote = (currentNote) => {
    //empty function, no use
  }

  return (
    <>
      <div>
        {/* Items/Elements to display*/}
        {Array.isArray(publicNotes) && publicNotes.map((note) => {
          return <BookmarkItem note={note} updateNote={updateNote} key={note._id} showAlert={props.showAlert} isDashboard={true} />
        })}
      </div>
    </>
  );
}

export default Dashboard;