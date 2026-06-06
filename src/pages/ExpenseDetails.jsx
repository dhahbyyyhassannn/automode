import { useEffect, useState } from 'react';
import HeaderMenu from '../layout/HeaderMenu';
import pageStyles from './page.module.css';
import { getFuelExpenses } from '../api/fuelExpensesAPI';
import { getRepairExpenses } from '../api/repairExpensesAPI';
import { getOilChangeExpenses } from '../api/oilChangeExpensesAPI';

export default function ExpenseDetails({ matricule }) {
  const [fuelExpenses, setFuelExpenses] = useState([]);
  const [repairExpenses, setRepairExpenses] = useState([]);
  const [oilChangeExpenses, setOilChangeExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toFixedSafe = (value, digits = 2) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return 'N/A';
    }
    return Number(value).toFixed(digits);
  };

  useEffect(() => {
    if (!matricule) return;

    const load = async () => {
      try {
        setLoading(true);
        const [fuel, repair, oilChange] = await Promise.all([
          getFuelExpenses(matricule),
          getRepairExpenses(matricule),
          getOilChangeExpenses(matricule)
        ]);
        setFuelExpenses(fuel || []);
        setRepairExpenses(repair || []);
        setOilChangeExpenses(oilChange || []);
      } catch (e) {
        console.error('Failed to load expenses', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [matricule]);

  if (loading) {
    return (
      <>
        <HeaderMenu />
        <div className={pageStyles.expenseLoading}>
          <h2>Loading expenses...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={pageStyles.expenseContainer}>
        <h2 className={pageStyles.expenseTitle}>Expense Details</h2>

        <div className={pageStyles.expenseGrid}>
          {/* Fuel Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardFuel}`}>
            <h3 className={pageStyles.expenseCardTitle}>Fuel Expenses</h3>
            {fuelExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>No fuel expenses recorded</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadFuel}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Liters</th>
                    <th className={pageStyles.expenseCellHead}>Price/Liter</th>
                    <th className={pageStyles.expenseCellHead}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('en-US')}
                      </td>
                      <td className={pageStyles.expenseCell}>{toFixedSafe(expense.liters)} L</td>
                      <td className={pageStyles.expenseCell}>{toFixedSafe(expense.pricePerLitre)} €</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe(expense.cost)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Repair Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardRepair}`}>
            <h3 className={pageStyles.expenseCardTitle}>Repairs</h3>
            {repairExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>No repairs recorded</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadRepair}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Description</th>
                    <th className={pageStyles.expenseCellHead}>Next change (km)</th>
                    <th className={pageStyles.expenseCellHead}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {repairExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('en-US')}
                      </td>
                      <td className={pageStyles.expenseCell}>{expense.description}</td>
                      <td className={pageStyles.expenseCell}>{expense.nextChangeMiles || 'N/A'} km</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe(expense.cost)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Oil Change Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardOil}`}>
            <h3 className={pageStyles.expenseCardTitle}>Oil Change</h3>
            {oilChangeExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>No oil changes recorded</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadOil}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Oil type</th>
                    <th className={pageStyles.expenseCellHead}>Next change (km)</th>
                    <th className={pageStyles.expenseCellHead}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {oilChangeExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('en-US')}
                      </td>
                      <td className={pageStyles.expenseCell}>{expense.oilType || 'N/A'}</td>
                      <td className={pageStyles.expenseCell}>{expense.nextChangeMiles || 'N/A'} km</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe(expense.cost)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
