export default function AuthButton({ link, text, style, linkStyle, onClick }) {
    return (
       <div className={style}>
            <a href={link} className={ linkStyle } onClick={ onClick }>
                {text}
            </a>
       </div>
    )
}