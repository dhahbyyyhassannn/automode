import HeaderMenu from "../layout/HeaderMenu";
import SearchCar from "../layout/SearchCar";
import rporsche from "../assets/images/porsche-taycan right view.png";
import lporsche from "../assets/images/porsche-taycan left view.png";
import darkerLogo from "../assets/logos/darker logo.png";
import pageStyle from "./page.module.css";
import SearchCar from "../layout/SearchCar";

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
                    Welcome to Auto Mode
                </h2>
                <h3 className={ pageStyle.homeWelcomingSlogan }>
                    Your best destination for getting your dream car at the best price, with the best quality and the best service.
                </h3>
                <div className="">
                    <SearchCar />
                </div>
            </div>
            <SearchCar/>
        </div>
            
    )
}
