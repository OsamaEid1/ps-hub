export const fetchBuffet = async (userId: string) => {
    try {
        const response = await fetch(`/api/admin/buffet/get-buffet?userId=${userId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw '!لا توجد أي عناصر في البوفيه بعد';
            }
            throw 'خطأ في جلب البياننات، أعد تحميل الصفحة، أو أعد تسجيل الدخول';
        }
        const data = await response.json();

        return data;
    } catch (error: any) {
        throw error;
    }
};