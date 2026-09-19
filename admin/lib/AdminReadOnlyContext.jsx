"use client";

import { createContext, useContext } from "react";

const AdminReadOnlyContext = createContext({
    isReadOnly: false,
    message: "",
});

export function AdminReadOnlyProvider({ children, isReadOnly, message }) {
    const value = {
        isReadOnly: !!isReadOnly,
        message: message || "پنل ادمین در حال حاضر فقط خواندنی است.",
    };

    return (
        <AdminReadOnlyContext.Provider value={value}>
            {children}
        </AdminReadOnlyContext.Provider>
    );
}

export function useAdminAccess() {
    const context = useContext(AdminReadOnlyContext);
    if (!context) {
        throw new Error(
            "useAdminAccess باید داخل AdminReadOnlyProvider استفاده شود"
        );
    }
    return context;
}
