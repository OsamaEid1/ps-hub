// Example: Fetch room by roomId and userId

export async function fetchInvoiceById(id: string, userId: string) {
    const response = await fetch(`/api/admin/invoice/get-invoice?id=${id}&userId=${userId}`);
    const data = await response.json();
    if (!response.ok) {
        throw (data.error || 'حدث خطأ أثناء جلب بيانات الفاتورة، حاول ثانيةً');
    }

    return data;
}

