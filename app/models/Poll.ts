import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema({
  placeId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  types: [{ type: String }],
  rating: Number,
  photos: [String],
})

const voteSchema = new mongoose.Schema({
  location: { type: locationSchema, required: true },
  voterId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  hostId: { type: String, required: true },
  votes: [voteSchema],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  shareCode: {
    type: String,
    required: true,
    unique: true,
  },
})

// Generate a unique share code before saving
pollSchema.pre('save', async function (next) {
  if (!this.shareCode) {
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    let code = generateCode()
    while (await this.constructor.findOne({ shareCode: code })) {
      code = generateCode()
    }
    this.shareCode = code
  }
  next()
})

export const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema) 