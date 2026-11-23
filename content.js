/* =====================================================================
   CONTENT FILE: this is the only file you need to edit.

   HOW IT WORKS
   - Replace the text between the quotes "like this".
   - Anything that starts with  ✎  is a placeholder. It shows on the site as a
     dashed box so you can spot what is left to fill in. Delete the ✎ and write
     your own words. Use Ctrl+F (or Cmd+F) and search for  ✎  to find the rest.
   - Nothing is compulsory. Leave a field as "" (or [] for lists) and it simply
     will not appear. Delete a whole entry { ... } to remove it. Copy an entry
     (from the { to the matching }, plus its comma) to add another.
   - Keep the quote marks and commas. If the site goes blank, a quote or comma
     is probably missing: look at the line the browser console mentions.
   - Pictures: put the file in the images folder, then write its path, e.g.
     "images/eoin-1.jpg". Files you want people to download (CV, slides)
     go in the files folder, e.g. "files/eoin-slides.pdf".
   ===================================================================== */

window.SITE = {

  /* ---------- BASICS ---------- */
  first: "Halim",
  last: "Adam",
  role: "Immersive Software Engineering student at the University of Limerick",
  lede: "First-year student who likes problems with a measurable answer, from CPU caches to snooker shots.",
  photo: "",                         // e.g. "images/photo.jpg"  (leave "" to show the photo frame placeholder)
  photoAlt: "Portrait of Halim Adam",
  linkedin: "https://www.linkedin.com/in/halim-adam-swe",   // required by the assignment
  github: "https://github.com/halimadam",
  email: "✎ add a professional email address",
  cv: "",                            // e.g. "files/halim-adam-cv.pdf"  (see HOW-TO-EDIT.md about phone numbers)

  /* ---------- ABOUT ME (homepage) ---------- */
  about: {
    title: "About me",
    bio: [
      "I'm a first-year Immersive Software Engineering student at the University of Limerick with a strong maths foundation (578 Leaving Cert points, H1 in Applied Maths), building in Java and C.",
      "I'm analytical, disciplined and competitive. I placed in two regional IMTA maths quizzes, scored 93% in a modelling project, and I'm now building a robot for a Robocode competition. I'm a reliable team member who takes ownership of the work.",
      "✎ Add a short paragraph on what kind of software professional you want to become and how you want to come across to employers."
    ],
    keySkills: ["Java", "Python", "C", "Git and GitHub", "GitHub Actions", "AWS CDK", "Astro"],
    careerInterests: [
      "✎ A field or type of work you want to explore",
      "✎ Another interest, e.g. the kind of residency you hope for"
    ]
  },

  /* ---------- LEARN MORE (values and strengths) ---------- */
  learn: {
    title: "Learn more",
    intro: "✎ A short introduction to who you are as a professional: your strengths and what drives you.",
    strengths: [
      { name: "Analytical", note: "✎ A moment where this showed up (e.g. the snooker modelling project)." },
      { name: "Disciplined", note: "✎ An example." },
      { name: "Takes ownership", note: "✎ An example." }
    ],
    values: [
      {
        name: "✎ Value 1",
        why: "✎ Why does this value matter to you?",
        how: "✎ How does it shape the way you work with others?",
        example: "✎ An example that shows it, and how it links to your career goals."
      },
      {
        name: "✎ Value 2",
        why: "✎ Why does this value matter to you?",
        how: "✎ How does it shape the way you work with others?",
        example: "✎ An example."
      },
      {
        name: "✎ Value 3",
        why: "✎ Why does this value matter to you?",
        how: "✎ How does it shape the way you work with others?",
        example: "✎ An example."
      }
    ],
    /* Evidence from your CV that could back up the values above. Edit or delete. */
    evidence: [
      { title: "IMTA regional maths quizzes", text: "Placed 2nd (Junior Cert, top four in my class) and 3rd (Leaving Cert) as part of a school team, and won trophies and badges. It taught me teamwork under time pressure." },
      { title: "Hardware Analysis Tool", text: "A team Java project where I built the memory hierarchy explorer. ✎ What did you learn about working in a team?" }
    ]
  },

  /* ---------- WHAT I KNOW (skills, education, experience) ---------- */
  know: {
    title: "What I know",
    skills: [
      { group: "Programming", items: ["Java", "Python", "C", "TypeScript"] },
      { group: "Tools and cloud", items: ["Git and GitHub", "GitHub Actions", "AWS CDK"] },
      { group: "Web and testing", items: ["Astro", "Vitest"] },
      { group: "Maths", items: ["Applied maths", "Mathematical modelling"] },
      { group: "Spoken languages", items: ["English", "French"] }
    ],
    education: [
      { title: "BSc/MSc Immersive Software Engineering", where: "University of Limerick", when: "Sep 2026 to present", note: "" },
      { title: "Leaving Certificate", where: "Mungret Community College", when: "Sep 2020 to Jun 2026", note: "578 points. Applied Maths H1." }
    ],
    experience: [
      { title: "Engineering placement (LCVP)", where: "Kirby Group Engineering", when: "Feb 2025", note: "One-week placement. Completed a short cybersecurity course set by the team." },
      { title: "Retail placement (Transition Year)", where: "Ryan's Raheen Centra", when: "Jan 2024", note: "One-week placement. Trusted on day one to serve customers at the till, and stocked shelves." }
    ],
    certificates: [
      { title: "LCETB Culinary Certificate", when: "Transition Year" }
    ]
  },

  /* ---------- PROJECTS ---------- */
  projects: {
    title: "Projects",
    intro: "",
    items: [
      {
        title: "Robocode robot",
        status: "In progress",
        date: "2026",
        context: "Class competition",
        summary: "Designing and tuning a robot's movement, targeting and strategy for a league and 1v1 playoffs.",
        tags: ["Java"],
        links: [],                   // e.g. [{ label: "Source code", url: "https://github.com/..." }]
        images: []                   // e.g. [{ src: "images/robot.png", alt: "The robot in a match", caption: "" }]
      },
      {
        title: "Hardware Analysis Tool",
        status: "",
        date: "Oct 2026",
        context: "Team project, Computer Organisation",
        summary: "A team Java program that reads a Linux machine's CPU, cache, memory, PCI and USB details into a report, with HTML export and an interactive menu.",
        mine: "I built the memory hierarchy explorer: stride and pointer-chase timing tests that measure CPU cache line size and cache sizes, checked against the values the OS reports.",
        tags: ["Java", "Git and GitHub"],
        links: [{ label: "Repository", url: "https://github.com/fionnmowlds07-a11y/CompOrg-project" }],
        images: []
      },
      {
        title: "Blog with a CI/CD pipeline",
        status: "",
        date: "Sep to Oct 2026",
        context: "CS4421 DevOps",
        summary: "A blog built and deployed through an automated GitHub Actions pipeline, with AWS infrastructure defined as code (CDK) and Vitest tests.",
        tags: ["Astro", "TypeScript", "GitHub Actions", "AWS CDK", "Vitest"],
        links: [{ label: "Repository", url: "https://github.com/halimadam/CS4421-Astro-Blog" }],
        images: []
      },
      {
        title: "Snooker shot modelling",
        status: "",
        date: "Mar 2026",
        context: "Leaving Cert Applied Maths, 93%",
        summary: "Modelled a snooker pot over four iterations using momentum, restitution and friction. Found the optimal impact angle (about 27°) and the minimum cue-ball speed (about 0.94 m/s).",
        tags: ["Applied maths", "Modelling"],
        links: [],
        images: []
      }
    ]
  },

  /* ---------- WHAT I LEARNED FROM OTHERS (talks and speakers) ----------
     The assignment asks for at least four. Each has your rough notes plus
     reflection prompts. Fill in the reflection boxes in your own words. */
  talks: {
    title: "What I learned from others",
    intro: "",
    items: [
      {
        title: "Career talk: from final-year project to funded startups",
        speaker: "Eoin O'Brien",
        speakerRole: "Founder of Tracworx and Stokka, ISE advisory board member",
        date: "✎ date",
        notes: [
          "Founded Tracworx with two others in his final year, and it doubled as his final year project.",
          "They provided software and tracking hardware, originally to help University Hospital Limerick with patient tracking.",
          "When Covid hit they pivoted: the same technology became distance-tracking software in wearable hardware. They received a lot of funding (Verizon, VC and others).",
          "Was later asked to join the ISE advisory board, and founded Stokka, a profitable ERP for inventory tracking and management that also received sizable funding.",
          "Advice on finding connections, capital funding, and being ambitious."
        ],
        keyMessage: "✎ What were the key messages?",
        surprise: "✎ What surprised you?",
        challenged: "✎ What challenged your thinking?",
        career: "✎ How might this influence your career decisions?",
        images: [],                  // e.g. [{ src: "images/eoin-1.jpg", alt: "Eoin speaking", caption: "" }]
        slides: "",                  // e.g. "files/eoin-slides.pdf"
        link: ""                     // e.g. a LinkedIn post or the speaker's website
      },
      {
        title: "ISE residency talk",
        speaker: "Third-year ISE students",
        speakerRole: "",
        date: "✎ date",
        notes: [
          "Advice from the third years on residency.",
          "Pfizer internship: a long application process.",
          "Provizio (radar).",
          "They have worked at different companies, and not all of them the same type.",
          "Talk to people to get promoted, and learn to work through both the work and the socialising."
        ],
        keyMessage: "✎ What were the key messages?",
        surprise: "✎ What surprised you?",
        challenged: "✎ What challenged your thinking?",
        career: "✎ How might this influence your career decisions?",
        images: [],
        slides: "",
        link: ""
      },
      {
        title: "Research talk",
        speaker: "✎ speaker name",
        speakerRole: "",
        date: "✎ date",
        notes: [
          "The speaker did arts in college, then computer science, then sustainability.",
          "They travelled around the world on Erasmus."
        ],
        keyMessage: "✎ What were the key messages?",
        surprise: "✎ What surprised you?",
        challenged: "✎ What challenged your thinking?",
        career: "✎ How might this influence your career decisions?",
        images: [],
        slides: "",
        link: ""
      },
      {
        title: "✎ Talk title",
        speaker: "George ✎ surname",
        speakerRole: "",
        date: "✎ date",
        notes: [
          "Surround yourself with people who will support you, not people who will drag you down.",
          "Ask: is it real, can you win, is it worth it?"
        ],
        keyMessage: "✎ What were the key messages?",
        surprise: "✎ What surprised you?",
        challenged: "✎ What challenged your thinking?",
        career: "✎ How might this influence your career decisions?",
        images: [],
        slides: "",
        link: ""
      }
    ]
  },

  /* ---------- ENGAGING WITH INDUSTRY (Career Connect, networking, employers) ---------- */
  industry: {
    title: "Engaging with industry",
    intro: "✎ Which events or activities are you reflecting on (e.g. Career Connect, a hackathon, an employer visit)?",
    items: [
      {
        title: "Career Connect",
        date: "✎ date",
        expectations: "✎ What did you expect before the event?",
        learned: "✎ What did you learn about employers and residency opportunities?",
        stoodOut: "✎ Which conversations or interactions stood out?",
        actions: "✎ What will you do as a result?",
        images: [],
        link: ""
      }
    ]
  },

  /* ---------- BEYOND THE CLASSROOM (volunteering, societies, community) ---------- */
  beyond: {
    title: "Beyond the classroom",
    intro: "",
    items: [
      {
        title: "✎ Activity name (society, volunteering, hackathon, mentoring...)",
        role: "✎ Your role",
        date: "✎ dates",
        contribution: "✎ What did you contribute?",
        impact: "✎ What was the impact on others?",
        growth: "✎ What was the impact on your own development?",
        skills: [],                  // e.g. ["Teamwork", "Leadership"]
        images: [],
        link: ""
      }
    ]
  },

  /* ---------- HOW I DEVELOPED THIS YEAR ---------- */
  year: {
    title: "How I developed this year",
    intro: "✎ A short overview of how you have grown this year.",
    /* The assignment requires evidence of both of these. */
    required: [
      { title: "Library Skills Programme", done: "✎ Completed on (date)", note: "✎ What did you take from it?", images: [] },
      { title: "Assignment Toolkit", done: "✎ Completed on (date)", note: "✎ What did you take from it?", images: [] }
    ],
    /* Each activity follows Situation, Learning, Application, Next step. */
    items: [
      {
        title: "Blog with a CI/CD pipeline (CS4421)",
        situation: "Built and deployed an Astro blog with an automated GitHub Actions pipeline and AWS infrastructure as code.",
        learning: "✎ What did you learn?",
        application: "✎ How have you applied, or how will you apply, it?",
        next: "✎ What development remains?",
        images: []
      },
      {
        title: "Hardware Analysis Tool (Computer Organisation)",
        situation: "Worked in a team to build a Java tool that reports on a Linux machine's hardware, and built the memory hierarchy explorer.",
        learning: "✎ What did you learn?",
        application: "✎ How have you applied, or how will you apply, it?",
        next: "✎ What development remains?",
        images: []
      },
      {
        title: "✎ Workshop, certification or training activity",
        situation: "✎ What was the activity?",
        learning: "✎ What did you learn?",
        application: "✎ How have you applied, or how will you apply, it?",
        next: "✎ What development remains?",
        images: []
      }
    ]
  },

  /* ---------- WHERE AM I GOING NEXT ---------- */
  next: {
    title: "Where I'm going next",
    intro: "✎ How has your professional identity changed this year, and what impression do you want employers to have of you?",
    /* 3 to 5 goals for the next 12 months. */
    goals: [
      { goal: "✎ Goal 1", why: "✎ Why it matters", actions: "✎ What you will do", target: "✎ target date" },
      { goal: "✎ Goal 2", why: "✎ Why it matters", actions: "✎ What you will do", target: "✎ target date" },
      { goal: "✎ Goal 3", why: "✎ Why it matters", actions: "✎ What you will do", target: "✎ target date" }
    ],
    /* 5 to 10 resources (books, podcasts, blogs, newsletters, learning platforms). */
    reading: [
      { title: "✎ Resource 1", by: "✎ author or host", type: "Book", note: "✎ One line on why it helps.", url: "" },
      { title: "✎ Resource 2", by: "", type: "Podcast", note: "✎ One line.", url: "" },
      { title: "✎ Resource 3", by: "", type: "Blog", note: "✎ One line.", url: "" },
      { title: "✎ Resource 4", by: "", type: "Newsletter", note: "✎ One line.", url: "" },
      { title: "✎ Resource 5", by: "", type: "Learning platform", note: "✎ One line.", url: "" }
    ]
  },

  /* ---------- HOBBIES ---------- */
  hobbies: {
    title: "Away from the keyboard",
    intro: "",
    items: [
      { name: "Basketball", note: "", images: [] },
      { name: "Table tennis", note: "", images: [] },
      { name: "Pool", note: "", images: [] },
      { name: "Reading", note: "", images: [] },
      { name: "Anime and manga", note: "", images: [] },
      { name: "Chess", note: "", images: [] }
    ]
  },

  /* ---------- CONTACT ---------- */
  contact: {
    title: "Get in touch",
    text: "The best way to reach me is on LinkedIn."
  },

  /* ---------- DECLARATIONS (required by the assignment) ----------
     Keep a record of every prompt and response you used with AI tools for the
     whole academic year. Staff may ask for them. */
  declaration: {
    aiTitle: "Declaration of Generative AI and AI-assisted technologies",
    aiTools: "Claude (Anthropic)",
    aiReason: "Used to generate the code and visual design of this website from my written specification. ✎ Add anything else you used AI for, for example checking your grammar. State clearly that the reflections are your own words, if that is true.",
    plagiarism: "I declare that this material, which I now submit for assessment, is entirely my own work and has not been taken from the work of others, save and to the extent that such work has been cited and acknowledged within the text. I understand that plagiarism, collusion, and copying are grave and serious offences in the university and accept the penalties that would be imposed should I engage in plagiarism, collusion or copying. I understand that any use of AI or AI-assisted tools must be declared fully. I have read and understood the Assignment Regulations set out in the module documentation. This assignment, or any part of it, has not been previously submitted by me or any other person for assessment on this or any other course of study.",
    signed: "Halim Adam",
    studentId: "✎ your student ID"
  }
};
