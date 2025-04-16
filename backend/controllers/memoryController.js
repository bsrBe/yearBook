import Memory from '../models/memoryModel.js';
import Comment from '../models/commentModel.js';

export const getMemories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const memories = await Memory.find()
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 });

    const total = await Memory.countDocuments();

    res.status(200).json({
      memories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
};

export const getMemoryById = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('authorId', 'name profileImage');

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const comments = await Comment.find({ memoryId: req.params.id })
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ memory, comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
};

export const createMemory = async (req, res) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id; // Assuming req.user is populated by auth middleware

    const memory = new Memory({
      content,
      authorId,
    });

    await memory.save();

    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const likeMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    memory.likes += 1;
    await memory.save();

    res.status(200).json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like memory' });
  }
};