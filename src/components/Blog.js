import React, { useState } from 'react'

const Blog = ({ blog, handleUpdateBlog, handleRemoveBlog, currentUser }) => {
    const [detailsVisible, setDetailsVisible] = useState(false)

    const toggleVisibility = () => {
        setDetailsVisible(!detailsVisible)
    }

    const handleLike = () => {
        const updatedBlogData = {
            user: blog.user,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url,
        }

        handleUpdateBlog(blog.id, updatedBlogData)
    }

    const handleRemove = () => {
        let confirmResult = window.confirm(
            `Remove blog ${blog.title} by ${blog.author}`
        )
        if (confirmResult) {
            handleRemoveBlog(blog.id)
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                {detailsVisible
                    ? <input type='button' value='hide' onClick={toggleVisibility} />
                    : <input type='button' value='view' onClick={toggleVisibility} />
                }

            </div>
            {detailsVisible &&
                <div>
                    {blog.url} <br />
          likes {blog.likes}
                    <input type='button' value='like' onClick={handleLike} /> <br />
                    {blog.user.name} <br />
                    {currentUser.username === blog.user.username
                        ? <input type='button' value='remove' onClick={handleRemove} />
                        : null
                    }
                </div>
            }
        </div>
    )
}

export default Blog
