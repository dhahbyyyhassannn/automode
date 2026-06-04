import { Link } from 'react-router-dom';

export default function AuthButton({ link, text, style, linkStyle, onClick }) {
    return (
       <div className={style}>
            <Link to={link} className={ linkStyle } onClick={ onClick }>
                {text}
            </Link>
       </div>
    )
}
