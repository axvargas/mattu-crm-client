import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Drawer } from '@material-ui/core'
import SelectedList from './SelectedList'
const DRAWER_WIDTH = 240
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0
    },
    drawerPaper: {
        width: DRAWER_WIDTH
    },
    toolbar: theme.mixins.toolbar,
}))
const ResponsiveDrawer = ({ variant, open, onClose }) => {
    const classes = useStyles()

    return (
        <Drawer
            className={classes.drawer}
            variant={variant}
            anchor="left"
            classes={{
                paper: classes.drawerPaper
            }}
            open={open}
            onClose={onClose ? onClose : null}
        >
            <div className={classes.toolbar} />
            <Divider />
            <SelectedList />
        </Drawer>
    )
}

export default ResponsiveDrawer
