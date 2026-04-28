import logo from '../assets/logos/logo-automode.png'
import AuthButton from '../components/buttons/AuthButton'
import styles from '../components/buttons/buttonStyle.module.css'
import layoutStyles from './layoutStyle.module.css'
import MenuLink from '../components/links/MenuLink'
import { House } from 'react-bootstrap-icons'
import { Bookmark } from 'react-bootstrap-icons'
import { InfoCircleFill } from 'react-bootstrap-icons'

export default function HeaderMenu() {
    return (
        <nav className={layoutStyles.header}>
            <ul className={layoutStyles.list}>
                <li className={layoutStyles.title}>
                    <img className={layoutStyles.img} src={ logo } alt="automode's logo" />
                    <h2 className={layoutStyles.titleText}>Auto Mode</h2>
                </li>
                <li className={layoutStyles.links}>
                    <MenuLink icon={ House } linkName={ "home" } />
                    <MenuLink icon={ Bookmark } linkName={ "saved" } />
                    <MenuLink icon={ InfoCircleFill } linkName={ "about" } />
                </li>
                <li className={layoutStyles.buttons}>

                    <AuthButton link="/SignIn" text="Sign In" style={styles.signInButton} linkStyle={ styles.signInLink }/>
                    <AuthButton link="/SignUp" text="Sign Up" style={styles.signUpButton} linkStyle={ styles.signUpLink } />
                </li>
            </ul>
        </nav>
    )
}