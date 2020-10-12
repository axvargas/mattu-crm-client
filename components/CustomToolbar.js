import React from 'react'
import { Tooltip, Fab, makeStyles } from '@material-ui/core'
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    btn: {
        marginLeft: theme.spacing(1)
    }
}))
const CustomToolbar = ({ btnDescription, addNewSth }) => {
    const classes = useStyles()
    return (
        <>
            <Tooltip title={btnDescription}>
                <Fab color="primary" size="medium" aria-label="add" onClick={addNewSth} className={classes.btn}>
                    <AddIcon />
                </Fab>
            </Tooltip>
        </>
    )
}

export default CustomToolbar
