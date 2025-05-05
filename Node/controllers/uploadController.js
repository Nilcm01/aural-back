exports.uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl: fileUrl });
};