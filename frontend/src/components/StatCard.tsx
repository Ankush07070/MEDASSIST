import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    subtitle: string;
    icon: LucideIcon;
    color: string;
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            className="bg-white rounded-3xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition-all duration-300"
        >
            <div>
                <p className="text-slate-500 text-sm">
                    {title}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                    {value}
                </h2>

                <p className="text-slate-400 mt-2 text-sm">
                    {subtitle}
                </p>
            </div>

            <div
                className={`${color} p-4 rounded-2xl`}
            >
                <Icon
                    size={34}
                    className="text-white"
                />
            </div>
        </motion.div>
    );
}

export default StatCard;