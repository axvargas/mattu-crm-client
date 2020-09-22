import React from 'react'
import Head from 'next/head'

const Layout = ({ children }) => {
    return (
        <>
            <h1>From Layout</h1>
            {children}
        </>
    )
}

export default Layout
