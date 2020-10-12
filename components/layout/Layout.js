import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Hidden } from '@material-ui/core'
import Particles from 'react-particles-js';

import NavBar from './NavBar'
import ResponsiveDrawer from './ResponsiveDrawer'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    }
}))
const Layout = ({ children }) => {
    const classes = useStyles()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleOpenClose = () => {
        setOpen(!open)
    }
    return (
        <>
            {router.pathname === '/' || router.pathname === '/sign-up' ?
                <>
                    <Particles
                        params={{
                            "particles": {
                                "number": {
                                    "value": 160,
                                    "density": {
                                        "enable": false
                                    }
                                },
                                "size": {
                                    "value": 3,
                                    "random": true,
                                    "anim": {
                                        "speed": 4,
                                        "size_min": 0.3
                                    }
                                },
                                "line_linked": {
                                    "enable": false
                                },
                                "move": {
                                    "random": true,
                                    "speed": 1,
                                    "direction": "top",
                                    "out_mode": "out"
                                }
                            },
                            "interactivity": {
                                "events": {
                                    "onhover": {
                                        "enable": true,
                                        "mode": "bubble"
                                    },
                                    "onclick": {
                                        "enable": true,
                                        "mode": "repulse"
                                    }
                                },
                                "modes": {
                                    "bubble": {
                                        "distance": 250,
                                        "duration": 2,
                                        "size": 0,
                                        "opacity": 0
                                    },
                                    "repulse": {
                                        "distance": 400,
                                        "duration": 4
                                    }
                                }
                            }
                        }}
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0,
                            zIndex: -1,
                            backgroundColor: '#7114ea'
                        }}
                    />
                    {children}
                </>
                :
                <div className={classes.root}>
                    <CssBaseline />
                    <NavBar handleOpenClose={handleOpenClose} />
                    < Hidden smDown implementation="css">
                        <ResponsiveDrawer
                            variant="permanent"
                            open={true}
                        />
                    </Hidden>
                    <Hidden mdUp implementation="css">
                        <ResponsiveDrawer
                            variant="temporary"
                            open={open}
                            onClose={handleOpenClose}
                        />
                    </Hidden>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {children}
                    </main>
                </div>
            }
        </>
    )
}

export default Layout
