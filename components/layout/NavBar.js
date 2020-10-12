import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import Particles from 'react-particles-js'

import NameDisplay from './NameDisplay'
const DRAWER_WIDTH = 240
const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
    },
    title: {
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    appBar: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            marginLeft: DRAWER_WIDTH,
        }
    }
}));

const NavBar = ({ handleOpenClose }) => {
    const classes = useStyles()

    return (
        <>
            <AppBar position="fixed" color="primary" className={classes.appBar}>
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
                <Toolbar>
                    <IconButton
                        aria-label="menu-icon"
                        color="inherit"
                        className={classes.menuButton}
                        onClick={() => handleOpenClose()}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>
                        <Hidden only="xs" implementation="css">
                            Mattu CRM
                        </Hidden>
                    </Typography>

                    <NameDisplay />
                </ Toolbar >
            </AppBar>
            {/* <div className={classes.toolbar} /> */}
        </>
    )
}

export default NavBar
