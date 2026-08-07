import { useEffect, useState } from "react";
import {
    Building2,
    Search,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getHospitals } from "../../api/hospitals";

function Hospitals() {

    const navigate = useNavigate();

    const [hospitals, setHospitals] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadHospitals(
        searchValue = ""
    ) {

        try {

            setLoading(true);

            const data = await getHospitals(
                undefined,
                searchValue
            );

            setHospitals(data);

        } catch (error) {

            console.error(
                "Failed to load hospitals:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadHospitals();

    }, []);

    function handleSearch(
        e: React.FormEvent
    ) {

        e.preventDefault();

        loadHospitals(search);

    }

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="bg-blue-100 p-3 rounded-2xl">

                        <Building2
                            size={28}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold text-slate-800">

                            Hospitals

                        </h1>

                        <p className="text-slate-500 mt-1">

                            Find hospitals and explore available healthcare services.

                        </p>

                    </div>

                </div>

            </div>

            {/* Search */}

            <form
                onSubmit={handleSearch}
                className="flex gap-3"
            >

                <div className="relative flex-1">

                    <Search
                        size={20}
                        className="absolute left-4 top-3.5 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search hospitals..."
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >

                    Search

                </button>

            </form>

            {/* Loading */}

            {loading ? (

                <div className="flex items-center justify-center min-h-[300px]">

                    <p className="text-slate-500">
                        Loading hospitals...
                    </p>

                </div>

            ) : hospitals.length === 0 ? (

                /* Empty State */

                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

                    <Building2
                        size={55}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="text-2xl font-bold text-slate-800 mt-5">

                        No Hospitals Found

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Try searching with a different hospital name.

                    </p>

                </div>

            ) : (

                /* Hospitals */

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {hospitals.map((hospital) => (

                        <div
                            key={hospital.id}
                            className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                        >

                            {/* Hospital Header */}

                            <div className="flex items-start gap-4">

                                <div className="bg-blue-50 p-4 rounded-2xl">

                                    <Building2
                                        size={30}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div className="flex-1">

                                    <h2 className="text-xl font-bold text-slate-800">

                                        {hospital.name}

                                    </h2>

                                    <div className="flex items-start gap-2 mt-2 text-slate-500">

                                        <MapPin
                                            size={17}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <p>

                                            {hospital.address},{" "}
                                            {hospital.city},{" "}
                                            {hospital.state}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Contact */}

                            <div className="mt-6 space-y-3">

                                {hospital.phone && (

                                    <div className="flex items-center gap-3 text-slate-600">

                                        <Phone
                                            size={18}
                                            className="text-slate-400"
                                        />

                                        <span>
                                            {hospital.phone}
                                        </span>

                                    </div>

                                )}

                                {hospital.email && (

                                    <div className="flex items-center gap-3 text-slate-600">

                                        <Mail
                                            size={18}
                                            className="text-slate-400"
                                        />

                                        <span className="break-all">
                                            {hospital.email}
                                        </span>

                                    </div>

                                )}

                            </div>

                            {/* View */}

                            <button
                                onClick={() =>
                                    navigate(
                                        `/hospitals/${hospital.id}`
                                    )
                                }
                                className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                            >

                                View Hospital

                                <ArrowRight size={18} />

                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Hospitals;