const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/',  async (request, response) => {
  // console.log('it got here')
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  // console.log(request.user)
  // console.log(blogs)
  response.status(200).json(blogs)

})



blogRouter.post('/', async (request, response) => {
  const {title, author, url, likes} = request.body
  // console.log('here it is', request.body)

  // console.log('this is user', request.user)
  const user = request.user

  if (!user) {
    return response.status(401).json({error: 'token invalid'})
  }

  // 
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  // console.log('from ROUTER', savedBlog)
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {username: 1, name: 1})
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(populatedBlog)

})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user
  

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({error: 'Blog not found'})
  }
  if (!blog.user) {
    return response.status(401).send({error: 'Forbidden'})
  }


  if (blog.user.toString() === user._id.toString()){
    
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
      return response.status(404).json({error: 'error deleting blog'})
    }
    // 
    return response.status(204).end()
  } else {
    return response.status(403).json({error: 'Unauthorized to delete this blog'})
  }
})


blogRouter.put('/:id', async (request, response) => {
  const {title, author, url, likes} = request.body

  const blog = {
    title,
    author,
    url,
    likes: request.body.likes
  }


  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true}).populate('user')

  // console.log('the data stored', updatedBlog)
  

  if (!updatedBlog){
    // const error = new Error('Blog not found')
    // error.name = 'NotFoundError'
    // error.message = 'Blog not found'
    // error.statusCode = 404
    // return error
    return response.status(404).json({error: 'Blog not found'})
  }
  response.json(updatedBlog)

})
module.exports = blogRouter