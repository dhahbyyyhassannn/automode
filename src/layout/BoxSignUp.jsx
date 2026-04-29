import layoutStyles from './layoutStyle.module.css'

export default function BoxSignUp() {
    return (
        <div className={layoutStyles['signInContainer']}>
            <h2 className={layoutStyles['formTitle']}>Sign Up</h2>
            <form>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Name:</label>
                    <input className={layoutStyles['input']} type="text" placeholder="Your name" />
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Email:</label>
                    <input className={layoutStyles['input']} type="email" placeholder="name@example.com" />
                </div>
                <div className={layoutStyles['formGroup']}>
                    <label className={layoutStyles['Label']}>Password:</label>
                    <input className={layoutStyles['input']} type="password" placeholder="••••••••" />
                </div>
                <button type="submit" className={layoutStyles['btn']}>Create Account</button>
            </form>
        </div>
    )
}