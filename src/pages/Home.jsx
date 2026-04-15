import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Repeat, Users, Sparkles, ArrowRight } from "lucide-react";

const features = [
    {
        icon: Repeat,
        title: "Skill Exchange",
        desc: "Trade expertise directly. No money, no middlemen. Just real value.",
    },
    {
        icon: Users,
        title: "Real Connections",
        desc: "Build meaningful relationships through shared learning.",
    },
    {
        icon: Sparkles,
        title: "Smart Matching",
        desc: "Find people who align with your goals instantly.",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen w-full bg-(--cream-100) text-(--green-900)">

            {/* HERO */}
            <section className="w-full px-6 md:px-12 lg:px-20 pt-28 pb-20">
                <div className="max-w-375 mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <div>

                        <h1 className="text-5xl md:text-7xl leading-tight font-semibold mb-6 tracking-tight">
                            Exchange skills.
                            <br />
                            <span className="text-(--green-600)">Grow together.</span>
                        </h1>

                        <p className="text-lg text-(--green-700) max-w-xl mb-10">
                            A modern way to learn, built on collaboration, not cost. Teach what
                            you know, learn what you need.
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                                className="bg-(--green-800) text-white px-7 py-3 rounded-full flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition"
                            >
                                {user ? "Go to Dashboard" : "Get Started"}
                            </button>

                            {!user && (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="border border-(--green-300) px-7 py-3 rounded-full hover:bg-(--green-50) transition"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-(--green-200) rounded-full blur-3xl opacity-40" />
                        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-(--amber-300) rounded-full blur-3xl opacity-30" />

                        <div className="relative bg-white rounded-3xl border-(--green-100) p-6 shadow-2xl">
                            <div className="space-y-4">
                                {["UI Design ↔ React", "Python ↔ Data Science", "Digital Marketing ↔ Social Media Management",  "Figma ↔ Django",  "TailwindCSS ↔ Custom CSS",  "JavaScript ↔ C++",  "LLMs ↔ Traditional ML"].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center justify-between bg-(--green-50) px-4 py-3 rounded-xl hover:scale-[1.02] transition"
                                    >
                                        <span className="text-sm">{item}</span>
                                        <span className="text-xs text-(--green-600)">Match</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full px-6 md:px-12 lg:px-20 pb-20">
                <div className="max-w-375 mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { num: "2,400+", label: "Skills" },
                        { num: "840+", label: "Trades" },
                        { num: "94%", label: "Success" },
                        { num: "120+", label: "Cities" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white rounded-2xl p-6 text-center border border-(--green-100) hover:shadow-xl hover:-translate-y-1 transition"
                        >
                            <div className="text-3xl font-semibold text-(--green-800)">
                                {s.num}
                            </div>
                            <div className="text-xs uppercase tracking-wide text-(--green-500)">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="w-full px-6 md:px-12 lg:px-20 pb-24">
                <div className="max-w-375 mx-auto grid md:grid-cols-3 gap-10">
                    {features.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="group bg-white p-10 rounded-3xl border border-(--green-100) hover:shadow-2xl hover:-translate-y-2 transition"
                            >
                                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-(--green-50) mb-6 group-hover:scale-110 transition">
                                    <Icon size={22} />
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    {f.title}
                                </h3>

                                <p className="text-sm text-(--green-600) leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {!user && (
                <section className="w-full px-6 md:px-12 lg:px-20 pb-28">
                    <div className="max-w-375 mx-auto">
                        <div className="bg-(--green-900) rounded-3xl p-14 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

                            <div className="absolute w-72 h-72 bg-(--amber-400) opacity-20 blur-3xl -top-20 -right-20" />

                            <div className="relative">
                                <h2 className="text-4xl text-white font-semibold mb-3">
                                    Ready to start trading?
                                </h2>
                                <p className="text-(--green-200) max-w-md">
                                    Join a modern community of learners growing through collaboration.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate("/signup")}
                                className="relative bg-(--amber-400) text-(--green-950) px-7 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition"
                            >
                                Create Profile
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;