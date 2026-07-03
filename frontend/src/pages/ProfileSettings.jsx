import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Edit2,
  GraduationCap,
  Link as LinkIcon,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  UserRound,
  Plus,
  X,
} from "lucide-react";
import SettingsShell from "../components/SettingsShell";
import { getProfile, updateProfile, uploadAvatar } from "../services/api";

const emptyEducation = { school: "", degree: "", startYear: "", endYear: "" };

const defaultProfile = {
  fullname: "User",
  email: "users@email.com",
  avatarUrl: "",
  phone: "+977 9800000000",
  location: "Kathmandu, Nepal",
  headline: "UI/UX Designer",
  summary:
    "UI/UX Designer with a passion for creating meaningful digital experiences.",
  skills: ["Figma", "UI Design", "Wireframing", "Prototyping", "User Research"],
  education: [
    {
      school: "Tribhuvan University",
      degree: "BSc in Computer Science",
      startYear: "2022",
      endYear: "2026",
    },
  ],
  links: {
    portfolio: "www.johndoe.com",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
  },
};

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState({ ...defaultProfile });
  const [avatarInputKey, setAvatarInputKey] = useState(0);
  const avatarFileRef = useRef(null);

  const initials = useMemo(() => {
    const name = profile.fullname || "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [profile.fullname]);

  const openEditor = () => {
    setDraft({
      ...profile,
      skillsText: (profile.skills || []).join(", "),
      education: profile.education?.length
        ? profile.education
        : [{ ...emptyEducation }],
    });
    setAvatarInputKey((prev) => prev + 1);
    setShowEditor(true);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        const user = response.data || {};

        const nextProfile = {
          fullname: user.fullname || defaultProfile.fullname,
          email: user.email || defaultProfile.email,
          avatarUrl: user.avatarUrl || "",
          phone: user.phone || defaultProfile.phone,
          location: user.location || defaultProfile.location,
          headline: user.headline || defaultProfile.headline,
          summary: user.summary || defaultProfile.summary,
          skills: user.skills?.length ? user.skills : defaultProfile.skills,
          education: user.education?.length
            ? user.education
            : defaultProfile.education,
          links: {
            portfolio: user.links?.portfolio || defaultProfile.links.portfolio,
            linkedin: user.links?.linkedin || defaultProfile.links.linkedin,
            github: user.links?.github || defaultProfile.links.github,
          },
        };

        setProfile(nextProfile);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, error]);

  const handleDraftChange = (event) => {
    const { name, value } = event.target;
    setDraft((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  const handleEducationChange = (index, field, value) => {
    setDraft((prev) => {
      const nextEducation = [...(prev.education || [])];
      nextEducation[index] = { ...nextEducation[index], [field]: value };
      return { ...prev, education: nextEducation };
    });
  };

  const addEducation = () => {
    setDraft((prev) => ({
      ...prev,
      education: [...(prev.education || []), { ...emptyEducation }],
    }));
  };

  const removeEducation = (index) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const readImageFile = (file, syncVisibleProfile = false) => {
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PNG, JPG, JPEG, and WEBP images are allowed.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setDraft((prev) => ({ ...prev, avatarUrl: result }));
        if (syncVisibleProfile) {
          setProfile((prev) => ({ ...prev, avatarUrl: result }));
        }
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file");
      setTimeout(() => setError(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");

    try {
      // Validate required fields
      if (!draft.fullname?.trim()) {
        setError("Full name is required");
        setSaving(false);
        return;
      }

      let avatarUrl = profile.avatarUrl; // Keep existing avatar by default

      // Handle new avatar upload first
      const hasNewAvatar =
        draft.avatarUrl && draft.avatarUrl.startsWith("data:");
      if (hasNewAvatar) {

        // Convert base64 to file and upload
        const base64Data = draft.avatarUrl;
        const mimeMatch = base64Data.match(/data:([^;]+)/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const extension = mimeType.split("/")[1] || "jpg";

        const base64Parts = base64Data.split(",");
        if (base64Parts.length >= 2) {
          const binaryString = atob(base64Parts[1]);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType });
          const file = new File([blob], `avatar.${extension}`, {
            type: mimeType,
          });

          try {
            const uploadResponse = await uploadAvatar(file);
            avatarUrl = uploadResponse.data?.avatarUrl || profile.avatarUrl;
          } catch (uploadError) {
            console.error("Avatar upload failed:", uploadError);
            setError(
              "Failed to upload avatar. Continuing with profile update...",
            );
            // Continue with profile update even if avatar upload fails
          }
        }
      }

      const payload = {
        fullname: draft.fullname.trim(),
        phone: draft.phone?.trim() || "",
        location: draft.location?.trim() || "",
        headline: draft.headline?.trim() || "",
        summary: draft.summary?.trim() || "",
        skills: (draft.skillsText || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .join(","),
        education: (draft.education || []).filter(
          (item) => item.school?.trim() || item.degree?.trim(),
        ),
        links: {
          portfolio: draft.links?.portfolio?.trim() || "",
          linkedin: draft.links?.linkedin?.trim() || "",
          github: draft.links?.github?.trim() || "",
        },
      };

      const response = await updateProfile(payload);

      const updatedUser = response.data?.user || response.data;

      if (updatedUser) {
        const nextProfile = {
          fullname: updatedUser.fullname || draft.fullname,
          email: updatedUser.email || profile.email,
          avatarUrl: avatarUrl || updatedUser.avatarUrl || profile.avatarUrl,
          phone: updatedUser.phone || "",
          location: updatedUser.location || "",
          headline: updatedUser.headline || "",
          summary: updatedUser.summary || "",
          skills: Array.isArray(updatedUser.skills) ? updatedUser.skills : [],
          education: Array.isArray(updatedUser.education)
            ? updatedUser.education
            : [],
          links: updatedUser.links || {
            portfolio: "",
            linkedin: "",
            github: "",
          },
        };


        setProfile(nextProfile);
        setShowEditor(false);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setShowSuccess(true);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile.";
      setError(errorMsg);
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const Card = ({ title, icon: Icon, onEdit, children }) => (
    <section className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-indigo-600" />
          <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      {children}
    </section>
  );

  return (
    <SettingsShell
      title="Account"
      subtitle="Update your profile information."
      showHeader={false}
    >
      <div className="mb-6 text-xs text-slate-500">
        <Link to="/settings" className="font-medium text-slate-700 hover:text-indigo-600 transition">Settings</Link>
        <span className="mx-1">›</span>
        <span className="text-indigo-600">Account</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Change Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Update your profile information.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[304px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-gradient-to-br from-white to-slate-50 text-3xl font-bold text-slate-400 shadow-inner">
                {profile.avatarUrl ? (
                  <img
                    src={`${profile.avatarUrl}${profile.avatarUrl.startsWith("http") ? `?t=${Date.now()}` : ""}`}
                    alt={profile.fullname}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Failed to load avatar:",
                        profile.avatarUrl,
                      );
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  initials || "U"
                )}
              </div>
              <input
                ref={avatarFileRef}
                key={avatarInputKey}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  readImageFile(event.target.files?.[0], true)
                }
              />
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md"
                aria-label="Upload profile photo"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <h2 className="text-[22px] font-bold text-slate-900">
              {profile.fullname}
            </h2>
            <p className="mt-1 text-sm font-medium text-indigo-600">
              {profile.headline}
            </p>

            <div className="mt-6 w-full space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Location
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Experience
                  </p>
                  <p className="text-sm font-medium text-slate-900">Fresher</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Bio
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    {profile.summary}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openEditor}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
            >
              Update Profile
            </button>
          </div>
        </aside>

        <div className="space-y-5">
          <Card title="Skills" icon={LinkIcon} onEdit={openEditor}>
            <div className="flex flex-wrap gap-2.5">
              {(profile.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card title="Education" icon={GraduationCap} onEdit={openEditor}>
            <div className="rounded-2xl border border-slate-200 bg-indigo-50/40 p-4">
              {(profile.education || []).map((item, index) => (
                <div
                  key={index}
                  className={
                    index > 0 ? "mt-4 border-t border-slate-200 pt-4" : ""
                  }
                >
                  <p className="text-sm font-bold text-slate-900">
                    {item.degree || "Education"}
                  </p>
                  <p className="text-sm text-slate-600">{item.school}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.startYear || ""}
                    {item.endYear ? ` - ${item.endYear}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Links" icon={LinkIcon} onEdit={openEditor}>
            <div className="grid gap-3 sm:grid-cols-2">
              <LinkTile label="Portfolio" value={profile.links?.portfolio} />
              <LinkTile label="LinkedIn" value={profile.links?.linkedin} />
              <LinkTile label="GitHub" value={profile.links?.github} />
            </div>
          </Card>
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-8">
          <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Profile
                </h3>
                <p className="text-sm text-slate-500">
                  Update the same profile details from the dashboard view.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-2">
              <div className="space-y-4 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </span>
                  <input
                    name="fullname"
                    value={draft.fullname}
                    onChange={handleDraftChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Headline
                  </span>
                  <input
                    name="headline"
                    value={draft.headline}
                    onChange={handleDraftChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Profile Picture
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-400">
                      {draft.avatarUrl ? (
                        <img
                          src={draft.avatarUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials || "U"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Upload profile photo
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, JPEG, WEBP
                      </p>
                    </div>
                    <label className="cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-semibold text-indigo-600 ring-1 ring-slate-200">
                      Choose
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          readImageFile(event.target.files?.[0], true)
                        }
                      />
                    </label>
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </span>
                  <input
                    name="phone"
                    value={draft.phone}
                    onChange={handleDraftChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </span>
                  <input
                    name="location"
                    value={draft.location}
                    onChange={handleDraftChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Summary
                  </span>
                  <textarea
                    name="summary"
                    rows={4}
                    value={draft.summary}
                    onChange={handleDraftChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                  />
                </label>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Skills</h4>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          skillsText: prev.skillsText
                            ? `${prev.skillsText}, `
                            : "",
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={draft.skillsText || ""}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        skillsText: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                    placeholder="Figma, UI Design, Wireframing"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      Education
                    </h4>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(draft.education || []).map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            value={item.school}
                            onChange={(event) =>
                              handleEducationChange(
                                index,
                                "school",
                                event.target.value,
                              )
                            }
                            placeholder="School"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                          />
                          <input
                            value={item.degree}
                            onChange={(event) =>
                              handleEducationChange(
                                index,
                                "degree",
                                event.target.value,
                              )
                            }
                            placeholder="Degree"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                          />
                          <input
                            value={item.startYear}
                            onChange={(event) =>
                              handleEducationChange(
                                index,
                                "startYear",
                                event.target.value,
                              )
                            }
                            placeholder="Start year"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                          />
                          <div className="flex gap-2">
                            <input
                              value={item.endYear}
                              onChange={(event) =>
                                handleEducationChange(
                                  index,
                                  "endYear",
                                  event.target.value,
                                )
                              }
                              placeholder="End year"
                              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                            />
                            {(draft.education || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEducation(index)}
                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 text-rose-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-bold text-slate-900">
                    Links
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      value={draft.links?.portfolio || ""}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          links: {
                            ...(prev.links || {}),
                            portfolio: event.target.value,
                          },
                        }))
                      }
                      placeholder="Portfolio"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                    />
                    <input
                      value={draft.links?.linkedin || ""}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          links: {
                            ...(prev.links || {}),
                            linkedin: event.target.value,
                          },
                        }))
                      }
                      placeholder="LinkedIn"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                    />
                    <input
                      value={draft.links?.github || ""}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          links: {
                            ...(prev.links || {}),
                            github: event.target.value,
                          },
                        }))
                      }
                      placeholder="GitHub"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              Profile Updated
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Your profile information has been updated successfully.
            </p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
          {error}
        </div>
      )}
    </SettingsShell>
  );
}

function LinkTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-100 p-2 text-slate-500">
          <LinkIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="truncate text-sm font-medium text-slate-900">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
