/*
  Site content that isn't written in the CMS.
  To rename a principle, change its title here. To open one up, give it
  status "open" and an href to its page. "preview" picks the little picture
  on its file (see PREVIEW in js/folder.js).
*/
window.KE_DATA = {
  folders: [
    {
      id: "product-design",
      name: "Product Design & Philosophy",
      zip: "Product_Design_and_Philosophy.zip",
      path: "product-design/"
    },
    {
      id: "p3mo",
      name: "P3MO",
      zip: "P3MO.zip",
      path: "p3mo/"
    }
  ],

  /* Inside Product Design & Philosophy: two plain folders */
  design: [
    { id: "products", name: "Products", path: "products/", note: "Things I’ve designed and built" },
    { id: "philosophy", name: "Design Philosophy", path: "philosophy/", note: "Principles, each with a prototype" }
  ],

  /* My products, each with a live preview */
  products: [
    { slug: "meeqly", title: "Meeqly", area: "Music · Mobile app", status: "open", href: "meeqly/", live: "meeqly", note: "Live preview" },
    { slug: "duttiva", title: "Duttiva", area: "AI assistant · Desktop", status: "open", href: "duttiva/", thumb: "assets/previews/duttiva.jpg", note: "Live preview", wide: true },
    { slug: "tiqki", title: "Tiqki", area: "Queues · Web app", status: "open", href: "tiqki/", thumb: "assets/previews/tiqki.jpg", note: "Live preview", wide: true }
  ],

  principles: [
    { slug: "activation", title: "A sign-up is not activation", area: "Onboarding", preview: "activation", status: "open", href: "activation/", thumb: "assets/previews/activation.jpg" },
    { slug: "show-the-full-price", title: "Show the full price before the last step", area: "Ecommerce", preview: "checkout", status: "open", href: "show-the-full-price/", thumb: "assets/previews/show-the-full-price.jpg" },
    { slug: "make-leaving-easy", title: "Make leaving easy, and listen on the way out", area: "Subscriptions", preview: "cancel", status: "open", href: "make-leaving-easy/", thumb: "assets/previews/make-leaving-easy.jpg" },
    { slug: "upsell-after-success", title: "Upsell after success, not on a schedule", area: "Expansion", preview: "upsell", status: "open", href: "upsell-after-success/", thumb: "assets/previews/upsell-after-success.jpg" },
    { slug: "where-is-my-money", title: "Tell people exactly where their money is", area: "Payments", preview: "status", status: "open", href: "where-is-my-money/", thumb: "assets/previews/where-is-my-money.jpg" },
    { slug: "explain-every-step", title: "Explain why you need each step", area: "Verification", preview: "kyc", status: "open", href: "explain-every-step/", thumb: "assets/previews/explain-every-step.jpg" }
  ],

/* P3MO: three folders, each with working files */
  p3m: [
    {"id": "portfolio", "name": "Portfolio", "path": "portfolio/", "note": "How work is chosen and tracked"},
    {"id": "programmes", "name": "Programmes", "path": "programmes/", "note": "How related work is run together"},
    {"id": "projects", "name": "Projects", "path": "projects/", "note": "How a single project is delivered"}
  ],

  portfolio: [
    {"slug": "operations-centre", "title": "Operations centre", "area": "Dashboard", "status": "open", "href": "operations-centre/", "thumb": "assets/previews/p3m-operations-centre.jpg", "note": "Open file", "wide": true},
    {"slug": "what-counts-as-an-update", "title": "What counts as an update", "area": "Pipeline rules", "status": "open", "href": "what-counts-as-an-update/", "thumb": "assets/previews/p3m-what-counts-as-an-update.jpg", "note": "Open file"},
    {"slug": "choosing-what-to-fund", "title": "Choosing what to fund", "area": "Prioritisation", "status": "open", "href": "choosing-what-to-fund/", "thumb": "assets/previews/p3m-choosing-what-to-fund.jpg", "note": "Open file"}
  ],

  programmes: [
    {"slug": "operating-rhythm", "title": "The operating rhythm", "area": "Governance", "status": "open", "href": "operating-rhythm/", "thumb": "assets/previews/p3m-operating-rhythm.jpg", "note": "Open file"},
    {"slug": "ninety-day-commitments", "title": "90-day commitments", "area": "Programme plan", "status": "open", "href": "ninety-day-commitments/", "thumb": "assets/previews/p3m-ninety-day-commitments.jpg", "note": "Open file"},
    {"slug": "who-does-what", "title": "Who does what", "area": "Roles", "status": "open", "href": "who-does-what/", "thumb": "assets/previews/p3m-who-does-what.jpg", "note": "Open file", "wide": true}
  ],

  projects: [
    {"slug": "status-report", "title": "One-page status report", "area": "Reporting", "status": "open", "href": "status-report/", "thumb": "assets/previews/p3m-status-report.jpg", "note": "Open file"},
    {"slug": "raid-log", "title": "RAID log", "area": "Risks and issues", "status": "open", "href": "raid-log/", "thumb": "assets/previews/p3m-raid-log.jpg", "note": "Open file"},
    {"slug": "after-action-review", "title": "After action review", "area": "Client meetings", "status": "open", "href": "after-action-review/", "thumb": "assets/previews/p3m-after-action-review.jpg", "note": "Open file"}
  ]
};
