# STRIDE Job Portal — Backend API Integration Map

This document establishes the verified contract between the Stride Frontend and the deployed Spring Boot backend.

- **Base URL:** `https://stride-backend-2001.up.railway.app/api/v1`
- **Swagger Documentation:** `https://stride-backend-2001.up.railway.app/swagger-ui/index.html`
- **OpenAPI Specification:** `https://stride-backend-2001.up.railway.app/v3/api-docs`

---

## 1. Authentication & Account Management (`auth-controller`)

| Endpoint | Method | Role Required | Request Body / Query Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Public | `{ email, password }` | `AuthResponseDto`: `{ token, role, authStatus }` | User login (`AuthPage.jsx`). Sets JWT in localStorage. |
| `/auth/sign-up` | `POST` | Public | `{ fname, email, password, role, phone? }` | `AuthResponseDto` | User registration (`AuthPage.jsx`). Valid roles: `JOBSEEKER`, `EMPLOYER`, `ADMIN`. |
| `/auth/verify-otp` | `POST` | Public | Query params: `email`, `otp` | `AuthResponseDto` | Email OTP verification flow (`AuthPage.jsx`). |
| `/auth/resend-otp` | `POST` | Public | Query param: `email` | `AuthResponseDto` | Resend verification OTP code (`AuthPage.jsx`). |
| `/auth/forgot-password` | `POST` | Public | Query param: `email` | `AuthResponseDto` | Forgot password triggers OTP email. |
| `/auth/reset-password` | `POST` | Public | `{ email, otp, newPassword }` | `AuthResponseDto` | Set new password with OTP. |
| `/auth/logout` | `POST` | Bearer Token | `{}` | `AuthResponseDto` | Clear session & token on server and client. |

---

## 2. Current User & Profile Management (`user-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/users/me` | `GET` | Authenticated | None | `UserResponseDTO`: `{ id, fname, email, role, phone, createdAt, updatedAt }` | Auth initialization, session check, User Profile. |
| `/users/me` | `PUT` | Authenticated | `UserUpdateRequestDto`: `{ fname, phone }` | `UserResponseDTO` | Profile editing (`EditProfile.jsx`). |
| `/users/me` | `DELETE` | Authenticated | None | `string` | Account deletion / deactivation with confirmation modal. |
| `/users/password` | `PUT` | Authenticated | `PasswordRequestDto`: `{ oldPassword, newPassword }` | `object` | Change password modal / settings. |

---

## 3. Job Seeker Profile, Skills & Resume (`job-seeker-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/jobseekers/me` | `GET` | `JOBSEEKER` | None | `JobSeekerResponseDTO`: `{ id, resumeUrl, bio, experienceYears, skills: [] }` | Job Seeker dashboard & profile display. |
| `/jobseekers/me` | `PUT` | `JOBSEEKER` | `JobSeekerDto`: `{ bio, experienceYears }` | `JobSeekerResponseDTO` | Update bio & experience years in profile. |
| `/jobseekers/me/skills` | `GET` | `JOBSEEKER` | None | `SkillResponseDto[]`: `[{ id, name }]` | Load current user's attached skills. |
| `/jobseekers/me/skills` | `POST` | `JOBSEEKER` | Query param: `request` (skill name string) | `object` | Add skill to user profile. |
| `/jobseekers/me/skills/{skillId}` | `DELETE` | `JOBSEEKER` | Path param: `skillId` | `object` | Remove skill from user profile. |
| `/jobseekers/me/resume` | `POST` | `JOBSEEKER` | `multipart/form-data`: `file` (binary PDF/DOC) | `object`: `{ resumeUrl: "..." }` | Resume upload with live preview / download link. |

---

## 4. Skills Catalog (`skill-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/skills` | `GET` | Public | None | `Array`: list of available platform skills | Autocomplete dropdowns for job filters, candidate profile skill tags. |

---

## 5. Jobs Discovery & Employer Job Management (`job-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/jobs` | `GET` | Public | Query: `page` (int, default 0), `size` (int, default 10), `title` (str), `location` (str), `jobType` (FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP, TEMPORARY), `workMode` (ONSITE, REMOTE, HYBRID), `status` (OPEN, CLOSED, PAUSED, FILLED) | `JobResponseDto[]` | Public Homepage search, Job Discovery (`JobList.jsx`) with live filtering, pagination, and debounce. |
| `/jobs/{id}` | `GET` | Public | Path: `id` | `JobResponseDto`: `{ id, title, description, location, jobType, workMode, status, experienceLevel, salaryMin, salaryMax, currency, deadline, companyName, isVerified, viewsCount }` | Dedicated Job Details modal & standalone shareable job page. |
| `/jobs` | `POST` | `EMPLOYER` | `JobRequestDto`: `{ title, description, location, jobType, workMode, experienceLevel, salaryMin, salaryMax, currency, deadline }` | `JobResponseDto` | Post new vacancy form (`PostJob.jsx`). |
| `/jobs/{id}` | `PUT` | `EMPLOYER` | Path: `id`, Body: `JobRequestDto` | `object` | Edit existing job posting. |
| `/jobs/{id}` | `DELETE` | `EMPLOYER` | Path: `id` | `object` | Delete job posting. |
| `/jobs/{id}/status` | `PATCH` | `EMPLOYER` | Path: `id`, Query: `status` (`OPEN`, `CLOSED`, `PAUSED`, `FILLED`) | `object` | Instant status toggle (Open/Pause/Close) from Employer My Jobs dashboard. |

