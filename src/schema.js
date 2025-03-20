const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } = require('graphql');
const Post = require('../src/models/post');
const User = require('../src/models/user');

const dotenv = require('dotenv');
dotenv.config(); 

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      author: {
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.author);
        }
      },
      likes: {
        type: new GraphQLList(UserType),
        resolve(parent, args) {
          return User.find({ _id: { $in: parent.likes } });
        }
      },
      comments: {
        type: new GraphQLList(CommentType),
        resolve(parent, args) {
          return Comment.find({ _id: { $in: parent.comments } });
        }
      },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString }
    })
  });
  
  // Definindo o tipo User
  const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      username: { type: GraphQLString },
      profilePicture: { type: GraphQLString }
    })
  });

  // Definindo o tipo Comment
const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
      id: { type: GraphQLID },
      content: { type: GraphQLString },
      author: {
        type: UserType,
        resolve(parent, args) {
          return User.findById(parent.author);
        }
      }
    })
  });
  
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      // Query para buscar todos os posts
      posts: {
        type: new GraphQLList(PostType),
        resolve(parent, args) {
          return Post.find();
        }
      },
      // Query para buscar um post por ID
      post: {
        type: PostType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Post.findById(args.id);
        }
      },
      // Query para buscar um post por usuáirio, utilizando o ID do usuário
      postsByUser: {
        type: new GraphQLList(PostType),
        args: { userId: { type: GraphQLID } },
        resolve(parent, args) {
          return Post.find({ author: args.userId });
        }
      }
    }
  });
  
  const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      // Mutation para criar um novo post
      createPost: {
        type: PostType,
        args: {
          content: { type: new GraphQLNonNull(GraphQLString) },
          author: { type: new GraphQLNonNull(GraphQLID) }
        },
        async resolve(parent, args) {
          const user = await User.findById(args.author);
          if (!user) {
            throw new Error('Autor não encontrado');
          }
          const post = new Post({
            content: args.content,
            author: args.author
          });
          return post.save();
        }
      },
      // Mutation para atualizar um post
      updatePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          content: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parent, args) {
          return Post.findByIdAndUpdate(args.id, { content: args.content }, { new: true });
        }
      },
      // Mutation para deletar um post
      deletePost: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(parent, args) {
          return Post.findByIdAndDelete(args.id);
        }
      }
    }
  });
  
  module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
  });