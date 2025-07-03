import { searchPost,createPost, updatePost, searchConfirmedPost, createConfirmedPost } from "../models/postModel.js";
import { searchUser,updateUser } from "../models/userModel.js";
import { searchDonationEvent, getBloodCollector, collectBlood,
    createDonationEvent,
    getEventParticipant, joinEvent } from "../models/eventModel.js";
import { confirmedPostSchema, createPostSchema, getConfirmedPostSchema,
    postQuerySchema, updatePostSchema } from "../schemaValidations/postValidation.js";

import { getUserSchema, updateUserSchema} from "../schemaValidations/userValidation.js";
import { getEventSchema, collectedBloodSchema, joinEventSchema, createEventSchema, updateEventSchema } from "../schemaValidations/eventVallidation.js";
import { organizeEvents } from "../services/dataOrganizer.js";
import { deleteData, updateTable } from "../models/adminModel.js";
import jwt from 'jsonwebtoken';
import dotnev from "dotenv"
dotnev.config();

export const getPostController = async (req,res)=>{
   try{
///////////////
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token is missing. Authorization denied." });
    };
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if(decodedToken.role === 'recipient'){
      req.body = { filters : { r_id : decodedToken.id } };  // fethcing resipients post on DashBoard
    }    
 //////////////  
    const results = await searchPost(req.body);
    return res.status(200).json({
       msg : "Successful",
       data : results
    });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Search error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }

};


export const createPostController = async (req,res)=>{
   try{

   //////////////////////
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
     return res.status(401).json({ msg: "Token is missing. Authorization denied." });
   };
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   req.body.r_id = decodedToken.id;  
   ////////////////////
    const validatedData = await createPostSchema.validateAsync(req.body);
    const results = await createPost(validatedData);
    res.status(200).json({
       msg : "Successful",
       data : results
    });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
   console.error("Creation error:", err);
   return res.status(500).json({ msg: "Internal server error" });
   }
   
};



export const getUserController = async (req,res)=>{
   try{


      /////////////////////////////
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token is missing. Authorization denied." });
      };
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if(decodedToken.role !== 'admin'){
         req.body = { filters : { id : decodedToken.id }};
      }
      ////////////////////////////
      

      
      // if(req.query.query){
      //       queryObj = JSON.parse(decodeURIComponent(req.query.query)); // decoding Q string 
      //queryObj = await getUserSchema.validateAsync(req.body.filters);
      // };
      const results = await searchUser(req.body);
      res.status(200).json({
         msg : "Successful",
         data : results
   });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Search error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }

};



// export const updateUserController = async (req,res)=>{
//    try{
//       const updateObj = await updateUserSchema.validateAsync(req.body);
//       const result = await updateUser(req.body.id,updateObj);
//       res.status(200).json({
//          msg : "Successfully updated",
//          result : result
//       })
//    }catch(err){
//       if (err.isJoi) {
//          return res.status(400).json({
//            msg: "Validation error",
//            details: err.details.map((error) => error.message),
//          });
//        }
      
//       console.error("Update error:", err);
//       return res.status(500).json({ msg: "Internal server error" });
//    }
// };
///////////
export const updateUserController = async (req, res)=>{
   try{


      /////////////////////////////
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token is missing. Authorization denied." });
      };
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.body.id = decodedToken.id;
      ////////////////////////////


      if(!req.body.id){
         return res.status(400).json({
            msg : "user id is needed to update user"
         })
      };

      const updateObj = req.body;
      let validatedData = await updateUserSchema.validateAsync(updateObj);
      validatedData.tableName = "User";
      const result = await updateTable(validatedData);
      return res.status(200).json({
         msg : "Successfully updated",
         result : result
      });
   }catch(err){      
      console.error("Update error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};
/////////////

export const getEventController = async (req,res)=>{
   try{


      /////// handling get joined events ///////////
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token is missing. Authorization denied." });
      };
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
      if (req.body.joined){
         req.body = { filters : { d_id : decodedToken.id }};
      }
      ////////////////////////////////////////////////


      const results = await searchDonationEvent(req.body);
      const organizedData = organizeEvents(results);
      res.status(200).json({
         msg : "Successful",
         data : organizedData
   });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Search error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }

};


export const createBloodCollectorController = async ( req,res)=>{
   try{
      // //////
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token is missing. Authorization denied." });
      };
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.body.p_id = decodedToken.id;
      /////////

      if( !req.body.p_id || ! req.body.e_id || !req.body.needed_blood_type ){
         return res.status(400).json({
            msg : "Provide all three (p_id,e_id,needed_blood_type)"
         });
      }

      const recipientId = req.body.p_id;
      const eventId = req.body.e_id;
      const collectionResult = await getBloodCollector({ filters : { p_id : recipientId, e_id : eventId }});

      if (collectionResult.length > 0) {
         return res.status(400).json({
            msg : "Already collected from event"
         });
      }

      const validatedData = await collectedBloodSchema.validateAsync(req.body);
      const insertResult = await collectBlood(validatedData);
      return res.status(200).json({
         msg : "Successful",
         data : insertResult
      });

   }catch(err){
      console.error("Creation error:", err);
      if (err.isJoi) {
          return res.status(400).json({
            msg: "Validation error",
            details: err.details.map((error) => error.message),
          });
        }
        console.error("Creation error:", err);
        return res.status(500).json({ msg: "Internal server error" });
     }

};



