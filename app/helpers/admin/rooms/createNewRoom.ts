import type { EditableRoom } from "app/helpers/constants";

export const createNewRoom = async ({ ...roomInfo } : EditableRoom): Promise<EditableRoom> => {
    const response = await fetch('/api/admin/rooms/add-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...roomInfo }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data.error || 'حدث خطأ أثناء جلب البيانات، حاول ثانيةً أو أعد تسجيل الدخول';
    }

    return data;
};