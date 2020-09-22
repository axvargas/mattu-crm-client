import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@material-ui/core'
import InboxIcon from '@material-ui/icons/Inbox'
import DraftsIcon from '@material-ui/icons/Drafts'

const SelectedList = () => {
    // Next Js router
    const router = useRouter()
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    return (
        <List component="nav" aria-label="drawer-list">
            <Link href="/" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/"}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clients" />
                </ListItem>
            </Link>
            <Link href="/orders" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/orders"}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Orders" />
                </ListItem>
            </Link>
            <Link href="/products" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/products"}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem>
            </Link>
            <Divider />
        </List>
    )
}

export default SelectedList
