import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILesson extends Document {
  title: string
  content: string
  order: number
  videoUrl?: string
  duration: number
  courseId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const LessonSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    videoUrl: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema)

export default Lesson

