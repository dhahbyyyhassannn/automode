import HeaderMenu from "../layout/HeaderMenu";
import AddCarForm from "../layout/AddCarForm";
import pageStyles from './page.module.css';

export default function AddCarPage() {
    return (
        <div>
            <HeaderMenu />
            <div className={pageStyles.pageWrapper}>
                <AddCarForm/>
            </div>
        </div>
    )
}
