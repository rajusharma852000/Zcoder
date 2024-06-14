const express = require('express');
const router = express.Router();
const Notes = require('../models/Note.models.js');
const fetchuser = require('../middleware/fetchuser.middleware.js');
const { body, validationResult } = require('express-validator');
const { findByIdAndUpdate } = require('../models/Comment.models.js');


//ROUTE -1: Find a note by its id: get /api/note/findnote : Login required
router.get('/findnote/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const note = await Notes.find({ _id: id });
        res.status(200).send({ message: "Note found", note: note });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
});

//ROUTE 0:  Get All Public Notes: get /api/note/fetchpublicnotes : Login required
router.get('/fetchpublicnotes', async (req, res) => {
    try {
        const notes = await Notes.find({ visibility: 'public' });
        res.status(200).send({ message: "Notes fetched successfully", notes: notes });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
});

//ROUTE 1:  Get All Notes: get /api/note/fetchallnotes : Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.status(200).send({ message: "Notes fetched successfully", notes: notes });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
})


//ROUTE 2: add Note : post /api/note/createnote : Login required
router.post('/addnote', fetchuser, [
    body('question', "question cannot be empty").exists(),

], async (req, res) => {
    try {
        //validating the notes
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.statsu(400).send({ message: "question cannot be empty", error: error.message });
        }
        //CHANGE LIST: need changes
        if (req.body.code && !req.body.language) {
            return res.status(400).send({ message: "Select a language", error: "Language not selected" });
        }

        let note = await Notes.create(
            {
                user: req.user.id,
                question: req.body.question,
                description: req.body.description,
                code: req.body.code,
                language: req.body.language,
                companyTag: req.body.companyTag,
                link: req.body.link,
                visibility: req.body.visibility,
                important: req.body.important,
            }
        );
        if (!note) {
            return res.status(400).send({ message: "Provide the neccessary details", error: "Insufficient Data" });
        }

        res.status(200).send({ message: "Note added successfully", note: note });

    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }


});

// ROUTE 3: Update Note: post '/api/note/updatenote' : Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        //check if note exists
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: "error: Note doesn't exist", error: "Note note found" });
        }

        //Allow update only if  the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ message: "Invalid request", error: "Not Allowed" });
        }

        //create note
        const { question, description, companyTag, code, language, link, visibility, important } = req.body;
        const newNote = {};
        if (question) newNote.question = question;
        if (description) newNote.description = description;
        if (companyTag) newNote.companyTag = companyTag;
        if (code) newNote.code = code;
        if (language) newNote.language = language;
        if (link) newNote.link = link;
        if (visibility) newNote.visibility = visibility;
        if (important !== undefined) newNote.important = important;

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.status(200).send({ message: "Updated successfully", UpdatedNote: note });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
})

//ROUTE 4: Delete a Note : delete /api/note/deletenote : Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        // check if the note exists
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: "error: Note doesn't exist", error: "Note note found" });
        }

        //Allow only if user own the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send({ message: "Invalid request", error: "Not Allowed" });
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Note deleted successfully", note: note });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }

});

// ROUTE 5: Delete all Notes : delete /api/note/deleteall : Login required
router.delete('/deleteall', fetchuser, async (req, res) => {
    try {
        const deleteResult = await Notes.deleteMany();
        if (deleteResult.deletedCount === 0) {
            return res.status(404).send({ message: "Already deleted", error: "empty", deleteCount: 0 });
        }

        res.status(200).send({ message: "All notes were deleted successfully", deleteCount: deleteResult.deletedCount });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
})




//ROUTE 6: add a comment id, to the existing array (basically update the exsiting array)
router.put('/addcommentid/:id', fetchuser, async (req, res) => {
    try {
        //note on which comment has been made should exist
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: "error: Note doesn't exist", error: "Note note found" });
        }


        //comment id should be valid i.e. ID is not null/undefined
        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).send({ message: "comment ID is undefined", error: "comment ID is not valid" });
        }

        // Convert Mongoose document to plain object
        let newNote = { ...note.toObject() }; 
        if (!newNote.comment) {
            newNote.comment = []; // Initialize the comment array if it doesn't exist
        }
        newNote.comment.push(commentId); // Add commentId to the comment array

        
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.status(200).send({ message: "commentId added successfully", note: note })
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
})

//ROUTE 7: delete a comment id, to the existing array (basically update the exsiting array)
router.put('/deletecommentid/:id', fetchuser, async (req, res) => {
    try {
        //note on which comment has been made should exist
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: "error: Note doesn't exist", error: "Note note found" });
        }


        //comment id should be valid i.e. ID is not null/undefined
        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).send({ message: "comment ID is undefined", error: "comment ID is not valid" });
        }

        // Convert Mongoose document to plain object
        let newNote = { ...note.toObject() }; 
        if (!newNote.comment) {
            return res.send(404).send({message: "comment not found", error: "comment array is empty"})
        }

        //find the commentId in the array and remove it
        for(let i = 0; i < newNote.comment.length; i++){
            const cmntId = newNote.comment[i].toString();
            if(cmntId === commentId){
                newNote.comment.splice(i, 1);
                break;
            }
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: { comment: newNote.comment } }, { new: true });
        res.status(200).send({ message: "commentId added successfully", note: note })
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Issue", error: error.message });
    }
})

module.exports = router;