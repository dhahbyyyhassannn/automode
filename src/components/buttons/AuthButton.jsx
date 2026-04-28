export default function AuthButton({ link, text, style, linkStyle }) {
    return (
       <div className={style}>
            <a href={link} className={ linkStyle }>
                {text}
            </a>
       </div>
    )
}