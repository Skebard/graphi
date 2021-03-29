import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Movie = mongoose.model('Movie', {
  title: String,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  ratings:[{
    type: Schema.Types.ObjectId,
    ref:"Rating"
  }]
})
