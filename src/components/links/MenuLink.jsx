import styles from './linkStyle.module.css'
import { useNavigate } from 'react-router-dom'

export default function MenuLink({ icon: Icon, linkName, path }) {
    const navigation = useNavigate() 

    const handleClick = () => {
        if (path) {
            navigation(path);
        }
    };

    return (
        <button
            type="button"
            className={styles.linkStyle}
            onClick={handleClick}
            disabled={!path}
        >
            {Icon && <Icon size={18} />}
            <span className={styles.link}>{linkName}</span>
        </button>
    )
}

