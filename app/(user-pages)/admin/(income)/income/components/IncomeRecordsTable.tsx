const IncomeRecordsTable = ({ records }) => {
    return (
        <div 
            dir='rtl'
            className="relative overflow-x-auto my-10 rounded-main text-center"
        >
            <table className="w-full text-base">
                <thead className="uppercase bg-secondary text-base">
                    <tr>
                        <th className="px-6 py-3">بداية الفترة</th>
                        <th className="px-6 py-3">نهايتها</th>
                        <th className="px-6 py-3">إيراد اللعب</th>
                        <th className="px-6 py-3">إيراد البوفيه</th>
                        <th className="px-6 py-3">الإجمالي</th>
                        <th className="px-6 py-3">تاريخ الإنشاء</th>
                        <th className="px-6 py-3">آخر تحديث</th>
                    </tr>
                </thead>
                <tbody className='border-t-2 border-gray-700 py-10'>
                    {records.map((item) => (
                        <tr key={item.id} className="border-b border-gray-700 bg-elements duration-300 hover:bg-secondary hover:text-mainActiveText">
                            <td className="px-6 py-3">{new Date(item.periodStart).toLocaleString("ar")}</td>
                            <td className="px-6 py-3">{new Date(item.periodEnd).toLocaleString("ar")}</td>
                            <td className="px-6 py-3">{item.playingIncome.toLocaleString()}ج</td>
                            <td className="px-6 py-3">{item.buffetIncome.toLocaleString()}ج</td>
                            <td className="px-6 py-3">{item.totalIncome.toLocaleString()}ج</td>
                            <td className="px-6 py-3">{new Date(item.createdAt).toLocaleString("ar")}</td>
                            <td className="px-6 py-3">{new Date(item.updatedAt).toLocaleString("ar")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeRecordsTable;
