import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  // console.log(response.data)
  return response.data
}



const createBlog = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }
  // console.log('config with token', config)
  // console.log('new blog details', newBlog)
  const response = await axios.post(baseUrl, newBlog, config)
  // console.log('response data ', response.data)
  return response.data
}






const updateBlog = async (id, blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(
    `${baseUrl}/${id}`,
    blog,
    config)
  return response.data
}



const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(
    `${baseUrl}/${id}`, config
  )
  return response.data

}

export default { getAll, setToken, createBlog, updateBlog, deleteBlog }