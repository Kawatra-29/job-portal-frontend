import { useEffect, useState } from "react";

export default function UserProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    headline: "",
    summary: "",
    location: "",
    yearsOfExperience: 0,
    expectedSalary: 0,
    availability: "",
    skills: [
      {
        skillName: "",
        proficiencyLevel: "",
      },
    ],
  });

  useEffect(() => {
    setUserData({
      name: "SAURABH KAWATRA",
      email: "Saurabhkawatra2001@gmail.com",
      phone: "9876543210",
      role: "JOBSEEKER",
      headline: "Java Backend Developer Fresher",
      summary:
        "Passionate backend developer with strong knowledge of Java, Spring Boot, and REST APIs.",
      location: "Delhi",
      yearsOfExperience: 2,
      expectedSalary: 400000,
      availability: "Immediate",
      skills: [
        {
          skillName: "Java",
          proficiencyLevel: "INTERMEDIATE",
        },
        {
          skillName: "Spring Boot",
          proficiencyLevel: "BEGINNER",
        },
      ],
    });
  }, []);

  const profileFields = [
    { label: "Full name", value: userData.name },
    { label: "Email", value: userData.email },
    { label: "Phone", value: userData.phone },
    { label: "Role", value: userData.role },
    { label: "Headline", value: userData.headline },
    { label: "Summary", value: userData.summary },
    { label: "Location", value: userData.location },
    { label: "Years of Experience", value: userData.yearsOfExperience },
    { label: "Expected Salary", value: userData.expectedSalary },
    { label: "Availability", value: userData.availability },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-900 px-8 py-10 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
              JobSeeker account
            </p>
            <h1 className="mt-3 text-3xl font-bold">{userData.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Manage your profile information and preferences.
            </p>
          </div>

          <div className="grid gap-4 px-8 py-8 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  {field.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {field.value || "Not provided"}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 px-8 py-5 text-sm text-slate-500">
            Keep your contact details updated so recruiters can reach you.
          </div>
        </div>
      </div>
    </div>
  );
}
