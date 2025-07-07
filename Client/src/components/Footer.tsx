import { Link } from "react-router-dom";

export function Footer() {
    return (
       <footer
            className="w-full border-t py-3 px-6 text-sm transition"
            style={{
                backgroundColor: "var(--color-softAqua)",
                color: "var(--color-deepTealBlue)",
                borderColor: "var(--color-softAqua)",
            }}
            >
            <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                
                <div className="text-center sm:text-left">
                    &copy; {new Date().getFullYear()} CondoLink. All rights reserved.
                </div>

                <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                    <Link to="/about" className="px-2 py-1" style={{ color: "var(--color-deepTealBlue)" }}>
                        About
                    </Link>
                </div>

            </div>
        </footer>
    );
}