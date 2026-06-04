import { Link } from 'react-router-dom';
import layoutStyles from '../layout/layoutStyle.module.css';
import HeaderMenu from '../layout/HeaderMenu';
import MyCars from '../layout/MyCars';
export default function MyCarsPage() {

    const token = localStorage.getItem("token");
    return (
        <>
            {token === null && (
                <div className={layoutStyles.authRequired}>
                    <h2>You need to sign in to view your cars.</h2>
                    <Link to="/signin" className={layoutStyles.btn}>Sign In</Link>
                </div>
            )}
            {token !== null && (
                <div>
                    <HeaderMenu />
                    <MyCars />
                </div>
            )}
        </>
    )
}
