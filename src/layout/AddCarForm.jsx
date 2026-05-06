import layoutStyles from './layoutStyle.module.css'

export default function AddCarForm() {
    return (
        <div className={layoutStyles.signInContainer}>
            <h2 className={layoutStyles.formTitle}>Add Vehicle</h2>
            <form>
                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Matricule:</label>
                    <input
                        className={layoutStyles.input}
                        type="text"
                        placeholder="Vehicle registration number"
                        name="matricule"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Brand:</label>
                    <input
                        className={layoutStyles.input}
                        type="text"
                        placeholder="BMW, Mercedes, Toyota"
                        name="brand"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Model:</label>
                    <input
                        className={layoutStyles.input}
                        type="text"
                        placeholder="X5, G-Class, Camry"
                        name="model"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Type:</label>
                    <input
                        className={layoutStyles.input}
                        type="text"
                        placeholder="SUV, Sedan, Truck"
                        name="type"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Year:</label>
                    <input
                        className={layoutStyles.input}
                        type="number"
                        name="year"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Current Mileage (km):</label>
                    <input
                        className={layoutStyles.input}
                        type="number"
                        placeholder="50000"
                        name="currentMileage"
                        required
                    />
                </div>

                <div className={layoutStyles.formGroup}>
                    <label className={layoutStyles.Label}>Vehicle Images:</label>
                    <input
                        className={layoutStyles.input}
                        type="file"
                        name="images"
                        accept="image/*"
                        
                    />
                </div>

                <button type="submit"  className={layoutStyles.btn}>Add Vehicle</button>
            </form>
        </div>
    )
}
