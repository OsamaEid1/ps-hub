import { Buffet } from "app/helpers/constants";

export const updateBuffetItemById = async (updatedItemInfo: Buffet) => {

    try {
        const response = await fetch('/api/admin/buffet/update-item', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItemInfo),
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw '!لا يوجد صنف بهذه البيانات، أو أنه تم حذفه بالفعل';
            } else if (response.status === 400) {
                throw `!كل الخانات إجبارية`;
            } else {
                throw  `!حدث خطأ أثناء جلب البيانات، حاول ثانيةً، أو أعد تسجيل الدخول`;
            }
        }

    } catch (error) {
        console.error('Failed to update item: ', error);
        throw error;
    }
};