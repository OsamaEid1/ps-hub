// Example: Fetch room by roomId and userId

export async function fetchRoomById(id: string, userId: string) {
    const response = await fetch(`/api/admin/rooms/get-room?id=${id}&userId=${userId}`);
    /**** GET request doesn't support "body", so we pass data using query parameter */
    const data = await response.json();
    if (!response.ok) {
        throw data.error || 'حدث خطأ أثناء جلب البيانات، حاول ثانيةً أو أعد تسجيل الدخول';
    }

    return data;
}

