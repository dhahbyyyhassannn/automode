import logo from '../assets/logos/logo-automode.png'
import AuthButton from '../components/buttons/AuthButton'
import styles from '../components/buttons/buttonStyle.module.css'
import layoutStyles from './layoutStyle.module.css'
import MenuLink from '../components/links/MenuLink'
import { House, Person, PlusCircle, Speedometer2 } from 'react-bootstrap-icons'
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
                    {user != null && <MenuLink icon={ Speedometer2 } linkName={ "my cars" } path={ "/myCars" } />}
                    <MenuLink icon={ PlusCircle } linkName={ "add car" } path={ "/addCar" } />
                </li>
                {user==null && (
                    <li className={layoutStyles.buttons}>
                        <AuthButton link="/signin" text="sign in" style={styles.signInButton} linkStyle={styles.signInLink} />
                        <AuthButton link="/signup" text="Sign up" style={styles.signUpButton} linkStyle={styles.signUpLink} />
                    </li>
                )}
                {user!=null && (
                    <li className={layoutStyles.buttons}>
                        <span className={layoutStyles.userChip}><Person /> {user.name}</span>
                        <AuthButton link="/dashboard" text="Profile" style={styles.signInButton} linkStyle={ styles.signInLink }/>
                        <AuthButton link="/" text="Logout" style={styles.signUpButton} linkStyle={ styles.signUpLink } onClick={handleLogout} />
                    </li> 
                )}
            </ul>
        </nav>
    )
}
