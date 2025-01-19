export async function fetchInvoices(userId: string) {
    const response = await fetch(`/api/admin/invoice/get-invoices?userId=${userId}`);

    const data = await response.json();
    if (!response.ok) 
        throw (data.error || 'حدث خطأ أثناء جلب الفواتير، حاول ثانيةً');
    
    return data;
}