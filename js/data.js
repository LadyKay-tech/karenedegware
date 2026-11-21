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

  /* My products. Placeholders until the real ones are added. */
  products: [
    { slug: "meeqly", title: "Meeqly", area: "Music · Mobile app", status: "open", href: "meeqly/", thumb: "assets/products/meeqly.jpg", note: "Live preview" },
    { slug: "product-two", title: "Product two", area: "Product", status: "soon" },
    { slug: "product-three", title: "Product three", area: "Product", status: "soon" }
  ],

  principles: [
    { slug: "activation", title: "A sign-up is not activation", area: "Onboarding", preview: "activation", status: "open", href: "activation/", thumb: "assets/previews/activation.jpg" },
    { slug: "show-the-full-price", title: "Show the full price before the last step", area: "Ecommerce", preview: "checkout", status: "open", href: "show-the-full-price/", thumb: "assets/previews/show-the-full-price.jpg" },
    { slug: "make-leaving-easy", title: "Make leaving easy, and listen on the way out", area: "Subscriptions", preview: "cancel", status: "open", href: "make-leaving-easy/", thumb: "assets/previews/make-leaving-easy.jpg" },
    { slug: "upsell-after-success", title: "Upsell after success, not on a schedule", area: "Expansion", preview: "upsell", status: "open", href: "upsell-after-success/", thumb: "assets/previews/upsell-after-success.jpg" },
    { slug: "where-is-my-money", title: "Tell people exactly where their money is", area: "Payments", preview: "status", status: "open", href: "where-is-my-money/", thumb: "assets/previews/where-is-my-money.jpg" },
    { slug: "explain-every-step", title: "Explain why you need each step", area: "Verification", preview: "kyc", status: "open", href: "explain-every-step/", thumb: "assets/previews/explain-every-step.jpg" }
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
