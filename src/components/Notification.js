import React from 'react'

const Notification = ({ message, color }) => {
    if (message === null) {
        return null
    }

    const divStyle = {
        color
    }

    return (
        <div className='notification' style={divStyle} >
            {message}
        </div>
    )
}

export default Notification