// const express = require('express');
// const router = express.Router();

// const Users = require('../models/Users');
// const Xats = require('../models/Xats');
// const Content = require('../models/Content');

// // Search content, from all types (does not search users)
//   exports.searchContent = async (req,res) => {
//     const { searchquery } = req.query;

//     if(!searchquery) {
//       res.status(400).message("Bad request");
//     }

//     try {
//       const cont = await Content.find({
//         $or: [
//           { name: { $regex: searchquery, $options: 'i' } },   // 'i' makes it case-insensitive.
//           { artist: { $regex: searchquery, $options: 'i' } },
//           { type: { $regex: searchquery, $options: 'i' } },
//           { description: { $regex: searchquery, $options: 'i' } },
//         ]
//       });
  
//       if (cont.length === 0) {
//         return res.status(404).send('No content found matching your query');
//       }

//       const response = {
//         names: cont.map(Users => Users.name),
//         artists: cont.map(Users => Users.artist),
//         types: cont.map(Users => Users.type),
//         descriptions: cont.map(Users => Users.description),
//       };
      
//       res.json(response);
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   }

  