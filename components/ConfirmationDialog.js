import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import Spinner from '../components/spinner'
import { Backdrop } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 200,
    },
}))

const ConfirmationDialog = ({ open, handleCancel, handleDelete, title, message, loading }) => {
    const classes = useStyles()
    return (
        <>
            <Backdrop className={classes.backdrop} open={loading}>
                <Spinner />
            </Backdrop>
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCancel()} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete()} color="primary" autoFocus>
                        Confirm
                     </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default ConfirmationDialog