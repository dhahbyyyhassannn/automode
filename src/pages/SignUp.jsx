import HeaderMenu from "../layout/HeaderMenu";
import BoxSignUp from "../layout/BoxSignUp";
import SignIn from "./SignIn";
import pageStyles from './page.module.css';
import bmwImage from "../assets/images/bmw.jpeg";

export default function SignUp() {
    return (
        <div>
            <HeaderMenu />
            <div className={pageStyles.loginPageWrapper}>
                <div className={pageStyles.loginCard}>
                    <div className={pageStyles.leftSide}>
                        <img src={bmwImage} alt="Car Detail" />
                    </div>
                    <div className={pageStyles.rightSide}>
                        <BoxSignUp />
                    </div>
                </div>
            </div>
        </div>
    )
}