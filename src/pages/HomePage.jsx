import HeaderMenu from "../layout/HeaderMenu";
import rporsche from "../assets/images/porsche-taycan right view.png";
import lporsche from "../assets/images/porsche-taycan left view.png";
import darkerLogo from "../assets/logos/darker logo.png";
import pageStyle from "./page.module.css";
import CarBrowser from "../layout/CarBrowser";
import BestCar from '../layout/BestCar';

export default function HomePage() {
    return (
        <div className={ pageStyle.homePage }>
            <HeaderMenu />
            <div className={ pageStyle.homeIntro }>
                <img src={lporsche} alt="" className={pageStyle.homeIntroImageLeft}/>
                <img src={ darkerLogo } className={ pageStyle.homeIntroLogo } alt=""/>
                <img src={rporsche} alt="" className={pageStyle.homeIntroImageRight}/>
            </div>
            <div>
                <h2 className={ pageStyle.homeWelcomingTitle }>
                    Welcome to <span className={ pageStyle.SpanhomeWelcomingTitle } >Auto Mode</span>
                </h2>
                <h3 className={ pageStyle.homeWelcomingSlogan }>
                    Your best destination for getting your dream car at the best price, with the best quality and the best service.
                </h3>
            </div>
            <BestCar />
            <CarBrowser />
        </div>
            
    )
}
