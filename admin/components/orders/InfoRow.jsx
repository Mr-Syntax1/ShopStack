// یک ردیف اطلاعات (برای نمایش اطلاعات مشتری)

export default function InfoRow({ label, value, num }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-gray-400">{label}</span>
            <span className={`max-w-[60%] text-left font-medium text-gray-700 ${num ? 'font-[var(--font-num)]' : ''}`}>
                {value || '—'}
            </span>
        </div>
    );
}