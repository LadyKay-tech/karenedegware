/*
  Site content that isn't written in the CMS.
  To rename a principle, change its title here. To open one up, give it
  status "open" and an href to its page.
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
    { slug: "activation", title: "A sign-up is not activation", status: "open", href: "activation/" },
    { slug: "lead-with-the-outcome", title: "Lead with the outcome", status: "soon" },
    { slug: "pricing-is-a-decision-about-value", title: "Pricing is a decision about value", status: "soon" },
    { slug: "design-for-genuine-utility", title: "Design for genuine utility", status: "soon" },
    { slug: "a-demo-is-proof-of-value", title: "A demo is proof of value", status: "soon" },
    { slug: "start-with-the-customers-question", title: "Start with the customer’s question", status: "soon" },
    { slug: "activity-is-not-progress", title: "Activity is not progress", status: "soon" },
    { slug: "sell-only-what-you-can-deliver", title: "Sell only what the product can deliver", status: "soon" },
    { slug: "a-feature-request-is-evidence", title: "A feature request is evidence of a need", status: "soon" },
    { slug: "measure-qualified-demand", title: "Measure qualified demand, not vanity", status: "soon" }
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
