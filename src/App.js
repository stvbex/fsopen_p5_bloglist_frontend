import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [notificationColor, setNotificationColor] = useState('red')

    useEffect(() => {
        const fetchBlogs = async () => {
            let blogs = await blogService.getAll()

            blogs.sort((b1, b2) => b2.likes - b1.likes)
            setBlogs(blogs)
        }
        fetchBlogs()
    }, [])

    useEffect(() => {
        const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
        if (loggedInUserJSON) {
            const user = JSON.parse(loggedInUserJSON)
            setUser(user)
            blogService.setAuthToken(user.token)
        }
    }, [])

    const newBlogRef = useRef()

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password
            })
            window.localStorage.setItem(
                'loggedInUser', JSON.stringify(user)
            )

            setUser(user)
            blogService.setAuthToken(user.token)
            setUsername('')
            setPassword('')
        }
        catch (error) {
            setNotificationColor('red')
            setNotificationMessage('invalid username or password')
            setTimeout(() => {
                setNotificationMessage(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedInUser')
        blogService.setAuthToken(undefined)
        window.location.reload()
    }

    const handleCreateBlog = async newBlogData => {
        try {
            const newBlog = await blogService.createOne(newBlogData)
            newBlog.user = user // TODO? populate instead
            setBlogs(blogs.concat(newBlog))

            newBlogRef.current.toggleVisibility()

            setNotificationColor('green')
            setNotificationMessage(
                `a new blog ${newBlog.title} by ${newBlog.author} added`
            )
        }
        catch (error) {
            setNotificationColor('red')
            setNotificationMessage('invalid data or unauthorized')
        }
        finally {
            setTimeout(() => {
                setNotificationMessage(null)
            }, 5000)
        }
    }

    const handleUpdateBlog = async (blogId, updatedBlogData) => {
        const updatedBlog = await blogService.updateOne(blogId, updatedBlogData)

        // Update blogs shown
        const newBlogs = [...blogs]
        const updatedIndex = newBlogs.findIndex(b => b.id === blogId)
        newBlogs[updatedIndex] = updatedBlog

        // Sort by likes
        newBlogs.sort((b1, b2) => b2.likes - b1.likes)
        setBlogs(newBlogs)
    }

    const handleRemoveBlog = async blogId => {
        await blogService.deleteOne(blogId)

        const newBlogs = [...blogs]
        const updatedIndex = newBlogs.findIndex(b => b.id === blogId)
        newBlogs.splice(updatedIndex, 1)
        setBlogs(newBlogs)
    }

    if (user) {
        return (
            <div>
                <h2>blogs</h2>
                <Notification message={notificationMessage} color={notificationColor} />
                <div>
                    {user.name} logged in
                    <button onClick={handleLogout}>logout</button>
                </div>

                <Togglable buttonLabel='new blog' ref={newBlogRef}>
                    <BlogForm
                        handleCreateBlog={handleCreateBlog}
                    />
                </Togglable>

                {blogs.map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        handleUpdateBlog={handleUpdateBlog}
                        handleRemoveBlog={handleRemoveBlog}
                        currentUser={user}
                    />
                )}
            </div>
        )
    }

    return (
        <div>
            <Notification message={notificationMessage} color={notificationColor} />
            <div id='login-div'>
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                />
            </div>
        </div>
    )
}

export default App