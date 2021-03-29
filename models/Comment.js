import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Comment = mongoose.model('Comment', {
  name: String,
  pages: Number,
  movie: {
    type: Schema.Types.ObjectId,
    ref: 'Movie'
  }
})
