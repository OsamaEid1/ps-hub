export async function fetchBuffetItemById(id: string, userId: string) {
    try {
        const response = await fetch(`/api/admin/buffet/get-buffet-item?id=${id}&userId=${userId}`);
        
        if (!response.ok) {
            throw 'حدث خطأ أثناء جلب بيانات العنصر، أو أنه غير موجود !';
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}