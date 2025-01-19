"use client";
// React
import React, { useEffect, useState } from "react";
// Helpers
import { fetchIncomeData } from "app/helpers/admin/income/fetchIncomeData";
import { IncomeRecord, IncomeSummary } from "app/helpers/constants";
import * as XLSX from "xlsx";
import useGetUserInfo from "app/helpers/hooks/user/useGetUserInfo";
// Components
import IncomeRecordsTable from "./components/IncomeRecordsTable";
import MainButton from "app/@components/ui/form/MainButton";
import Loading from "app/@components/ui/Loading";
import DynamicTitle from "app/@components/global/DynamicTitle";

const Income: React.FC = () => {
    // Income Data
    const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
    const [incomeSummary, setIncomeSummary] = useState<IncomeSummary>();
    // Date
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    // // Conditionally Form States
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Download Sheet Library States
    const [dwnldLoading, setDwnldLoading] = useState<boolean>(false);
    const [dwnldErr, setDwnldErr] = useState<string | null>(null);

    // Income
    const handleFetchIncome = async (
        userId: string,
        all?: string | null,
        startDate?: string | null,
        endDate?: string | null
    ) => {
        setLoading(true);
        setError(null);

        const data = await fetchIncomeData(userId, all, startDate, endDate);

        if (data) {
            setIncomeRecords(data.records);
            setIncomeSummary(data.summary);
        } else setError("حدث خطأ أثناء جلب البيانات، حاول ثانيةً");

        setLoading(false);
    };
    const { loading: userInfoLoading, userInfo } = useGetUserInfo();
    const handleGetDefaultIncomeData = () => { // Default is the last 30 Records
        // Reset Date Range
        if (startDate || endDate) {
            setStartDate("");
            setEndDate("");
        }
        // Fetch All Income Data
        if (!userInfoLoading && userInfo) handleFetchIncome(userInfo.id);
    };
    useEffect(() => handleGetDefaultIncomeData(), [userInfo]);
    const handleGetIncomeByCustomDate = () => {
        if (userInfo && startDate && endDate)
            handleFetchIncome(userInfo.id, null, startDate, endDate);
    };

    // Handle Download Income Sheet
    const downloadSheet = (records: IncomeRecord[], sheetName: string) => {
        const sheetData = records.map((record) => ({
            "آخر تحديث": new Date(record.updatedAt).toLocaleString('ar'),
            "تاريخ الإنشاء": new Date(record.createdAt).toLocaleString('ar'),
            "إجمالي الإيرادات": record.totalIncome,
            "إيرادات البوفيه": record.buffetIncome,
            "إيرادات اللعب": record.playingIncome,
            "تاريخ النهاية": new Date(record.periodEnd).toLocaleString('ar'),
            "تاريخ بداية الفترة": new Date(record.periodStart).toLocaleString('ar')
        }));
    
        try {
            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'إيرادات برنامج PS Hub');
        
            // Download the Excel file
            XLSX.writeFile(workbook, `${sheetName}.xlsx`);
        } catch (error) {
            console.error(error)
            setDwnldErr("حدث خطأ أثناء تحميل الملف، حاول ثانيةً!");
        }
    };
    const handleDownloadExcel = async (isDownloadAll?: boolean) => {
        setDwnldLoading(true);
        setDwnldErr(null);

        if (userInfo) {
            // Fetch All Income Records
            if (isDownloadAll) {
                const data = await fetchIncomeData(userInfo.id, "true");

                if (data) {
                    downloadSheet(data.records, `سِجلّات الإيرادات حتى ${new Date().toLocaleDateString()}`);
                } else setDwnldErr("حدث خطأ أثناء تحميل الملف، حاول ثانيةً");
            } else {
                // Fetch Income Records Specifying in Custom Date Range
                if (startDate && endDate) {
                    const data = await fetchIncomeData(userInfo.id, null, startDate, endDate);

                    if (data) {
                        downloadSheet(data.records, `سِجلّات الإيرادات من ${new Date().toLocaleDateString()} حتى ${new Date().toLocaleDateString()}`);
                    } else setDwnldErr("حدث خطأ أثناء تحميل الملف، حاول ثانيةً");
                } else setDwnldErr("برجاء تحديد تاريخ معيّن أولاً")
            }
        } else setDwnldErr('حدث خطأ أثناء جلب البيانات، أعد تحميل الصفحة، أو أعد تسجيل الدخول !')
        setDwnldLoading(false);
    };

    return (
        <section className="p-4">
            <DynamicTitle title='الإيرادات' />
            <h1 className="text-2xl font-bold mb-4">الإيرادات</h1>
            {/* Start Date Filter Box */}
            <div dir="rtl" className="mb-7 flex flex-col lg:flex-row gap-5 items-center justify-center lg:justify-evenly">
                <div className="flex flex-col xsm:flex-row gap-3">
                    <label dir="rtl" htmlFor="start-date" className="me-2 sm:me-0">
                        من:&nbsp;&nbsp;
                        <input
                            id="start-date"
                            type="date"
                            max={new Date().toLocaleDateString("fr-ca")}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 main-input text-center bg-slate-100"
                            placeholder="تاريخ البداية"
                            dir="rtl"
                        />
                    </label>
                    <label dir="rtl" htmlFor="end-date">
                        إلى:&nbsp;&nbsp;
                        <input
                            id="end-date"
                            type="date"
                            min={startDate}
                            max={new Date().toLocaleDateString("fr-ca")}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 main-input text-center bg-slate-100"
                            placeholder="تاريخ النهاية"
                            dir="rtl"
                        />
                    </label>
                </div>
                <div className="flex flex-col xsm:flex-row gap-3">
                    <MainButton
                        onClick={handleGetIncomeByCustomDate}
                        disabled={loading || !(startDate && endDate)}
                    >
                        تحديث
                    </MainButton>
                    <MainButton
                        onClick={handleGetDefaultIncomeData}
                        disabled={loading || !(startDate && endDate)}
                    >
                        جلب آخر 30 سِجل
                    </MainButton>
                </div>
            </div>
            {/* End Date Filter Box */}

            {/* Start Income Stats */}
            <div className="bg-elements p-4 rounded-main mb-4">
                <h2 className="text-lg font-semibold mb-2 italic">الإحصائيات</h2>
                <div className="relative min-h-11">
                    {loading ? (
                        <Loading className="rounded-main" />
                    ) : (
                        <div className="flex flex-col gap-y-3 xsm:gap-y-0 xsm:flex-row xsm:justify-evenly items-center">
                            <div className="text-center font-bold">
                                الإجمالي
                                <h2
                                    dir="rtl"
                                    className="font-bold text-mainActiveText"
                                >
                                    {incomeSummary?.totalIncome.toLocaleString()}
                                    ج
                                </h2>
                            </div>
                            <div className="text-center font-bold">
                                البوفيه
                                <h3
                                    dir="rtl"
                                    className="font-bold text-mainActiveText"
                                >
                                    {incomeSummary?.buffetIncome.toLocaleString()}
                                    ج
                                </h3>
                            </div>
                            <div className="text-center font-bold">
                                اللعب
                                <h3
                                    dir="rtl"
                                    className="font-bold text-mainActiveText"
                                >
                                    {incomeSummary?.playingIncome.toLocaleString()}
                                    ج
                                </h3>
                            </div>
                        </div>
                    )}
                </div>
                <span className="err-msg">{error}</span>
            </div>
            {/* End Income Stats */}

            {/* Start Latest 30 Periodic Incomes Records */}
            <div className="bg-elements p-4 rounded-main mb-4">
                <h2 className="text-lg font-semibold mb-2 italic">
                    سِجل الإيرادات
                </h2>
                <div className="relative min-h-11">
                    {loading ? (
                        <Loading className="rounded-main" />
                    ) : !incomeRecords.length ? (
                        <p>!لا توجد أي إيرادات في هذه الفترة</p>
                    ) : (
                        <>
                            <IncomeRecordsTable records={incomeRecords} />
                            <p dir="rtl" className="text-sm font-mono text-slate-300 mb-2">ملحوظة: الجدول يحتوي على آخر 30 سجل فقط، لرؤية إيرادات الفترات الأقدم يرجى تحديد التاريخ المراد ثم الضغط على زِر "تحميل في نطاق التاريخ المحدد". ولتحميل كل سجلات الإيرادات منذ البداية حتى الآن اضغط على زِر "تحميل كل سسجلات الإيرادات".</p>
                            <div dir="rtl" className="relative min-h-11">
                                <div className="flex gap-4 justify-start items-center">
                                    <MainButton onClick={() => handleDownloadExcel()} className="focus:outline-none">
                                        تحميل سِجلّات الإيرادات في نطاق التاريخ المحدد
                                    </MainButton>
                                    <MainButton onClick={() => handleDownloadExcel(true)} className="focus:outline-none">
                                        تحميل كل سِجلّات الإيرادات
                                    </MainButton>
                                </div>
                                {dwnldLoading && <Loading className="rounded-main" />}
                                {dwnldErr && <p className="err-msg">{dwnldErr}</p>}
                            </div>
                        </>
                    )}
                </div>
                <span className="err-msg">{error}</span>
            </div>
            {/* End Latest 30 Periodic Incomes Records */}
        </section>
    );
};

export default Income;