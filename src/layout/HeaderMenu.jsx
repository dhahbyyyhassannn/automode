import logo from '../assets/logos/logo-automode.png'
import AuthButton from '../components/buttons/AuthButton'
import styles from '../components/buttons/buttonStyle.module.css'
import layoutStyles from './layoutStyle.module.css'
import MenuLink from '../components/links/MenuLink'
import { House, PlusCircle } from 'react-bootstrap-icons'
import { Bookmark } from 'react-bootstrap-icons'
import { InfoCircleFill } from 'react-bootstrap-icons'
import authAPI from '../api/AuthAPI'
import { logout } from '../api/LogoutAPI'
export default function HeaderMenu() {
    const user = authAPI();
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    }
    return (
        <nav className={layoutStyles.header}>
            <ul className={layoutStyles.list}>
                <li className={layoutStyles.title}>
                    <img className={layoutStyles.img} src={ logo } alt="automode's logo" />
                    <h2 className={layoutStyles.titleText}>Auto Mode</h2>
                </li>
                <li className={layoutStyles.links}>
                    <MenuLink icon={ House } linkName={ "home" } path={ "/" } />
                    <MenuLink icon={ Bookmark } linkName={ "saved" } />
                    <MenuLink icon={ InfoCircleFill } linkName={ "about" } />
                    <MenuLink icon={ PlusCircle } linkName={ "add a car" } path={ "/addCar" } />
                </li>
                {user==null && (
                    <li className={layoutStyles.buttons}>
                        <AuthButton link="/signIn" text="sign in" style={styles.signInButton} linkStyle={ styles.signInLink }/>
                        <AuthButton link="/signUp" text="Sign up" style={styles.signUpButton} linkStyle={ styles.signUpLink } />
                    </li>
                )}
                {user!=null && (
                    <li className={layoutStyles.buttons}>
                        <h5>welcome, {user.name}!</h5>
                        <AuthButton link="" text="Profile" style={styles.signInButton} linkStyle={ styles.signInLink }/>
                        <AuthButton link="/" text="Logout" style={styles.signUpButton} linkStyle={ styles.signUpLink } onClick={handleLogout} />
                    </li> 
                )}
            </ul>
        </nav>
    )
}