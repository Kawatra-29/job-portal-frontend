export default function ProfileCard(userData) {
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
  );
}
