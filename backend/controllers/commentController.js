import Comment from '../models/commentModel.js';

// Add a comment to a memory
export const addComment = async (req, res) => {
  try {
    const { content, authorId } = req.body;
    const { memoryId } = req.params ;

    const comment = new Comment({
      content,
      authorId,
      memoryId,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};