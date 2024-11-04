import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import './Notification.css'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {  // Only fetch blogs if user is logged in
      const fetchBlogs = async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }
      fetchBlogs()
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      // save user to browser local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      console.log(user)
      setUsername('')
      setPassword('')
      showNotification('Successfully logged in', 'success')
    } catch (exception) {
      // setErrorMessage('Wrong username or password')
      showNotification('Wrong username or password', 'error')
    }

  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const blog = await blogService
        .createBlog(blogObject)

      // const blogs = await blogService.getAll()
      // setBlogs(blogs)
      setBlogs(blogs => [...blogs, blog])
      showNotification(`a new blog ${blog.title}! by ${blog.author} added`, 'success')
    }catch (exception){
      showNotification('Failed to add blog', 'error - server')
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000) // Hide after 5 seconds
  }

  const updateBlog = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.updateBlog(updatedBlog.id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
    }catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const removeBlog = await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const sortedBlogByLikes = (blogsToSort) => {
    return [...blogsToSort].sort((a,b) => b.likes - a.likes)
  }

  const sortedBlogs = sortedBlogByLikes(blogs)

  return(
    <div className='p-4'>
      <Notification
        message={notification.message}
        type={notification.type}
      />

      {user === null ? (
        <div>
          <br />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      ): <div>
        <h2>blogs</h2>
        {user.name} logged in
        <button onClick={handleLogOut}>logout</button>
        <Togglable buttonLabel = 'create new blog'>
          <BlogForm
            handleCreateBlog={handleCreateBlog}
          />
        </Togglable>

        <br/>
        {sortedBlogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            handleDelete={deleteBlog}
            user={user}
          />
        )}
      </div>
      }
    </div>
  )
}

export default App