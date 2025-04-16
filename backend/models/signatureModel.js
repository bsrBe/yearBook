import mongoose from 'mongoose';


const signatureSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    enum: ['CASUAL', 'ELEGANT', 'BOLD'],
    default: 'CASUAL',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Signature = mongoose.model('Signature', signatureSchema);

export default Signature;