// export const updatePostController = async (req,res)=>{
//    try{
//       const updateObj = await updatePostSchema.validateAsync(req.body);
//       const result = await updatePost(req.body.id,updateObj);
//       res.status(200).json({
//          msg : "Successfully updated",
//          result : result
//       })
//    }catch(err){
//       if (err.isJoi) {
//          return res.status(400).json({
//            msg: "Validation error",
//            details: err.details.map((error) => error.message),
//          });
//        }
      
//       console.error("Update error:", err);
//       return res.status(500).json({ msg: "Internal server error" });
//    }
// };


////////////
export const updatePostController = async (req, res)=>{
   try{
      if(!req.body.id){
         return res.status(400).json({
            msg : "post id is needed to update post"
         })
      };

      const updateObj = req.body;
      let validatedData = await updatePostSchema.validateAsync(updateObj);
      validatedData.tableName = "Post";
      const result = await updateTable(validatedData);
      return res.status(200).json({
         msg : "Successfully updated",
         result : result
      });
   }catch(err){      
      console.error("Update error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};
////////////

export const deletePostController = async (req,res)=>{
   try{
      let deleteParams = {};
 
      if(req.body.id){
         deleteParams.id = req.body.id;
      };
      // r_id is optional
      if(req.body.r_id){
         deleteParams.r_id = req.body.r_id;
      };
      
      deleteParams.tableName = "Post";

      const result = await deleteData(deleteParams);
      res.status(200).json({
         msg : "Successfully deleted",
         result : result
      })
   }catch(err){      
      console.error("Deletion error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};


export const getConfirmedPostController = async (req,res)=>{
   try{
///////////////////////////////////////
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
   return res.status(401).json({ msg: "Token is missing. Authorization denied." });
   };
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   req.body = { filters : { d_id : decodedToken.id }};
//////////////////////////////////////////

    const results = await searchConfirmedPost(req.body);
    res.status(200).json({
       msg : "Successful",
       data : results
    });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Search error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }

};



export const createConfirmedPostController = async (req,res)=>{
   // d_id ,p_id, preferred date will be sent in req.body 
   try{
    const validatedData = await confirmedPostSchema.validateAsync(req.body);
    const results = await createConfirmedPost(validatedData);
    res.status(200).json({
       msg : "Successful",
       data : results
    });

   }catch(err){
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      console.error("Creation error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }

};



export const createEventParticipantController = async ( req,res)=>{
   try{

      //////////////
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token is missing. Authorization denied." });
      };
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.body.d_id = decodedToken.id;
      ////////////////


      if( !req.body.d_id || ! req.body.e_id ){
         return res.status(400).json({
            msg : "Provide d_id,e_id"
         });
      }

      const donorId = req.body.d_id;
      const eventId = req.body.e_id;
      const result = await searchUser( { filters : { id : donorId }});
      const donated_blood_type = result[0].blood_type;
      req.body.donated_blood_type = donated_blood_type;
      const joinResult = await getEventParticipant({ filters : { d_id : donorId, e_id : eventId }});

      if (joinResult.length > 0) {
         return res.status(400).json({
            msg : "Already joined event"
         });
      }

      const validatedData = await joinEventSchema.validateAsync(req.body);
      const insertResult = await joinEvent(validatedData);
      return res.status(200).json({
         msg : "Successful",
         data : insertResult
      });

   }catch(err){
      console.error("Creation error:", err);
      if (err.isJoi) {
          return res.status(400).json({
            msg: "Validation error",
            details: err.details.map((error) => error.message),
          });
        }
        console.error("Creation error:", err);
        return res.status(500).json({ msg: "Internal server error" });
     }

};


/// ADMIN CONTROLLERS

export const createDonationEventController = async (req,res)=>{
   try{
/////////////////////////////////////
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
   return res.status(401).json({ msg: "Token is missing. Authorization denied." });
   };
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   req.body.organizer = decodedToken.id ;

//////////////////////////////////////////////////
    const validatedData = await createEventSchema.validateAsync(req.body);
    const results = await createDonationEvent(validatedData);
    res.status(200).json({
       msg : "Successful",
       data : results
    });

   }catch(err){
      console.error("Creation error:", err);
    if (err.isJoi) {
        return res.status(400).json({
          msg: "Validation error",
          details: err.details.map((error) => error.message),
        });
      }
      return res.status(500).json({ msg: "Internal server error" });
   }

};


export const deleteDonationEventController = async (req,res)=>{
   try{
      let deleteParams = {};   

      if(!req.body.id){
         return res.status(400).json({
            msg : "event id is needed to delete event"
         })
      };

      deleteParams.id = req.body.id;
      deleteParams.tableName = "Donation_Event";

      const result = await deleteData(deleteParams);
      return res.status(200).json({
         msg : "Successfully deleted",
         result : result
      })
   }catch(err){      
      console.error("Deletion error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};


export const updateDonationEventController = async (req, res)=>{
   try{
      if(!req.body.id){
         return res.status(400).json({
            msg : "event id is needed to update event"
         })
      };

      const updateObj = req.body;
      let validatedData = await updateEventSchema.validateAsync(updateObj);
      validatedData.tableName = "Donation_Event";
      const result = await updateTable(validatedData);
      return res.status(200).json({
         msg : "Successfully updated",
         result : result
      });
   }catch(err){      
      console.error("Update error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};



export const deleteUserController = async (req,res)=>{
   try{
      let deleteParams = {};
 
      if(req.body.id){
         deleteParams.id = req.body.id;
      };
  
      deleteParams.tableName = "User";

      const result = await deleteData(deleteParams);
      res.status(200).json({
         msg : "Successfully deleted",
         result : result
      })
   }catch(err){      
      console.error("Deletion error:", err);
      return res.status(500).json({ msg: "Internal server error" });
   }
};