import React from 'react'

const LoginForm = props => (
    <form onSubmit={props.handleLogin}>
        <h2>log in to application</h2>
        <div>
            username
            <input
                id='username-input'
                type='text'
                value={props.username}
                onChange={event => props.setUsername(event.target.value)}
            />
        </div>
        <div>
            password
            <input
                id='password-input'
                type='password'
                value={props.password}
                onChange={event => props.setPassword(event.target.value)}
            />
        </div>
        <input id='login-button' type='submit' value='login' />
    </form>
)

export default LoginForm