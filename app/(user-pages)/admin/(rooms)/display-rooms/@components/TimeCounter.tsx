"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";

interface TimeCounterProps {
    className: string;
    startTime: string; // Start time fetched from DB as a string (ISO format or similar)
    endTime: string; // Ex: 01:30 (num of Hrs : num of Mins)
    roomName: string;
}

const TimeCounter: React.FC<TimeCounterProps> = ({ className, startTime, endTime, roomName }) => {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Convert time in "HH:MM" format to total seconds
    const timeStringToSeconds = (timeString: string): number => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 3600 + minutes * 60;
    };

    useEffect(() => {
        // Convert startTime from string to Date object
        const startTimeInMs = new Date(startTime).getTime();
        let endTimeInSeconds;

        if (endTime) endTimeInSeconds = timeStringToSeconds(endTime);

        const updateTime = () => {
            // Get current time in milliseconds
            const currentTimeInMs = new Date().getTime();
            // Calculate elapsed time in seconds
            const elapsedSeconds = Math.floor((currentTimeInMs - startTimeInMs) / 1000);

            // Check if elapsed time has exceeded endTime
            if (endTimeInSeconds && elapsedSeconds >= endTimeInSeconds) {
                alert(`انتهى الوقت المحدد لروم #${roomName}`);
                clearInterval(intervalId); // Stop the timer
                setTime(secondsToTime(endTimeInSeconds)); // Set to End Time
            } else {
                // Update the timer
                setTime(secondsToTime(elapsedSeconds));
            }
        };

        // Initialize the timer
        const intervalId = setInterval(updateTime, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [startTime, endTime]);

    // Format seconds into hours, minutes, and seconds
    const secondsToTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds };
    };

    return (
        <div
            dir="ltr"
            className={`bg-slate-600 text-center rounded-main font-medium text-xl ${className} flex justify-around py-2 px-1`}
        >
            <span dir="rtl">{`${time.seconds.toString().padStart(2, "0")}`}<span className="text-sm ms-px text-mainActiveText">ث</span></span>|
            <span dir="rtl">{`${time.minutes.toString().padStart(2, "0")}`}<span className="text-sm ms-px text-mainActiveText">د</span></span>|
            <span dir="rtl">{`${time.hours.toString().padStart(2, "0")}`}<span className="text-sm ms-px text-mainActiveText">س</span></span>
        </div>
    );
};

export default TimeCounter;