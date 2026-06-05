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
          <h2>Chargement des dépenses...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={pageStyles.expenseContainer}>
        <h2 className={pageStyles.expenseTitle}>Détails des dépenses</h2>

        <div className={pageStyles.expenseGrid}>
          {/* Fuel Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardFuel}`}>
            <h3 className={pageStyles.expenseCardTitle}>Plein d'essence</h3>
            {fuelExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>Aucune dépense d'essence enregistrée</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadFuel}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Litre</th>
                    <th className={pageStyles.expenseCellHead}>Prix/Litre</th>
                    <th className={pageStyles.expenseCellHead}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={pageStyles.expenseCell}>{toFixedSafe(expense.liters)} L</td>
                      <td className={pageStyles.expenseCell}>{toFixedSafe(expense.pricePerLitre)} €</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe((expense.liters || 0) * (expense.pricePerLitre || 0))} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Repair Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardRepair}`}>
            <h3 className={pageStyles.expenseCardTitle}>Réparations</h3>
            {repairExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>Aucune réparation enregistrée</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadRepair}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Description</th>
                    <th className={pageStyles.expenseCellHead}>Prochain changement (km)</th>
                    <th className={pageStyles.expenseCellHead}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {repairExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={pageStyles.expenseCell}>{expense.description}</td>
                      <td className={pageStyles.expenseCell}>{expense.nextChangeMiles || 'N/A'} km</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe(expense.amount)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Oil Change Expenses */}
          <div className={`${pageStyles.expenseCard} ${pageStyles.expenseCardOil}`}>
            <h3 className={pageStyles.expenseCardTitle}>Changement d'huile</h3>
            {oilChangeExpenses.length === 0 ? (
              <p className={pageStyles.expenseEmpty}>Aucun changement d'huile enregistré</p>
            ) : (
              <table className={pageStyles.expenseTable}>
                <thead>
                  <tr className={pageStyles.expenseTableHeadOil}>
                    <th className={pageStyles.expenseCellHead}>Date</th>
                    <th className={pageStyles.expenseCellHead}>Type d'huile</th>
                    <th className={pageStyles.expenseCellHead}>Prochain changement (km)</th>
                    <th className={pageStyles.expenseCellHead}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {oilChangeExpenses.map((expense, index) => (
                    <tr key={index} className={pageStyles.expenseRow}>
                      <td className={pageStyles.expenseCell}>
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className={pageStyles.expenseCell}>{expense.oilType || 'N/A'}</td>
                      <td className={pageStyles.expenseCell}>{expense.nextChangeMiles || 'N/A'} km</td>
                      <td className={pageStyles.expenseTotal}>
                        {toFixedSafe(expense.amount)} €
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
