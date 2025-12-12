import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    },
    lastMessageTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for finding conversations
conversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
