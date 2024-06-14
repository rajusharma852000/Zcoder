const express = require('express');
const router = express.Router();
const Comments = require('../models/Comment.models.js');
const fetchuser = require('../middleware/fetchuser.middleware.js');



//ROUTE 0: Find a comment by its id: get /api/comment/findcomment/:id
router.get('/findcomment/:id',  async (req, res) => {
    let success = false;
    try {
        let comment = await Comments.findById(req.params.id);
        if (!comment) {
            return res.status(400).send({ success, message: "Comment not found" });
        }
        sucess = true;
        res.status(200).send({ success, comment: comment });
    }
    catch (error) {
        res.status(500).send({ success, error: error.message });
    }
});


//ROUTE 1: add a comment
router.post('/addcomment', fetchuser,  async (req, res) => {
    let success = false;
    try {
        let comment = await Comments.create(
            {
                name: req.body.name,
                items: req.body.items,
                user: req.user.id
            }
        )
        if (!comment) {
            return res.status(400).send({ success, message: "data insufficient" });
        }
        sucess = true;
        res.status(200).send({ success, comment: comment });
    }
    catch (error) {
        res.status(500).send({ success, error: error.message });
    }
});


//ROUTE 2: Edit a comment: put /api/comment/editcomment 
router.put('/updatecomment/:id', fetchuser, async(req, res)=>{
    let success = false;
    try{
        let comment = await Comments.findById(req.params.id);
        if(!comment){
            return res.status(404).send({success, message: "Comment not found"})
        }

        //allow only if user owns the comment
        if(req.user.id !== comment.user.toString()){
            return res.status(401).send({success, error: "Not Allowed"});
        }

        const {name, items} = req.body;
        const newComment = {};
        if(name) newComment.name = name;
        if(items) newComment.items = items;
    
        comment = await Comments.findByIdAndUpdate(req.params.id, {$set: newComment}, {new: true});
        success = true;
        res.status(200).send({success, comment});
    }
    catch (error) {
        res.status(500).send({ success, error: error.message });
    }
});

//ROUTE 3: Delete a comment ; delete /api/comment/deletecomment
router.delete('/deletecomment/:id', fetchuser, async(req, res)=>{
    let success = false;
    try{
        let comment = await Comments.findById(req.params.id);
        if(!comment){
            return res.status(404).send({success, message: "Comment not found"})
        }

        //allow only if use owns the comment
        if(req.user.id !== comment.user.toString()){
            return res.status(401).send({success, error: "Not Allowed"});
        }

        comment = await Comments.findByIdAndDelete(req.params.id);
        res.status(200).send({success , comment: comment});

    }
    catch (error) {
        res.status(500).send({ success, error: error.message });
    }
})

module.exports = router;