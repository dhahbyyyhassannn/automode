import HeaderMenu from "../layout/HeaderMenu";
import SearchCar from "../layout/SearchCar";
import rporsche from "../assets/images/porsche-taycan right view.png";
import lporsche from "../assets/images/porsche-taycan left view.png";
import darkerLogo from "../assets/logos/darker logo.png";
import pageStyle from "./page.module.css";

export default function HomePage() {
    return (
        <div className={ pageStyle.homePage }>
            <HeaderMenu />
            <div className={ pageStyle.homeIntro }>
                <img src={lporsche} alt="" className={pageStyle.homeIntroImageLeft}/>
                <img src={ darkerLogo } className={ pageStyle.homeIntroLogo } alt=""/>
                <img src={rporsche} alt="" className={pageStyle.homeIntroImageRight}/>
            </div>
            <div className={ pageStyle.homeWelcoming }>
                <h2 className={ pageStyle.homeWelcomingTitle }>
                    Welcome to Auto Mode
                </h2>
                <h3 className={ pageStyle.homeWelcomingSlogan }>
                    Your best destination for getting your dream car at the best price, with the best quality and the best service.
                </h3>
                <h6 className={ pageStyle.homeWelcomingText }>
                     <h2>in this website you can</h2>
                    <ul className={ pageStyle.homeFeatures }>
                        <li className={ pageStyle.homeFeatureItem }>
                            Browse our selection of cars
                        </li>
                        <li className={ pageStyle.homeFeatureItem }>
                            find it's price
                        </li>
                        <li className={ pageStyle.homeFeatureItem }>
                            find it's expenses
                        </li>
                        <li className={ pageStyle.homeFeatureItem }>
                            find it's specifications
                        </li>
                        <li className={ pageStyle.homeFeatureItem }>
                            find it's reviews
                        </li>
                        <li className={ pageStyle.homeFeatureItem }>
                            and more...
                        </li>
                    </ul>
                </h6>
            </div>
            <SearchCar />
        </div>
            
    )
}
