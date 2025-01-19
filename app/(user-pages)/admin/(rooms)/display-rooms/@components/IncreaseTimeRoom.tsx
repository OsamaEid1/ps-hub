import MainButton from 'app/@components/ui/form/MainButton';
import Loading from 'app/@components/ui/Loading';
import Modal from 'app/@components/ui/Modal'
import { updateRoomById } from 'app/helpers/admin/rooms/updateRoomById';
import React, { useState } from 'react'

function IncreaseTimeRoom({ room, onToggle }) {
    const [endTimeInHours, setEndTimeInHours] = useState<number>(0);
    const [endTimeInMins, setEndTimeInMins] = useState<0 | 30>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetEndTimeInMins = (time: number) => {
        if (time === 0 || time === 30) setEndTimeInMins(time);
        else setEndTimeInMins(0);
    };
    const handleSetEndTimeInHours = (time: number) => {
        if (time > 0) setEndTimeInHours(time);
        else setEndTimeInHours(0);
    };


    const incrementEndTime = (currentEndTime: string, additionalTime: string): string => {
        // Helper function to convert "HH:MM" to total minutes
        const timeStringToMinutes = (timeString: string): number => {
            const [hours, minutes] = timeString.split(":").map(Number);
            return hours * 60 + minutes;
        };

        // Helper function to convert total minutes back to "HH:MM" format
        const minutesToTimeString = (totalMinutes: number): string => {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        // Convert currentEndTime and additionalTime to minutes
        const currentEndTimeInMinutes = timeStringToMinutes(currentEndTime);
        const additionalTimeInMinutes = timeStringToMinutes(additionalTime);

        // Add the times
        const newEndTimeInMinutes = currentEndTimeInMinutes + additionalTimeInMinutes;

        // Convert back to "HH:MM" format
        return minutesToTimeString(newEndTimeInMinutes);
    };
    const handleIncreaseTime = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const updatedEndTime = incrementEndTime(room.endTime, `${endTimeInHours}:${endTimeInMins}`);
        try {
            const updatedRoom = await updateRoomById({...room, endTime: updatedEndTime}, room.id);

            onToggle(updatedRoom);
        } catch (e: any) {
            setError(e)
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal onToggle={() => onToggle(room)}>
            <form
                dir="rtl"
                className="main-card relative"
                onSubmit={handleIncreaseTime}
            >
                <div className="my-3 mt-5 text-center bg-primary p-2 rounded-main">
                    <label className="me-3">
                        ساعات:
                        <input
                            id="endTimeInHours"
                            className="w-12 h-8 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                            type="number"
                            min={0}
                            step={1}
                            value={endTimeInHours}
                            onChange={(e) =>
                                handleSetEndTimeInHours(+e.target.value)
                            }
                        />
                    </label>
                    <label>
                        دقائق:
                        <input
                            id="endTimeInMins"
                            className="w-12 h-8 text-center rounded-lg font-semibold ms-1 text-base focus:outline-2 focus:outline-mainBlue"
                            type="number"
                            min={0}
                            max={30}
                            step={30}
                            value={endTimeInMins}
                            onChange={(e) =>
                                handleSetEndTimeInMins(+e.target.value)
                            }
                        />
                    </label>
                </div>

                {loading && (<Loading className='rounded-main' />)}
                {error && (<span className='err-msg'>{error}</span>)}

                <MainButton
                    type='submit'
                    className='mx-auto'
                >
                    زيادة
                </MainButton>
            </form>
        </Modal>
    )
}

export default IncreaseTimeRoom