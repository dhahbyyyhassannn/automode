import layoutStyles from './layoutStyle.module.css'
export default function BoxSignIn() {
    return (
        <div>
            <h2 className={layoutStyles['form-title']}>Sign In</h2>
            <form>
                <div className={layoutStyles['form-group']}>
                    <label className={layoutStyles['Label']} >Email:</label>
                    <input className={layoutStyles['input']} type="email" />
                </div>
                <div className={layoutStyles['form-group']}>
                    <label className={layoutStyles['Label']} >Password:</label>
                    <input className={layoutStyles['input']} type="password" />
                </div>
                <button type="submit" className={layoutStyles['btn']}>Sign In</button>
            </form>
        </div>
    )
}