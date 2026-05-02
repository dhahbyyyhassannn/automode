import { Search } from "react-bootstrap-icons"
import layoutStyle from "./layoutStyle.module.css"


export default function SearchCar() {
    return (
        <div className={layoutStyle.searchCarContainer}>
            <h3>
                Search a car
            </h3>
            <div className={layoutStyle.searchBar}>
                <button>
                    <Search />
                </button>
                <input type="text" placeholder="Search for a car..." name="search"/>
            </div>
            <h5>
                and find the information you need to make the best decision !
            </h5>
        </div>
    )
}