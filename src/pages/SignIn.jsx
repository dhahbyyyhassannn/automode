import BoxSignIn from "../layout/BoxSignIn";
import HeaderMenu from "../layout/HeaderMenu";
import pageStyles from './page.module.css';
import bmwImage from "../assets/images/bmw.jpeg";
export default function SignIn() {
    return (
        <div>
            <HeaderMenu/>
            <div className={pageStyles.loginPageWrapper}>
                <div className={pageStyles.loginCard}>
                    <div className={pageStyles.leftSide}>
                        <img src={bmwImage} alt="Car Detail"/>
                    </div>
                    <div className={pageStyles.rightSide}>
                        <BoxSignIn/>
                    </div>
                </div>
            </div>
        </div>
    )
}