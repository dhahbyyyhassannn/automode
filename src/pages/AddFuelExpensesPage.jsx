
import FuelExpenseForm from "../layout/FuelExpenseForm";
import HeaderMenu from "../layout/HeaderMenu";
import pageStyles from './page.module.css';
export default function AddFuelExpensesPage() {
    return (
        <div>
            <HeaderMenu />
            <div className={ pageStyles.pageWrapper }>
                <FuelExpenseForm />
            </div>
            
        </div>
    )
}