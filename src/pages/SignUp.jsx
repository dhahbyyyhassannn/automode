import HeaderMenu from "../layout/HeaderMenu";
import BoxSignUp from "../layout/BoxSignUp";
import SignIn from "./SignIn";
import './page.css';
import bmwImage from "../assets/images/bmw.jpeg";

export default function SignUp() {
    return (
        <div>
            <HeaderMenu />
            <div className="loginPageWrapper">
                <div className="loginCard">
                    <div className="leftSide">
                        <img src={bmwImage} alt="Car Detail" />
                    </div>
                    <div className="rightSide">
                        <BoxSignUp />
                        <p>Already have an account? <a href="/signIn">Login here</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}