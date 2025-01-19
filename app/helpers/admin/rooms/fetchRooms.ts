export const fetchRooms = async (userId: string) => {
    try {
        const response = await fetch(`/api/admin/rooms/get-rooms?userId=${userId}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw (data.error || 'حدث خطأ أثناء جلب البيانات، حاول ثانيةً أو أعد تسجيل الدخول');
        }

        return data;
    } catch (error: any) {
        console.error("Fetch error: ", error);
        throw error;
    }
};