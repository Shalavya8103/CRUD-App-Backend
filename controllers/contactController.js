const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');
//@desc Get all contacts
//@route GET /api/contacts
//@access Private
const getContacts=asyncHandler(async(req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});


//@desc Create new contact
//@route POST /api/contacts
//@access Private
const createContact=asyncHandler(async(req,res)=>{
    console.log("the request body is",req.body);
    const {name,email,phone,type}=req.body;
    if (!name || !email || !phone) {
        res.status(404);
        throw new Error ("All fields are required");
    }

    const contact=await  Contact.create(
        {name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(201).json(contact);
});

//@desc Create new contact
//@route GET /api/contacts
//@access Private
const getContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if (!contact){
        res.status(404);
        throw new Error(
            `Contact not found for id ${req.params.id}` 
        )
    }
    res.status(200).json(contact);
});

//@desc update contact
//@route PUT /api/contacts
//@access Private
const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if (!contact){
        res.status(404);
        throw new Error(
            `Contact not found for id ${req.params.id}` 
        )
    }

    if (contact.user_id.toString() !== req.user.id.toString()){
        res.status(403);
        throw new Error("User doesn't have permission to update this contact");
    }
    const updatedContact= await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact);
});

//@desc delete contact
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if (!contact){
        res.status(404);
        throw new Error(
            `Contact not found for id ${req.params.id}` 
        )
    }
    if (contact.user_id.toString() !== req.user.id.toString()){
        res.status(403);
        throw new Error("User doesn't have permission to delete this contact");
    }
    const contactToDelete=await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
});

module.exports={getContacts,createContact,getContact,updateContact,deleteContact};