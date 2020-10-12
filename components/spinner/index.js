import React from 'react'
import styles from './Spinner.module.css'

const index = () => {
    return (
        <div className={styles.spinner}>
            <div className={styles.doubleBounce1}></div>
            <div className={styles.doubleBounce2}></div>
        </div>
    )
}

export default index
