import { IncomeResponse } from "app/helpers/constants";

export async function fetchIncomeData(
    userId: string,
    all: string | null = null,
    startDate: string | null = null,
    endDate: string | null = null
): Promise<IncomeResponse | null> {
    try {
        // Build the API URL with query parameters
        const queryParams = new URLSearchParams();
        if (all === "true") queryParams.append('all', all);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const url = `/api/admin/income/get-income?userId=${userId}&${queryParams.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch income data');
        }

        const data: IncomeResponse = await response.json();

        if (data.records.length === 0) {
            // Handle no records found
            console.log('No records found for the given filters.');
            return {
                records: [],
                summary: {
                    playingIncome: 0,
                    buffetIncome: 0,
                    totalIncome: 0,
                },
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching income data:', error);
        return null;
    }
}