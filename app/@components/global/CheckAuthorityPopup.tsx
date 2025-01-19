'use client'
// React
import React, { useState } from 'react'
// Components
import Popup from '../ui/Popup'
import MainInput from '../ui/form/MainInput'
import MainButton from '../ui/form/MainButton'
import Loading from '../ui/Loading'
// Helpers
import { isPasswordValid } from 'app/helpers/auth/isPasswordValid'

function CheckAuthorityPopup({ onToggle, userId, setIsAuthorizationSucceed }) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userId && password !== "") {
            setLoading(true);
            setError(null);

            try {
                const result = await isPasswordValid(userId, password);
                if (result) {
                    setIsAuthorizationSucceed(true);
                    onToggle();
                }
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Popup text="أكِّد هويتك" onToggle={onToggle} className="main-card">
            {loading && <Loading className="rounded-main" />}
            <form onSubmit={handleSubmit}>
                <MainInput
                    type="password"
                    placeholder="كلمة السر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <span className="err-msg">{error}</span>}
                <MainButton
                    type="submit"
                    className="mx-auto mt-5 px-4 text-lg"
                    disabled={!password || loading}
                >
                    تأكيد
                </MainButton>
            </form>
        </Popup>
    );
}

export default CheckAuthorityPopup;