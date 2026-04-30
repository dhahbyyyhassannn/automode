import { useState } from 'react'

import styles from './linkStyle.module.css'

export default function MenuLink({ icon: Icon, linkName }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div className={styles.linkStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {Icon && <Icon style= {{
                color: hovered ? "var(--secondlyColor)" : "var(--thirdColor)",
                transition: "color 0.5s ease-in-out"
            }} size={24} />}
            <p className={styles.link}>{linkName}</p>
        </div>
    )
    
    
}

