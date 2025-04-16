import express from 'express';
import { getSignaturesByRecipientId, createSignature } from '../controllers/signatureController.js';

const router = express.Router();

router.route('/')
.get(getSignaturesByRecipientId)
.post(createSignature);

export default router;
