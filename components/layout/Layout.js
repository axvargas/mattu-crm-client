import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, Hidden } from '@material-ui/core'
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

    const [open, setOpen] = useState(false)

    const handleOpenClose = () => {
        setOpen(!open)
    }
    return (
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
    )
}

export default Layout
