import { gql } from "apollo-server-express";
import { Movie } from "../models/Movie";
import { Comment } from "../models/Comment";
import { Rating } from "../models/Rating";

const typeDefs = gql`
  type Query {
    movies: [Movie!]!
    comments: [Comment!]!
    ratings: [Rating!]!
  }
  type Movie {
    id: ID!
    title: String!
    comments: [Comment!]
    ratings: [Rating!]
  }
  type Comment {
    id: ID!
    name: String!
    pages: Int
    movie: Movie!
  }
  type Rating {
    id: ID!
    value: Int
    movie: Movie!
  }
  type Mutation {
    createMovie(title: String!): Movie!
    createComment(name: String!, pages: Int, movie: String!): Comment!
    createRating(value: Int!, movie: String!): Rating!
  }
`;

const comments = async (commentIds) => {
  try {
    const comments = await Comment.find({
      _id: {
        $in: commentIds,
      },
    });
    return comments.map((comment) => ({
      ...comment._doc,
      movie: movie.bind(this, comment._doc.movie),
    }));
  } catch {
    throw err;
  }
};

const ratings = async (ratingsIds)=>{
  try{
    const ratings = await Rating.find({
      _id:{
        $in:ratingsIds,
      },
    });
    return ratings.map(rating=>({
      ...rating._doc,
      movie: movie.bind(this,rating._doc.movie),
    }))
  }catch{
    throw err;
  }
}

const movie = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId);
    return {
      ...movie._doc,
      comments: comments.bind(this, movie._doc.comments),
      ratings: ratings.bind(this, movie._doc.ratings)
    };
  } catch (err) {
    throw err;
  }
};

const resolvers = {
  Query: {
    movies: async () => {
      try {
        const movies = await Movie.find();
        return movies.map((movie) => ({
          ...movie._doc,
          comments: comments.bind(this, movie._doc.comments),
          ratings: ratings.bind(this, movie._doc.ratings)
        }));
      } catch (err) {
        throw err;
      }
    },
    comments: async () => {
      try {
        const comments = await Comment.find();
        return comments.map((comment) => ({
          ...comment._doc,
          movie: movie.bind(this, comment._doc.movie),
        }));
      } catch (err) {
        throw err;
      }
    },
    ratings: async()=>{
      try{
        const ratings = await Rating.find();
        return ratings.map(rating=>({
          ...rating._doc,
          movie: movie.bind(this, rating._doc.movie)
        }))
      }catch(err){
        throw err;
      }
    }
  },
  Mutation: {
    createMovie: async (_, { title }) => {
      try {
        const movie = new Movie({
          title,
        });
        await movie.save();
        return movie;
      } catch (err) {
        throw err;
      }
    },
    createComment: async (_, { name, pages, movie: movieId }) => {
      const comment = new Comment({
        name,
        pages,
        movie: movieId,
      });
      try {
        const savedComment = await comment.save();
        const movieRecord = await Movie.findById(movieId);
        movieRecord.comments.push(comment);
        await movieRecord.save();
        return {
          ...savedComment._doc,
          movie: movie.bind(this, movieId),
        };
      } catch (err) {
        throw err;
      }
    },
    createRating: async (_, { value, movie: movieId }) => {
      const rating = new Rating({
        value,
        movie: movieId,
      });
      try{
        const savedRating = await rating.save();
        const movieRecord = await Movie.findById(movieId);
        movieRecord.ratings.push(rating);
        await movieRecord.save();
        return {
          ...savedRating._doc,
          movie: movie.bind(this, movieId),
        };
      }catch(err){
        throw err;
      }
    },
  },
};

export { typeDefs, resolvers };
