import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FuelPump, Search, Tools, Wrench } from 'react-bootstrap-icons';
import { getUserVehicles, getVehicleExpenseSummary } from '../api/carAPI';
import layoutStyles from './layoutStyle.module.css';

export default function MyCars() {
    const [vehicles, setVehicles] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getUserVehicles();
                setVehicles(data);

                const summaryPairs = await Promise.all(
                    data.map(async (vehicle) => {
                        try {
                            const summary = await getVehicleExpenseSummary(vehicle.matricule);
                            return [vehicle.matricule, summary];
                        } catch {
                            return [vehicle.matricule, null];
                        }
                    })
                );
                setSummaries(Object.fromEntries(summaryPairs));
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter((vehicle) => {
        const text = `${vehicle.brand} ${vehicle.model} ${vehicle.type} ${vehicle.matricule}`.toLowerCase();
        return text.includes(keyword.toLowerCase());
    });

    const formatMoney = (value) => {
        const amount = Number(value || 0);
        return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const formatImage = (img) => {
        if (!img) return null;
        return typeof img === 'string' && !img.startsWith('data:') ? `data:image/jpeg;base64,${img}` : img;
    };

    const goToExpense = (path, matricule) => {
        navigate(path, { state: { matricule } });
    };

    return (
        <main className={layoutStyles.garagePage}>
            <section className={layoutStyles.garageHero}>
                <div>
                    <p className={layoutStyles.eyebrow}>Logged-in garage</p>
                    <h1>My Cars</h1>
                    <p>Track every vehicle, search fast, and keep expense history moving from one place.</p>
                </div>
                <Link to="/addCar" className={layoutStyles.heroAction}>Add car</Link>
            </section>

            <div className={layoutStyles.garageToolbar}>
                <Search />
                <input
                    type="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Search by brand, model, type, or matricule"
                />
            </div>

            {loading ? (
                <p className={layoutStyles.emptyState}>Loading your cars...</p>
            ) : vehicles.length === 0 ? (
                <div className={layoutStyles.emptyState}>
                    <h2>No cars yet</h2>
                    <p>Add your first vehicle and Auto Mode will guide you through fuel, oil, and repair expenses.</p>
                </div>
            ) : (
                <section className={layoutStyles.garageGrid}>
                    {filteredVehicles.map((vehicle) => (
                        <article key={vehicle.matricule} className={layoutStyles.garageCard}>
                            <div className={layoutStyles.garageImage}>
                                {formatImage(vehicle.image) ? (
                                    <img src={formatImage(vehicle.image)} alt={`${vehicle.brand} ${vehicle.model}`} />
                                ) : (
                                    <span>{vehicle.brand?.charAt(0)}{vehicle.model?.charAt(0)}</span>
                                )}
                            </div>

                            <div className={layoutStyles.garageCardBody}>
                                <div className={layoutStyles.garageCardTitle}>
                                    <div>
                                        <h2>{vehicle.brand} {vehicle.model}</h2>
                                        <p>{vehicle.type} - {vehicle.year} - {vehicle.matricule}</p>
                                    </div>
                                    <button type="button" onClick={() => navigate(`/car/${encodeURIComponent(vehicle.matricule)}`)}>
                                        Details
                                    </button>
                                </div>

                                <div className={layoutStyles.metricGrid}>
                                    <div>
                                        <span>Total expenses</span>
                                        <strong>{formatMoney(summaries[vehicle.matricule]?.totalExpenses)}</strong>
                                    </div>
                                    <div>
                                        <span>Expense / mile</span>
                                        <strong>{formatMoney(summaries[vehicle.matricule]?.costPerMile)}</strong>
                                    </div>
                                    <div>
                                        <span>Mileage</span>
                                        <strong>{Number(vehicle.currentMileage || 0).toLocaleString()}</strong>
                                    </div>
                                </div>

                                <div className={layoutStyles.expenseBreakdown}>
                                    <span>Fuel {formatMoney(summaries[vehicle.matricule]?.fuelTotal)}</span>
                                    <span>Oil {formatMoney(summaries[vehicle.matricule]?.oilTotal)}</span>
                                    <span>Repair {formatMoney(summaries[vehicle.matricule]?.repairTotal)}</span>
                                </div>

                                <div className={layoutStyles.garageActions}>
                                    <button type="button" onClick={() => goToExpense('/fuelForm', vehicle.matricule)}><FuelPump /> Fuel</button>
                                    <button type="button" onClick={() => goToExpense('/oilChange', vehicle.matricule)}><Tools /> Oil</button>
                                    <button type="button" onClick={() => goToExpense('/repairform', vehicle.matricule)}><Wrench /> Repair</button>
                                </div>
                            </div>
                        </article>
                    ))}
                    {filteredVehicles.length === 0 && (
                        <p className={layoutStyles.emptyState}>No cars match your search.</p>
                    )}
                </section>
            )}
        </main>
    )
}
