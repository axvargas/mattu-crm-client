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
import AssessmentIcon from '@material-ui/icons/Assessment'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
const SelectedList = () => {
    // Next Js router
    const router = useRouter()
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    return (
        <List component="nav" aria-label="drawer-list">
            <Link href="/clients" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/clients"}
                    onClick={(event) => handleListItemClick(event, 0)}
                >
                    <ListItemIcon>
                        <RecentActorsIcon />
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
                        <LibraryBooksIcon />
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
                        <ShoppingBasketIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem>
            </Link>
            <Divider />
            <br />
            <Link href="/best-sellers" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/best-sellers"}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Best sellers" />
                </ListItem>
            </Link>
            <Link href="/best-clients" passHref>
                <ListItem
                    button
                    component="a"
                    selected={router.pathname === "/best-clients"}
                    onClick={(event) => handleListItemClick(event, 1)}
                >
                    <ListItemIcon>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Best clients" />
                </ListItem>
            </Link>
        </List>
    )
}

export default SelectedList
