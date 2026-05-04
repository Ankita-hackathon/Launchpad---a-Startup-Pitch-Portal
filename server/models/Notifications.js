const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'recipientModel' 
        },
        recipientModel: {
            type: String,
            required: true,
            enum: ['Student', 'mentors'] // Matches your model names
        },


        title: {
            type: String,
            required: true, // e.g., "Pitch Reviewed!"
        },
        message: {
            type: String,
            required: true, // e.g., "John Doe has reviewed your pitch for 'Tech Startup'."
        },
        
        type: {
            type: String,
            enum: [
                'PITCH_SUBMITTED',     
                'AI_FEEDBACK_READY',   
                'PITCH_REVIEWED',     
                'SYSTEM'               
            ],
            required: true
        },

        relatedPitch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pitches',
            default: null
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model("notifications", NotificationSchema);