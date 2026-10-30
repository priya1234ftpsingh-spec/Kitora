import mongoose from 'mongoose';

const aiRecommendationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    type: {
      type: String,
      enum: ['career', 'resume', 'skill_gap', 'drive_match', 'chat_assistant'],
      required: true,
    },
    queryOrContext: {
      type: String,
      default: '',
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    disclaimer: {
      type: String,
      default: 'AI suggestions are for guidance only and do not determine final placement decisions.',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AIRecommendation = mongoose.model('AIRecommendation', aiRecommendationSchema);
export default AIRecommendation;
