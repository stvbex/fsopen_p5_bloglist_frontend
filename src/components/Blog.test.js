import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    test('initially renders title and author but not url or likes', () => {
        const blog = {
            title: 'blogtitle',
            author: 'blogauthor',
            url: 'blogurl',
            likes: 5
        }
    
        const mockHandleUpdateBlog = jest.fn()
        const mockHandleRemoveBlog = jest.fn()
        const mockCurrentUser = null
    
        const component = render(
            <Blog 
                blog={blog}
                handleUpdateBlog={mockHandleUpdateBlog}
                handleRemoveBlog={mockHandleRemoveBlog}
                currentUser={mockCurrentUser}
            />
        )
    
        expect(component.container).toHaveTextContent('blogtitle')
        expect(component.container).toHaveTextContent('blogauthor')
        expect(component.container).not.toHaveTextContent('blogurl')
        expect(component.container).not.toHaveTextContent(5)
    })

    test('shows url and number of likes after the details button has been clicked', () => {
        const blog = {
            title: 'blogtitle',
            author: 'blogauthor',
            url: 'blogurl',
            likes: 5,
            user: {
                name: 'creatorname',
                username: 'creatorusername'
            }
        }
    
        const mockHandleUpdateBlog = jest.fn()
        const mockHandleRemoveBlog = jest.fn()
        const mockCurrentUser = {
            username: 'mockusername'
        }

        const component = render(
            <Blog 
                blog={blog}
                handleUpdateBlog={mockHandleUpdateBlog}
                handleRemoveBlog={mockHandleRemoveBlog}
                currentUser={mockCurrentUser}
            />
        )

        const detailsButton = component.getByText('view')
        fireEvent.click(detailsButton)

        expect(component.container).toHaveTextContent('blogurl')
        expect(component.container).toHaveTextContent(5)
    })

    test('calls handleUpdate twice if like button is clicked twice', () => {
        const blog = {
            title: 'blogtitle',
            author: 'blogauthor',
            url: 'blogurl',
            likes: 5,
            user: {
                name: 'creatorname',
                username: 'creatorusername'
            }
        }
    
        const mockHandleUpdateBlog = jest.fn()
        const mockHandleRemoveBlog = jest.fn()
        const mockCurrentUser = {
            username: 'mockusername'
        }

        const component = render(
            <Blog 
                blog={blog}
                handleUpdateBlog={mockHandleUpdateBlog}
                handleRemoveBlog={mockHandleRemoveBlog}
                currentUser={mockCurrentUser}
            />
        )

        const detailsButton = component.getByText('view')
        fireEvent.click(detailsButton)

        const likeButton = component.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(mockHandleUpdateBlog.mock.calls).toHaveLength(2)
    })
})
