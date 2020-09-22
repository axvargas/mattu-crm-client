import React from 'react'
import Link from 'next/link'
import { AppBar, Toolbar, Typography, IconButton, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'

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
                        Mattu CRM
                    </Typography>
                    <Link href="/sign-in" passHref>
                        <Button variant="text" color="inherit">
                            Sign out
                    </Button>
                    </Link>
                </ Toolbar >
            </AppBar>
            {/* <div className={classes.toolbar} /> */}
        </>
    )
}

export default NavBar
