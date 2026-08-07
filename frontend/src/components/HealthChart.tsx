import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
} from "recharts";

const data = [
    { day: "Mon", score: 68 },
    { day: "Tue", score: 72 },
    { day: "Wed", score: 75 },
    { day: "Thu", score: 81 },
    { day: "Fri", score: 79 },
    { day: "Sat", score: 85 },
    { day: "Sun", score: 90 },
];

function HealthChart() {

    return (

        <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-xl font-bold">
                        Health Analytics
                    </h2>

                    <p className="text-slate-500">
                        Weekly Health Score
                    </p>

                </div>

                <div className="text-right">

                    <h1 className="text-4xl font-bold text-indigo-600">
                        90
                    </h1>

                    <p className="text-green-500">
                        +12%
                    </p>

                </div>

            </div>

            <div className="h-72">

                <ResponsiveContainer width="100%" height="100%">

                    <AreaChart data={data}>

                        <defs>

                            <linearGradient
                                id="colorScore"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="5%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.7}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#6366f1"
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

                        <XAxis dataKey="day"/>

                        <CartesianGrid strokeDasharray="3 3"/>

                        <Tooltip/>

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#6366f1"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default HealthChart;