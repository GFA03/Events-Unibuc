import React from "react"; // Import your Header

export default function PublicLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}