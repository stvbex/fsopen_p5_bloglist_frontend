import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('the create blog event handler is called with the right details', () => {
    const mockHandleCreateBlog = jest.fn()

    const component = render(
        <BlogForm handleCreateBlog={mockHandleCreateBlog} />
    )
    const titleInput = component.container.querySelector('#titleInput')
    fireEvent.change(titleInput, {
        target: { value: 'blogtitle' }
    })
    
    const authoreInput = component.container.querySelector('#authorInput')
    fireEvent.change(authoreInput, {
        target: { value: 'blogauthor' }
    })

    const urlInput = component.container.querySelector('#urlInput')
    fireEvent.change(urlInput, {
        target: { value: 'blogurl' }
    })

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(mockHandleCreateBlog.mock.calls).toHaveLength(1)
    expect(mockHandleCreateBlog.mock.calls[0][0].title).toBe('blogtitle')
    expect(mockHandleCreateBlog.mock.calls[0][0].author).toBe('blogauthor')
    expect(mockHandleCreateBlog.mock.calls[0][0].url).toBe('blogurl')
})