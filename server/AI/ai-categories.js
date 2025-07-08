const serviceSubcategoriesData = {
  "Plumbing Services": [{ name: "Leak Repairs" }, { name: "Pipe Installation" }, { name: "Toilet Repairs" }],
  "Handyman Services": [{ name: "Plumbing Fixes" }, { name: "Door & Window Repairs" }],
  "Home Cleaning Services": [
    { name: "Regular Cleaning" },
    { name: "Deep Cleaning" },
    { name: "Move-In/Move-Out Cleaning" },
    { name: "Carpet Cleaning" },
    { name: "Window Cleaning" },
  ],
  "Pest Control Services": [{ name: "Rodent Control" }, { name: "Bed Bug Treatment" }, { name: "Mosquito Control" }],
  "Landscaping Services": [{ name: "Lawn Maintenance" }, { name: "Garden Design" }, { name: "Tree Services" }],
  "Massage Services": [{ name: "Swedish Massage" }, { name: "Deep Tissue Massage" }, { name: "Hot Stone Massage" }],
  "Roofing Services": [{ name: "Roof Inspection" }, { name: "Roof Repair" }, { name: "Roof Replacement" }],
  "Interior Design": [{ name: "Design Consultation" }, { name: "Room Styling" }, { name: "Color Consultation" }],
  "Wifi Installment Services": [{ name: "Home Wifi Setup" }, { name: "Office Network Installation" }],
  "Mechanic Services": [{ name: "Car Engine Repair" }, { name: "Brake System Check" }],
  // NEW: Added Childcare Services to provide a direct reference for the AI
  "Childcare Services": [{ name: "Babysitting" }, { name: "Nanny Services" }, { name: "After-School Care" }],
}

// Extract main category names (keys of the object)
const mainCategoryNames = Object.keys(serviceSubcategoriesData)

// Extract subcategory names grouped by their main category
const subcategoryNamesByMainCategory = {}
for (const mainCat in serviceSubcategoriesData) {
  subcategoryNamesByMainCategory[mainCat] = serviceSubcategoriesData[mainCat].map((sub) => sub.name)
}

export { mainCategoryNames, subcategoryNamesByMainCategory }