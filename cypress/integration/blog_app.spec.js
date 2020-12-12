const testerData = {
    username: 'tester',
    name: 'Testerides Testerios',
    password: 'jijijiji'
}

const nontesterData = {
    username: 'nontester',
    name: 'Mhtesterides Oxitesterios',
    password: 'huhuhu'
}

describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.request('POST', 'http://localhost:3001/api/users', testerData)
        cy.request('POST', 'http://localhost:3001/api/users', nontesterData)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.get('#login-div')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.get('#username-input').type(testerData.username)
            cy.get('#password-input').type(testerData.password)
            cy.get('#login-button').click()

            cy.contains('Testerides Testerios logged in')
        })

        it('fails with wrong credentials', function () {
            cy.get('#username-input').type(testerData.username)
            cy.get('#password-input').type('huhuhuhuhu')
            cy.get('#login-button').click()

            cy.contains('log in to application')
            cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: testerData.username, password: testerData.password })
        })

        it('A blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#titleInput').type('blogtitle')
            cy.get('#authorInput').type('blogauthor')
            cy.get('#urlInput').type('blogurl')
            cy.get('#blogSubmit').click()

            cy.contains('blogtitle')
        })

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'blogtitle',
                    author: 'blogauthor',
                    url: 'blogurl',
                    likes: 5
                })
                cy.visit('http://localhost:3000')
            })

            it('the user can add a like to a blog', function () {
                cy.contains('blogtitle').find('#viewButton').click()
                cy.contains('blogurl').find('#likeButton').click()
                cy.contains('blogurl').contains('likes 6')
            })

            it('the user can delete the blog', function () {
                cy.contains('blogtitle').find('#viewButton').click()
                cy.contains('blogurl').find('#removeButton').click()
                cy.should('not.contain', 'blogtitle')
            })
        })

        describe('and several blogs exist', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'blogtitle',
                    author: 'blogauthor',
                    url: 'blogurl',
                    likes: 5
                })
                cy.createBlog({
                    title: 'blogtitle2',
                    author: 'blogauthor2',
                    url: 'blogurl2',
                    likes: 6
                })
                cy.login({username: nontesterData.username, password: nontesterData.password })
                cy.createBlog({
                    title: 'blogtitle3',
                    author: 'blogauthor3',
                    url: 'blogurl3',
                    likes: 1
                })
                cy.login({username: testerData.username, password: testerData.password })
            })

            it('blogs are ordered by their likes', function () {
                // Click view buttons
                cy.get('.blog').each($blog => {
                    cy.wrap($blog).get('#viewButton').click()
                })

                cy.get('.blog').first().invoke('text').then(text => {
                    const numLikes = text.match(/likes (\d+)/)[1]
                    cy.wrap(numLikes).should('equal', '6')
                })

                // alternative: cy.wrap(Math.max(...numLikesList)).should('equal', numLikesList[0])
            })

            it('users cannot delete other people\'s blogs', function () {
                cy.get('.blog').contains('blogtitle3').find('#viewButton').click()
                cy.get('.blog').contains('blogtitle3').parent()
                    .contains(nontesterData.name)
                    .should('not.contain', '#removeButton')
            })
        })
    })
})