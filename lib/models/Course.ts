import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICourse extends Document {
  title: string
  description: string
  instructor: string
  category: string
  duration: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  imageUrl?: string
  authorId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)

export default Course

