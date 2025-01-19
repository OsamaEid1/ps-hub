"use client";

import { useEffect } from "react";

const DynamicTitle = ({ title }) => {
    useEffect(() => {
        document.title = 'PS Hub | ' + title;
    }, [title]);

    return null;
};

export default DynamicTitle;
