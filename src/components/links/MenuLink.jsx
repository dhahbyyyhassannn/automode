import { useState } from 'react'
import styles from './linkStyle.module.css'
import { useNavigate } from 'react-router-dom'

export default function MenuLink({ icon: Icon, linkName, path }) {
    const [hovered, setHovered] = useState(false);
    const navigation = useNavigate() 
    return (
        <div className={styles.linkStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigation(path)}
        >
            {Icon && <Icon style= {{
                color: hovered ? "var(--secondlyColor)" : "var(--thirdColor)",
                transition: "color 0.5s ease-in-out"
            }} size={24} />}
            <p className={styles.link}>{linkName}</p>
        </div>
    )
    
    
}

