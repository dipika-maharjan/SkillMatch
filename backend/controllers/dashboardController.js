const getDashboardData = async (req, res) => {
  return res.json({
    user: {
      fullname: req.user.fullname,
      email: req.user.email,
      role: req.user.role,
    },
    stats: {
      resumeScore: 85,
      applications: 12,
      recommendations: 3,
      savedJobs: 8,
    },
    applications: [
      { role: "UI/UX Designer", company: "DesignHub", status: "Applied" },
      { role: "Product Designer", company: "Tech Pvt. Ltd", status: "Interview" },
      { role: "Frontend Developer", company: "Techno Company", status: "Saved" },
    ],
    recommendations: [
      {
        role: "UI/UX Designer",
        company: "DesignHub",
        location: "Lalitpur, Nepal",
        match: 90,
      },
      {
        role: "Product Designer",
        company: "Tech Pvt. Ltd",
        location: "Kathmandu, Nepal",
        match: 88,
      },
      {
        role: "Frontend Developer",
        company: "Techno Company",
        location: "Biratnagar, Nepal",
        match: 84,
      },
    ],
    skills: [
      { skill: "Figma", percentage: 75 },
      { skill: "Prototyping", percentage: 80 },
      { skill: "UX Design", percentage: 70 },
      { skill: "Web Development", percentage: 80 },
    ],
    resume: {
      fileName: "User_Resume.pdf",
      score: 85,
    },
  });
};

export { getDashboardData };
