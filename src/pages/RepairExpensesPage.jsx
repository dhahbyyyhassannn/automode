import HeaderMenu from "../layout/HeaderMenu";
import RepairExpenseForm from "../layout/RepairExpenseForm";
import pageStyles from './page.module.css';


export default function RepairExpensesPage() {

    const token = localStorage.getItem("token");
    return (
        <div>
            {token ? (
                <>
                    <HeaderMenu />
                    <div className={pageStyles.pageWrapper}>
                        <RepairExpenseForm />
                    </div>
                </>
            ) : (
                <p>You must be logged in to view this page.</p>
            )}
        </div>
    )
}
