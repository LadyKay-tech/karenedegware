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

  principles: [
    { slug: "activation", title: "A sign-up is not activation", area: "Onboarding", preview: "activation", status: "open", href: "activation/" },
    { slug: "show-the-full-price", title: "Show the full price before the last step", area: "Ecommerce", preview: "checkout", status: "soon" },
    { slug: "worth-the-interruption", title: "A notification should be worth the interruption", area: "Notifications", preview: "notify", status: "soon" },
    { slug: "reward-real-progress", title: "Reward real progress, not empty points", area: "Retention", preview: "savings", status: "soon" },
    { slug: "make-leaving-easy", title: "Make leaving easy, and listen on the way out", area: "Subscriptions", preview: "cancel", status: "soon" },
    { slug: "upsell-after-success", title: "Upsell after success, not on a schedule", area: "Expansion", preview: "upsell", status: "soon" },
    { slug: "defaults-are-decisions", title: "Defaults are decisions you make for people", area: "Checkout", preview: "defaults", status: "soon" },
    { slug: "where-is-my-money", title: "Tell people exactly where their money is", area: "Payments", preview: "status", status: "soon" },
    { slug: "explain-every-step", title: "Explain why you need each step", area: "Verification", preview: "kyc", status: "soon" },
    { slug: "let-people-correct-you", title: "Let people correct what you think you know", area: "Personalisation", preview: "recs", status: "soon" }
  ],

  p3mo: [
    { type: "note", lead: true, text: "Every metric needs an owner, a period and a decision it informs." },
    { type: "note", text: "Agree the owner, the date and the decision, in writing." },
    { type: "note", text: "Prove repeatable delivery before you scale." },
    { type: "doc", name: "Operating manual" },
    { type: "doc", name: "PMO maturity check" },
    { type: "doc", name: "Operating toolkit" },
    { type: "doc", name: "Pipeline governance" }
  ]
};