---

## 6. Applications Workflow (`application-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/applications/{jobId}/apply` | `POST` | `JOBSEEKER` | Path: `jobId` | `ApplicationResponseDto` | One-click apply from Job Card or Job Detail view. Prevents duplicate applications with handled 400 responses. |
| `/applications/my` | `GET` | `JOBSEEKER` | None | `MyApplicationResponseDto[]`: `[{ id, job: JobResponseDto, status, appliedAt }]` | Job Seeker's "My Applications" tracking page with status badges (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `REJECTED`, `HIRED`, `ACCEPTED`). |
| `/applications/{id}` | `DELETE` | `JOBSEEKER` | Path: `id` | `object` | Candidate can withdraw pending application with confirmation. |
| `/applications/{id}/status` | `PATCH` | `EMPLOYER` | Path: `id`, Query: `status` (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `REJECTED`, `HIRED`, `ACCEPTED`) | `object` | Employer candidate pipeline: move candidate stage, schedule interview, accept, or reject. |

---

## 7. Employer Portal & Applicants (`employer-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/employer/me` | `GET` | `EMPLOYER` | None | `EmployerSummaryDto`: `{ id, companyName, companySize, description, isVerified }` | Employer Profile & Company Details overview. |
| `/employer/me` | `PUT` | `EMPLOYER` | `EmployerRequestDto`: `{ companyName, companySize, description }` | `EmployerSummaryDto` | Update company profile details (`CompanyProfile.jsx`). |
| `/employer/jobs` | `GET` | `EMPLOYER` | None | `JobResponseDto[]` | Employer's posted jobs listing (`MyJobs.jsx`). |
| `/employer/all-applications` | `GET` | `EMPLOYER` | None | `ApplicationResponseDto[]` | Unified pipeline of all applicants across all posted jobs (`AllApplicants.jsx`). |
| `/employer/jobs/{jobId}/applications` | `GET` | `EMPLOYER` | Path: `jobId` | `ApplicationResponseDto[]` | Specific job applicant list. |

---

## 8. Administration (`admin-controller`)

| Endpoint | Method | Role Required | Request / Params | Response Type | Frontend Feature / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/admin/users` | `GET` | `ADMIN` | Query: `page`, `size` | `PageUserResponseDTO`: `{ content: UserResponseDTO[], totalPages, totalElements }` | Admin user directory table with role badge, pagination, and search. |
| `/admin/users/{email}` | `DELETE` | `ADMIN` | Path: `email` | `object` | Admin deactivate/delete user account. |
| `/admin/employers/{id}/verify` | `POST` | `ADMIN` | Path: `id` | `object` | Admin verify company credibility badge. |

---

## 9. Feature & Limitation Analysis (Backend Scope)

### Currently Available in Backend
1. Full JWT authentication with Email Verification & Password Reset OTP workflows.
2. Distinct roles: `JOBSEEKER`, `EMPLOYER`, `ADMIN`.
3. Candidate bio, experience years, skills catalog, and file resume upload.
4. Rich job filtering by title, location, jobType, and workMode.
5. End-to-end recruitment lifecycle: Apply -> Shortlist -> Interview -> Hired/Rejected.
6. Employer status toggling for jobs (`OPEN`, `CLOSED`, `PAUSED`, `FILLED`).
7. Admin user management and company verification endpoints.

### Backend Limitations / Unsupported Features
1. **Saved Jobs Bookmarks:** The backend currently does not provide `/jobseekers/saved-jobs` endpoint.
   * *Frontend Solution:* Implement local client bookmarking (saved to `localStorage`) with clear note, without fabricating fake backend endpoints.
2. **Company Logo Uploads:** Backend `EmployerSummaryDto` does not have a dedicated image upload endpoint for company logos.
   * *Frontend Solution:* Generate deterministic, tasteful corporate monogram badges based on company initials and verified status.
3. **Company Directory Search Endpoint:** There is no distinct `/companies` public search endpoint; company info is derived from job postings and employer profiles.
   * *Frontend Solution:* Aggregate active hiring companies dynamically from `/jobs` with real stats and listings.
4. **Salary Filtering via Query Parameter:** Backend `/jobs` GET query parameters accept `title`, `location`, `jobType`, `workMode`, `status`, `page`, and `size`, but not direct `minSalary` query filters.
   * *Frontend Solution:* Perform client-side refinement over retrieved job pages or apply backend-supported filters natively.
