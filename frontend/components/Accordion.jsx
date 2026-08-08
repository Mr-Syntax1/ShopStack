// components/Accordion.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Accordion({
    question,
    answer,
    isOpen,      // از والد دریافت می‌شود
    onToggle     // تابع برای تغییر وضعیت
}) {
    return (
        <div className="border-r-4 border-purple-600 pr-4">
            <button
                onClick={onToggle}
                className="flex justify-between items-center w-full text-right font-bold text-gray-800 p-4 hover:bg-purple-50 transition-colors cursor-pointer"
            >
                <span>{question}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-600"
                >
                    ▼
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="text-gray-500 text-sm pb-4 px-4">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}