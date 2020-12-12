import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleCreateBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const newBlog = async event => {
        event.preventDefault()

        const newBlogData = {
            title,
            author,
            url
        }

        await handleCreateBlog(newBlogData)

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={newBlog}>
                <div>
                    title:
                    <input
                        id='titleInput'
                        type='text'
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        id='authorInput'
                        type='text'
                        value={author}
                        onChange={event => setAuthor(event.target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        id='urlInput'
                        type='text'
                        value={url}
                        onChange={event => setUrl(event.target.value)}
                    />
                </div>
                <input id='blogSubmit' type='submit' value='create' />
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    handleCreateBlog: PropTypes.func.isRequired
}

export default BlogForm