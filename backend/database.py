import os
from models import db, User, UserProfile, CompanyProfile, JobPosting, Application, Notification

def init_db(app):
    """Initialize database and populate seed data if empty."""
    db.init_app(app)
    with app.app_context():
        db.create_all()
        seed_data()

def seed_data():
    """Populate database with sample recruiters, job seekers, postings, applications, and notifications."""
    if User.query.first() is not None:
        return # Database already seeded

    print("Seeding sample data for Job Portal...")

    # 1. Create Recruiters & Companies
    r1 = User(username="techcorp_recruiter", email="recruiter@techcorp.io", role="recruiter")
    r1.set_password("password123")
    
    r2 = User(username="innovate_hr", email="jobs@innovatelabs.com", role="recruiter")
    r2.set_password("password123")
    
    r3 = User(username="cybersec_hiring", email="careers@cybersecure.org", role="recruiter")
    r3.set_password("password123")

    db.session.add_all([r1, r2, r3])
    db.session.commit()

    # Company Profiles
    c1 = CompanyProfile(
        user_id=r1.id,
        company_name="TechCorp AI",
        website="https://techcorp.io",
        location="San Francisco, CA (Remote)",
        description="Leading AI solutions provider empowering global enterprise workflows."
    )
    c2 = CompanyProfile(
        user_id=r2.id,
        company_name="Innovate Labs",
        website="https://innovatelabs.com",
        location="New York, NY",
        description="Next-generation SaaS platform for modern software development teams."
    )
    c3 = CompanyProfile(
        user_id=r3.id,
        company_name="CyberSecure Inc.",
        website="https://cybersecure.org",
        location="Austin, TX",
        description="Cutting-edge cybersecurity software protecting infrastructure worldwide."
    )
    db.session.add_all([c1, c2, c3])

    # 2. Create Job Seekers
    s1 = User(username="john_dev", email="john.doe@gmail.com", role="seeker")
    s1.set_password("password123")
    
    s2 = User(username="sarah_designer", email="sarah.smith@design.io", role="seeker")
    s2.set_password("password123")
    
    s3 = User(username="alex_data", email="alex.m@datascience.net", role="seeker")
    s3.set_password("password123")

    db.session.add_all([s1, s2, s3])
    db.session.commit()

    # Seeker Profiles
    p1 = UserProfile(
        user_id=s1.id,
        full_name="John Doe",
        phone="+1 (555) 234-5678",
        headline="Senior Full Stack Python/Flask Engineer",
        bio="Passionate developer with 5+ years of experience building scalable backend APIs and responsive Web applications.",
        skills="Python, Flask, React, PostgreSQL, Docker, REST APIs",
        location="San Francisco, CA",
        resume_filename="sample_resume_john_doe.pdf"
    )
    p2 = UserProfile(
        user_id=s2.id,
        full_name="Sarah Smith",
        phone="+1 (555) 987-6543",
        headline="Lead Product & UI/UX Designer",
        bio="UI/UX Specialist focused on user-centered design systems, responsive web design, and interactive web prototypes.",
        skills="Figma, UI/UX, HTML/CSS, Design Systems, Wireframing",
        location="New York, NY",
        resume_filename="sample_resume_sarah_smith.pdf"
    )
    p3 = UserProfile(
        user_id=s3.id,
        full_name="Alex Miller",
        phone="+1 (555) 456-7890",
        headline="Data Analyst & Machine Learning Engineer",
        bio="Experienced data analyst skilled in SQL, Pandas, ML pipelines, and interactive data dashboards.",
        skills="Python, SQL, Pandas, Scikit-learn, Tableau, PowerBI",
        location="Austin, TX",
        resume_filename="sample_resume_alex_miller.pdf"
    )
    db.session.add_all([p1, p2, p3])

    # 3. Create Job Postings
    j1 = JobPosting(
        recruiter_id=r1.id,
        title="Senior Backend Engineer (Python/Flask)",
        company_name="TechCorp AI",
        category="Engineering",
        location="Remote",
        job_type="Full-time",
        salary_range="$130,000 - $160,000 / year",
        description="We are looking for a Senior Backend Engineer to design, build, and scale our core Python and Flask web API architecture.",
        requirements="• 4+ years Python backend experience\n• Proficiency with Flask, SQLAlchemy, SQL databases\n• Experience with RESTful APIs and Microservices\n• Clean code principles & unit testing",
        skills_required="Python, Flask, SQL, REST API, Docker",
        status="Active"
    )
    j2 = JobPosting(
        recruiter_id=r1.id,
        title="Full Stack Web Developer",
        company_name="TechCorp AI",
        category="Engineering",
        location="San Francisco, CA",
        job_type="Full-time",
        salary_range="$120,000 - $145,000 / year",
        description="Join TechCorp AI as a Full Stack Web Developer. You will collaborate with design and product teams to craft seamless user experiences.",
        requirements="• HTML5, CSS3, JavaScript ES6+\n• Experience with Flask or Node.js backend frameworks\n• Knowledge of database management and responsive layouts",
        skills_required="JavaScript, Python, HTML/CSS, Flask, Git",
        status="Active"
    )
    j3 = JobPosting(
        recruiter_id=r2.id,
        title="UI/UX Product Designer",
        company_name="Innovate Labs",
        category="Design",
        location="New York, NY (Hybrid)",
        job_type="Full-time",
        salary_range="$110,000 - $135,000 / year",
        description="Innovate Labs is seeking a UI/UX Designer to build beautiful, intuitive, and modern web application interfaces for our SaaS platform.",
        requirements="• Strong portfolio showcasing web and mobile UI design\n• Mastery of Figma, Adobe XD, and interactive prototyping\n• Understanding of frontend HTML/CSS capabilities",
        skills_required="Figma, UI Design, Wireframing, UX Research",
        status="Active"
    )
    j4 = JobPosting(
        recruiter_id=r3.id,
        title="Cybersecurity Analyst & Systems Admin",
        company_name="CyberSecure Inc.",
        category="Security",
        location="Austin, TX",
        job_type="Contract",
        salary_range="$90 - $115 / hour",
        description="Looking for an experienced Security Analyst to conduct security audits, vulnerability scans, and manage access controls.",
        requirements="• Experience with cloud security & IAM policies\n• Proficiency with Linux server administration & shell scripting\n• CISSP or CEH certifications preferred",
        skills_required="Cybersecurity, Linux, Bash, Network Security",
        status="Active"
    )
    j5 = JobPosting(
        recruiter_id=r2.id,
        title="Data Analyst & BI Specialist",
        company_name="Innovate Labs",
        category="Data Science",
        location="Remote",
        job_type="Remote",
        salary_range="$95,000 - $115,000 / year",
        description="Analyze complex datasets, build executive dashboards, and derive actionable growth insights for product teams.",
        requirements="• Strong SQL query optimization skills\n• Experience with Python (Pandas/NumPy) or R\n• Experience with data visualization tools (Tableau, PowerBI)",
        skills_required="SQL, Python, Data Analytics, Tableau",
        status="Active"
    )

    db.session.add_all([j1, j2, j3, j4, j5])
    db.session.commit()

    # 4. Create Sample Applications
    app1 = Application(
        job_id=j1.id,
        seeker_id=s1.id,
        resume_filename="sample_resume_john_doe.pdf",
        cover_letter="Dear Hiring Manager,\n\nI am excited to apply for the Senior Backend Engineer role at TechCorp AI. With over 5 years of experience developing Flask applications and microservices, I am confident I can make an immediate impact on your engineering team.\n\nBest regards,\nJohn Doe",
        status="Interview Scheduled",
        recruiter_notes="Technical Round 1 focused on Python backend architecture, Flask REST APIs, and database design.",
        interview_date="Aug 20, 2026 at 03:00 PM PST",
        interview_link="https://meet.google.com/abc-defg-hij"
    )
    app2 = Application(
        job_id=j3.id,
        seeker_id=s2.id,
        resume_filename="sample_resume_sarah_smith.pdf",
        cover_letter="Hi Innovate Labs Team,\n\nI love your product design aesthetic and would be thrilled to join as your UI/UX Product Designer. My attached portfolio highlights design systems I created for SaaS products.\n\nSincerely,\nSarah Smith",
        status="Under Review",
        recruiter_notes="Impressive portfolio. Need to review with design lead."
    )
    app3 = Application(
        job_id=j5.id,
        seeker_id=s3.id,
        resume_filename="sample_resume_alex_miller.pdf",
        cover_letter="Hello,\n\nI am applying for the Data Analyst role. I have extensive experience writing optimized SQL queries and building automated data pipelines.",
        status="Pending",
        recruiter_notes=""
    )

    db.session.add_all([app1, app2, app3])
    db.session.commit()

    # 5. Create Sample Notifications
    n1 = Notification(
        user_id=s1.id,
        message="TechCorp AI scheduled an interview for Senior Backend Engineer (Python/Flask)!",
        link="/seeker/dashboard",
        is_read=False
    )
    n2 = Notification(
        user_id=r1.id,
        message="John Doe submitted a new application for Senior Backend Engineer (Python/Flask).",
        link=f"/recruiter/job/{j1.id}/applications",
        is_read=False
    )
    db.session.add_all([n1, n2])
    db.session.commit()

    # Create dummy sample resumes in upload directory
    upload_dir = os.path.join(os.path.dirname(__file__), 'static', 'uploads', 'resumes')
    os.makedirs(upload_dir, exist_ok=True)
    
    sample_files = [
        ("sample_resume_john_doe.pdf", "JOHN DOE - RESUME\nSenior Backend Engineer\nSkills: Python, Flask, SQL, Docker\nExperience: 5 Years"),
        ("sample_resume_sarah_smith.pdf", "SARAH SMITH - RESUME\nUI/UX Designer\nSkills: Figma, Design Systems, HTML/CSS\nExperience: 4 Years"),
        ("sample_resume_alex_miller.pdf", "ALEX MILLER - RESUME\nData Analyst\nSkills: Python, SQL, Pandas, Tableau\nExperience: 3 Years")
    ]
    for filename, content in sample_files:
        filepath = os.path.join(upload_dir, filename)
        if not os.path.exists(filepath):
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)

    print("Sample data successfully seeded!")
