const Collection = require("../models/Collection");

exports.createCollection = async (req, res) => {
  try {
    const { name, description, color, isPublic } = req.body;
    const collection = await Collection.create({
      name,
      description,
      color,
      isPublic,
      user: req.user.id,
    });
    res.status(201).json({ success: true, collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).populate("notes", "title slug subject department");
    res.status(200).json({ success: true, collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addNoteToCollection = async (req, res) => {
  try {
    const { collectionId, noteId } = req.body;
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }
    if (collection.notes.includes(noteId)) {
      return res.status(400).json({ success: false, message: "Note already in collection" });
    }
    collection.notes.push(noteId);
    await collection.save();
    res.status(200).json({ success: true, collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeNoteFromCollection = async (req, res) => {
  try {
    const { collectionId, noteId } = req.params;
    const collection = await Collection.findOne({ _id: collectionId, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }
    collection.notes = collection.notes.filter(id => id.toString() !== noteId);
    await collection.save();
    res.status(200).json({ success: true, collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }
    res.status(200).json({ success: true, message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
