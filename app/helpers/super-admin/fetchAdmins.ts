import { Admin } from "app/helpers/constants";

export async function fetchAdmins() {
    try {
        const response = await fetch("/api/super-admin/admins/get-admins");

        if (!response.ok) {
            throw 'Failed to fetch admins data';
        }

        const {admins, activeAdminsCount, inactiveAdminsCount} = await response.json();

        return {admins, activeAdminsCount, inactiveAdminsCount};
    } catch (error) {
        throw error;
    }
}