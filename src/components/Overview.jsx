import ProfileCard from "./ProfileCard";
import SkillsSection from "./SkillsSection";

const Overview = ({
    profile,
    user,
    skillsOffered,
    skillsWanted,
    setSkillsOffered,
    setSkillsWanted,
    activeTrades,
}) => {
    return (
        <div className="space-y-8">

            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    { label: "Skills offered", value: skillsOffered.length },
                    { label: "Skills wanted", value: skillsWanted.length },
                    { label: "Active trades", value: activeTrades || 0 },
                ].map((s) => (
                    <div key={s.label} className="bg-white border border-(--green-100) rounded-2xl p-6">
                        <p className="text-2xl font-(--font-display) text-(--green-900)">
                            {s.value}
                        </p>
                        <p className="text-xs uppercase text-(--green-400)">
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>

            <ProfileCard profile={profile} user={user} />

            <div className="grid md:grid-cols-2 gap-6">
                <SkillsSection
                    title="Skills I offer"
                    skills={skillsOffered}
                    setSkills={setSkillsOffered}
                    type="skillsOffered"
                />
                <SkillsSection
                    title="Skills I want"
                    skills={skillsWanted}
                    setSkills={setSkillsWanted}
                    type="skillsWanted"
                />
            </div>
        </div>
    );
};

export default Overview;