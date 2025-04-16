import Signature from '../models/signatureModel.js';

export const getSignaturesByRecipientId = async (req, res) => {
  try {
      const { recipientId } = req.query;
    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }
    const signatures = await Signature.find({ recipientId }).populate('authorId', 'name profileImage');
    res.status(200).json(signatures);
  } catch (error) {
    console.error('Error fetching signatures:', error);
    res.status(500).json({ error: 'Failed to fetch signatures' });
  }
};

export const createSignature = async (req, res) => {
  try {
    const { message, style, authorId, recipientId } = req.body;
    if (!message || !authorId) {
      return res.status(400).json({ error: 'Message and author ID are required' });
    }
    const newSignature = new Signature({
      message,
      style,
      authorId,
      recipientId,
    });
    const savedSignature = await newSignature.save();
    res.status(201).json(savedSignature);
  } catch (error) {
    console.error('Error creating signature:', error);
    res.status(500).json({ error: 'Failed to create signature' });
  }
};