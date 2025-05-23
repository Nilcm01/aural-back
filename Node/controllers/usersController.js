const Users = require('../models/Users');
const stringSimilarity = require('string-similarity');

// Get all users from the DB
exports.users = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Add the user with userId from Spotify API to DB
exports.loginUser = async (req, res) => {
  const { userId, name } = req.query;

  if (!userId || !name) {
    res.status(404).send('Bad values');
  }

  try {
    const userExists = await Users.findOne({ userId });
    if (userExists) {
      res.status(200).send('User already in BD!');
      return;
    }

    const newUser = new Users({
      userId,
      name,
    });

    await newUser.save();

    res.status(200).send('User added to DB!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all the information from a user to show at profile screen
exports.profileInfo = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).message('Bad request');
  }

  try {
    const user = await Users.findOne({ userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const userData = {
      name: user.name,
      username: user.username,
      age: user.age,
      imageURL: user.imageURL,
      description: user.description,
    };

    res.json(userData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all friend list and friend request list from a user
exports.friends = async (req, res) => {
  const { userId } = req.query;

  // Verify if the userId is present
  if (!userId) {
    return res.status(400).send('Bad Request: userId is required');
  }

  try {
    // Filter result by userId
    const user = await Users.findOne({ userId });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // List of friends & friend_requests from user with userId
    const userData = { friends: user.friends, friend_requests: user.friend_requests };
    res.json(userData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { userId, name, username, age, imageURL } = req.body;

  if (!userId || !username) {
    return res.status(400).send('Bad Request: Missing required fields');
  }

  try {
    const userExists = await Users.findOne({ userId });
    if (userExists) {
      return res.status(400).send('User already exists');
    }

    const newUser = new Users({
      userId,
      name,
      username,
      age,
      imageURL,
    });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Modify user profile
exports.modifyProfile = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send('Bad Request: userId is required');
  }

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { userId },
      { ...req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res.status(400).send('Bad Request: userId and friendId are required');
  }

  try {
    const user = await Users.findOne({ userId });
    const friend = await Users.findOne({ userId: friendId });

    if (!user || !friend) {
      return res.status(404).send('User or friend not found');
    }

    if (friend.friend_requests.includes(userId)) {
      return res.status(400).send('Friend request already sent');
    }

    friend.friend_requests.push(userId);
    await friend.save();

    res.status(200).send('Friend request sent');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res.status(400).send('Bad Request: userId and friendId are required');
  }

  try {
    const user = await Users.findOne({ userId });
    const friend = await Users.findOne({ userId: friendId });

    if (!user || !friend) {
      return res.status(404).send('User or friend not found');
    }

    if (!user.friend_requests.includes(friendId)) {
      return res.status(400).send('No friend request from this user');
    }

    // Check for request from friend in user.friend_requests[]
    // format: user.friend_requests['friend1Id', 'friend2Id', ...]
    user.friend_requests = user.friend_requests.filter(id => id !== friendId);
    user.friends[friendId] = friendId; // Add friend to user's friends list
    friend.friends[userId] = userId; // Add user to friend's friends list

    await user.save();
    await friend.save();

    res.status(200).send('Friend request accepted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Remove a friend
exports.removeFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res.status(400).send('Bad Request: userId and friendId are required');
  }

  try {
    const user = await Users.findOne({ userId });
    const friend = await Users.findOne({ userId: friendId });

    if (!user || !friend) {
      return res.status(404).send('User or friend not found');
    }

    user.friends = user.friends.filter(id => id !== friendId);
    friend.friends = friend.friends.filter(id => id !== userId);

    await user.save();
    await friend.save();

    res.status(200).send('Friend removed');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Add a description to the user
exports.userDescription = async (req, res) => {
  try {
    const { userId, description } = req.body; // Use req.body, not req.query

    if (!userId || !description) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await Users.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    user.description = description;
    await user.save();

    res.status(200).json({ message: "User description updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
}

// Add an age to the user
exports.userAge = async (req, res) => {
  try {
    const { userId, age } = req.body; // Use req.body, not req.query

    if (!userId || !age) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const user = await Users.findOne({ userId });
 
    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    user.age = age;
    await user.save();

    res.status(200).json({ message: "User age updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred.", error: error.message });
  }
}


// Reject a friend request
exports.rejectFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) {
    return res.status(400).json({ msg: 'userId and friendId are required.' });
  }

  try {
    // Busca el usuario que recibe la solicitud
    const user = await Users.findOne({ userId });
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Verifica que la solicitud exista en friend_requests
    if (!user.friend_requests.includes(friendId)) {
      return res.status(400).json({ msg: 'Friend request not found.' });
    }

    // Elimina la solicitud de friend_requests
    user.friend_requests = user.friend_requests.filter(id => id !== friendId);

    await user.save();
    res.status(200).json({ msg: 'Friend request rejected.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error.' });
  }
}

// Search for similar usernames
exports.searchUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required!" });
    }

    // Fetch all usernames from the database
    const users = await Users.find({}, 'username');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found!" });
    }

    // Extract usernames from the result
    const usernames = users.map(user => user.username);

    // Get the three most similar usernames
    const matches = stringSimilarity.findBestMatch(username, usernames).ratings
      .sort((a, b) => b.rating - a.rating) // Sort by highest similarity
      .slice(0, 3) // Get top 3 matches
      .filter(match => match.rating >= 0.4); // Filter out low-rated matches

    if (matches.length === 0) {
      return res.status(404).json({ message: "No similar usernames found!" });
    }

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};