import { useState } from 'react'

const Blog = ({ blog, updateBlog, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }


  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes : blog.likes + 1
    }

    try{
      await updateBlog(updatedBlog)
    }catch (error) {
      console.error('Error updating blog:', error)
    }
  }


  const handleDeleteClick = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try{
        await handleDelete(blog.id)
      }catch (error){
        console.error('Error deleting blog:', error)
      }
    }
  }
  // console.log('Current user:', user)
  // console.log('Blog data:', blog)

  // Safe check for user authentication and ownership
  const canDeleteBlog = user && blog?.user && user.id === blog.user.id

  return (
    <div style={blogStyle} className='blogDetails'>
      <div style={hideWhenVisible} data-testid='blog-collapsed' className='collapsedBlog' >
        {blog.title} {blog.author}
        <button
          onClick={() => setDetailsVisible(true)}>
          view
        </button>
      </div>
      <div style={showWhenVisible} className='showDetails'>
        <div>
          {blog.title} {blog.author}
          <button
            onClick={() => setDetailsVisible(false)}>
              hide
          </button>
        </div>
        <div className='blogUrl'>
          {blog.url}
        </div>
        <div className='blogLikes'>
          likes {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>
          {blog.user?.name}
        </div>
        {canDeleteBlog ? <button onClick={handleDeleteClick}
          style={{ backgroundColor: 'blue', color: 'whiteSmoke', borderRadius: '5px' }}
        >delete</button>: ''}
      </div>
    </div>
  )
}

export default Blog