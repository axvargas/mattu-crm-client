import React from "react"
import {
    IconButton,
    Tooltip
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
    iconButton: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    iconContainer: {
        marginRight: theme.spacing(3)
    }
}))
const CustomToolbarSelect = ({ handleDelete, handleEdit, selectedRows, displayData, setSelectedRows }) => {
    const classes = useStyles()

    return (
        <div className={classes.iconContainer}>
            <Tooltip title={"Edit"}>
                <IconButton className={classes.iconButton} onClick={() => handleEdit(selectedRows, displayData)}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Delete"}>
                <IconButton className={classes.iconButton} onClick={() => handleDelete(selectedRows, displayData, setSelectedRows)}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default CustomToolbarSelect
