import OilChangeExpenseForm from "../layout/OilChangeExpenseForm";
import HeaderMenu from "../layout/HeaderMenu";
import pageStyles from "./page.module.css";

export default function OilChangePage() {
    return (
        <div>
            <HeaderMenu />
            <div className={pageStyles.pageWrapper}>
                <OilChangeExpenseForm />
            </div>
            
        </div>
    )
}