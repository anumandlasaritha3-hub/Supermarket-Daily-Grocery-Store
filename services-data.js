/* DailyKart services data - used by services.html and service-detail.html */
window.DK_SERVICES = [
  { id: "home-delivery", icon: "bi-truck", img: "images/Home Delivery.png",
    name: "Home Delivery", tag: "Everyday",
    short: "Fresh groceries delivered to your door, with a delivery slot that suits your day.",
    long: "Order from the full DailyKart range and pick a delivery slot that fits your routine. Our riders bring your groceries packed with care, so everything arrives fresh and in good shape.",
    price: "Free above ₹499", time: "Next-day slots",
    includes: ["Choose your own delivery slot", "Careful, cold-chain packing for fresh items", "Contact-free drop-off on request", "Live order updates by SMS"],
    steps: ["Add items to your basket", "Pick a delivery slot", "Our team packs your order", "Receive it at your door"],
    faqs: [["What is the delivery fee?", "Delivery is free on orders above ₹499. Smaller orders have a small flat fee shown at checkout."], ["Can I change my slot?", "Yes. You can change your slot until the order is packed."]] },
  { id: "express-delivery", icon: "bi-lightning-charge", img: "images/Express Delivery.png",
    name: "Express Delivery", tag: "Fast",
    short: "Forgot something? Get your essentials in about 60 minutes.",
    long: "For the times you need milk, bread or a missing ingredient right now. Express orders are packed first and sent out straight away.",
    price: "₹39 per order", time: "Around 60 minutes",
    includes: ["Priority packing", "Delivery in about an hour", "Available on daily essentials", "Real-time rider tracking"],
    steps: ["Choose Express at checkout", "We pack your order first", "A rider heads out right away", "Your essentials arrive fast"],
    faqs: [["Which items are available?", "Express covers daily essentials such as dairy, bread, fruits and vegetables."], ["When is it available?", "Every day during store hours, subject to rider availability in your area."]] },
  { id: "click-and-collect", icon: "bi-bag-check", img: "images/Collect.png",
    name: "Click & Collect", tag: "Convenient",
    short: "Order online and pick up your packed bag from the store when you are ready.",
    long: "Shop from home and skip the queues. We pack your bag and keep it ready at the pickup counter at the time you choose.",
    price: "Free", time: "Ready in 2 hours",
    includes: ["No delivery fee", "Pickup counter with no queue", "Bag kept fresh until you arrive", "Same-day collection"],
    steps: ["Build your basket online", "Choose a pickup time", "We pack your order", "Collect it at the counter"],
    faqs: [["How long is my order held?", "Orders are held for 4 hours from the pickup time you choose."], ["Do I need to bring anything?", "Just your order number or the confirmation message."]] },
  { id: "weekly-fresh-box", icon: "bi-box-seam", img: "images/Fresh Box.png",
    name: "Weekly Fresh Box", tag: "Subscription",
    short: "A hand-picked box of fruits and vegetables delivered every week.",
    long: "Let us handle the fresh shopping. Each week we pick seasonal fruits and vegetables and deliver them in one box. Pause, skip or cancel whenever you like.",
    price: "From ₹399 / week", time: "Weekly",
    includes: ["Seasonal fruits and vegetables", "Choose a small, medium or large box", "Skip or pause any week", "Swap items you do not like"],
    steps: ["Choose a box size", "Pick your delivery day", "We select the best of the week", "Enjoy fresh produce on repeat"],
    faqs: [["Can I pause my subscription?", "Yes. Skip or pause any week from your account before the cut-off."], ["Can I choose what is inside?", "You can swap or remove items, and we fill the rest with the freshest picks."]] },
  { id: "bulk-orders", icon: "bi-people", img: "images/Party Orders.png",
    name: "Bulk & Party Orders", tag: "Events",
    short: "Large orders for parties, offices and festivals, with special pricing.",
    long: "Planning a celebration or stocking an office pantry? Share your list and our team will prepare a bulk order with better prices and a delivery time that works for you.",
    price: "Custom quote", time: "Plan 2 days ahead",
    includes: ["Special bulk pricing", "A dedicated order helper", "Flexible delivery time", "Easy repeat orders"],
    steps: ["Share your shopping list", "Receive a quote", "Confirm your order", "We deliver on the day"],
    faqs: [["What counts as a bulk order?", "Orders above ₹3,000 or with larger quantities of the same item."], ["How do I get a quote?", "Send your list through the contact page and we will reply the same day."]] },
  { id: "gift-hampers", icon: "bi-gift", img: "images/Gift Hampers.png",
    name: "Gift Hampers", tag: "Gifting",
    short: "Thoughtful hampers of fresh fruit, snacks and pantry treats for loved ones.",
    long: "Send something useful and delicious. Choose a ready-made hamper or build your own, add a personal note and we deliver it beautifully packed.",
    price: "From ₹599", time: "Same or next day",
    includes: ["Ready-made or custom hampers", "Personal message card", "Gift-ready packaging", "Delivery to any address"],
    steps: ["Pick or build a hamper", "Add your message", "Enter the recipient address", "We deliver it gift-wrapped"],
    faqs: [["Can I hide the price?", "Yes. Hampers are sent without a price slip."], ["Can I send it to another city?", "We deliver within our service areas. Check your pincode at checkout."]] }
];

/* Extra info: category, best-for and highlight numbers */
(function () {
  var X = {
    "home-delivery":    { cat: "delivery",     best: "Weekly family shopping",  stats: [["15k+", "Orders delivered"], ["98%", "On-time rate"], ["4.8", "Average rating"]] },
    "express-delivery": { cat: "delivery",     best: "Last-minute essentials",  stats: [["60", "Minutes or less"], ["500+", "Express items"], ["4.9", "Average rating"]] },
    "click-and-collect":{ cat: "delivery",     best: "Busy, on-the-go days",    stats: [["0", "Fees to pay"], ["2h", "Ready time"], ["4.8", "Average rating"]] },
    "weekly-fresh-box": { cat: "subscription", best: "Regular fresh produce",   stats: [["3", "Box sizes"], ["100%", "Seasonal picks"], ["4.9", "Average rating"]] },
    "bulk-orders":      { cat: "events",       best: "Parties and offices",     stats: [["10%", "Avg. savings"], ["24h", "Quote reply"], ["4.8", "Average rating"]] },
    "gift-hampers":     { cat: "events",       best: "Festivals and gifting",   stats: [["25+", "Hamper styles"], ["1", "Day delivery"], ["4.9", "Average rating"]] }
  };
  window.DK_SERVICES.forEach(function (s) { Object.assign(s, X[s.id]); });
})();
