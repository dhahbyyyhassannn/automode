import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FuelPump, Search, Tools, Wrench, Trash } from 'react-bootstrap-icons';
import { getUserVehicles, getVehicleExpenseSummary, deleteVehicle } from '../api/carAPI';
import layoutStyles from './layoutStyle.module.css';
import Swal from 'sweetalert2';

export default function MyCars() {
    const [vehicles, setVehicles] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchVehicles = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (matricule) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteVehicle(matricule);
                Swal.fire(
                    'Deleted!',
                    'Your vehicle has been deleted.',
                    'success'
                );
                fetchVehicles(); // Refresh the list
            } catch (error) {
                console.error("Delete failed:", error);
                Swal.fire(
                    'Error!',
                    'Failed to delete the vehicle.',
                    'error'
                );
            }
        }
    };

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
                    placeholder="Search by brand, model, type, or license plate"
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
                                    <div className={layoutStyles.garageCardHeaderActions}>
                                        <button type="button" onClick={() => navigate(`/car/${encodeURIComponent(vehicle.matricule)}`)}>
                                            Details
                                        </button>
                                        <button type="button" className={layoutStyles.deleteIconBtn} onClick={() => handleDelete(vehicle.matricule)}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>

                                <div className={layoutStyles.metricGrid}>
                                    <div className={layoutStyles.metricCard}>
                                        <span>Total Expenses</span>
                                        <strong>{formatMoney(summaries[vehicle.matricule]?.totalExpenses)} €</strong>
                                    </div>
                                    <div className={`${layoutStyles.metricCard} ${layoutStyles.highlightMetric}`}>
                                        <span>Cost / Mile</span>
                                        <strong>{formatMoney(summaries[vehicle.matricule]?.costPerMile)} €</strong>
                                    </div>
                                    <div className={layoutStyles.metricCard}>
                                        <span>Mileage</span>
                                        <strong>{Number(vehicle.currentMileage || 0).toLocaleString()}</strong>
                                    </div>
                                </div>

                                <div className={layoutStyles.expenseProgress}>
                                    <div className={layoutStyles.progressItem}>
                                        <div className={layoutStyles.progressLabel}>
                                            <span>Fuel</span>
                                            <span>{formatMoney(summaries[vehicle.matricule]?.fuelTotal)} €</span>
                                        </div>
                                        <div className={layoutStyles.progressBar}>
                                            <div 
                                                className={layoutStyles.progressFill} 
                                                style={{ 
                                                    width: `${(summaries[vehicle.matricule]?.fuelTotal / summaries[vehicle.matricule]?.totalExpenses * 100) || 0}%`,
                                                    backgroundColor: '#4d7c76' 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={layoutStyles.progressItem}>
                                        <div className={layoutStyles.progressLabel}>
                                            <span>Oil</span>
                                            <span>{formatMoney(summaries[vehicle.matricule]?.oilTotal)} €</span>
                                        </div>
                                        <div className={layoutStyles.progressBar}>
                                            <div 
                                                className={layoutStyles.progressFill} 
                                                style={{ 
                                                    width: `${(summaries[vehicle.matricule]?.oilTotal / summaries[vehicle.matricule]?.totalExpenses * 100) || 0}%`,
                                                    backgroundColor: '#c9a15f' 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={layoutStyles.progressItem}>
                                        <div className={layoutStyles.progressLabel}>
                                            <span>Repairs</span>
                                            <span>{formatMoney(summaries[vehicle.matricule]?.repairTotal)} €</span>
                                        </div>
                                        <div className={layoutStyles.progressBar}>
                                            <div 
                                                className={layoutStyles.progressFill} 
                                                style={{ 
                                                    width: `${(summaries[vehicle.matricule]?.repairTotal / summaries[vehicle.matricule]?.totalExpenses * 100) || 0}%`,
                                                    backgroundColor: '#7b3b47' 
                                                }}
                                            />
                                        </div>
                                    </div>
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
