export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-indigo-50 to-violet-100">
            {children}
        </div>
    );
}