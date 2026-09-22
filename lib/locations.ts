export type LocationInfo = {
  slug: string;
  name: string;
  state: string;
  image: string;
  tagline: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  heroDescription: string;
  responseTime: string;
  activeTechnicians: string;
  homesTreated: string;
  rating: string;
  reviewCount: string;
  phone: string;
  phoneDisplay: string;
  whatsappText: string;
  coverageAreas: {
    zone: string;
    localities: string[];
  }[];
  pricing: {
    propertyType: string;
    startingPrice: string;
    duration: string;
    warranty: string;
    popular?: boolean;
  }[];
  localHighlights: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  reviews: {
    name: string;
    locality: string;
    city: string;
    rating: number;
    quote: string;
  }[];
};

export const locations: LocationInfo[] = [
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    image: "/images/cities/pune.jpg",
    tagline: "Same-Day Bed Bug Eradication Across Pune & PCMC",
    title: "Bed Bug Treatment in Pune | Same-Day Service & Warranty",
    metaDescription:
      "Bed bug treatment in Pune. 100% odorless & pet-safe solutions across Hinjewadi, Wakad, Baner & Kothrud. Free same-day inspection with 12-month warranty.",
    keywords: [
      "bed bug treatment pune",
      "bed bug control pune",
      "bed bug exterminator pune",
      "bed bug treatment hinjewadi",
      "bed bug treatment wakad",
      "bed bug control kothrud",
      "bed bug control baner",
      "pest control for bed bugs pune",
    ],
    heroDescription:
      "Specialized, government-approved bed bug eradication for flats, IT hostels, PGs, and villas across Pune. Fast response in under 90 minutes with zero odor and a 12-month warranty.",
    responseTime: "Within 90 mins",
    activeTechnicians: "18+ Certified Technicians",
    homesTreated: "50,000+",
    rating: "4.9/5",
    reviewCount: "4,650+",
    phone: "+919769321234",
    phoneDisplay: "+91 97693 21234",
    whatsappText: "Hi, I need urgent bed bug treatment in Pune.",
    coverageAreas: [
      {
        zone: "West Pune & IT Corridor",
        localities: ["Hinjewadi", "Wakad", "Baner", "Balewadi", "Aundh", "Pashan", "Bavdhan", "Pimple Saudagar", "Pimple Nilakh", "Punawale"],
      },
      {
        zone: "Central & South Pune",
        localities: ["Kothrud", "Shivajinagar", "Deccan Gymkhana", "Karve Nagar", "Sinhagad Road", "Bibwewadi", "Dhankawadi", "Swargate", "Camp", "Koregaon Park"],
      },
      {
        zone: "East Pune & Kharadi Tech Zone",
        localities: ["Viman Nagar", "Kharadi", "Kalyani Nagar", "Hadapsar", "Magarpatta City", "Wagholi", "Yerawada", "Chandan Nagar", "Mundhwa"],
      },
    ],
    pricing: [
      { propertyType: "1 RK / Studio", startingPrice: "₹1,199", duration: "1 Hour", warranty: "12 Months" },
      { propertyType: "1 BHK Apartment", startingPrice: "₹1,499", duration: "1.5 Hours", warranty: "12 Months" },
      { propertyType: "2 BHK Apartment", startingPrice: "₹1,999", duration: "2 Hours", warranty: "12 Months", popular: true },
      { propertyType: "3 BHK Apartment", startingPrice: "₹2,599", duration: "2.5 Hours", warranty: "12 Months" },
      { propertyType: "Hostel / PG / Commercial", startingPrice: "Custom Quote", duration: "Tailored", warranty: "12 Months" },
    ],
    localHighlights: [
      {
        title: "IT Hub & PG Specialist",
        description: "Specialized protocol for shared accommodations, co-living spaces, and PGs in Hinjewadi, Kharadi, and Wakad.",
      },
      {
        title: "Same-Day Book Bed Bug Treatment",
        description: "Local Pune teams reach your location in under 90 minutes to check mattresses, sofa seams, and bed joints.",
      },
      {
        title: "100% Odorless & Non-Toxic",
        description: "Safe for kids, elderly, and pets. No chemical smell or need to evacuate your Pune home overnight.",
      },
      {
        title: "12-Month Warranty & Support",
        description: "Every treatment is backed by a 12-month service warranty with scheduled follow-ups and monitoring for recurring activity across Pune.",
      },
    ],
    faqs: [
      {
        question: "What is the best way to treat bed bugs in Pune?",
        answer: "Professional bed bug treatment in Pune begins with an inspection to locate activity and hiding areas before selecting a suitable targeted treatment approach.",
      },
      {
        question: "How much does bed bug treatment cost in Pune?",
        answer: "Bed bug treatment cost in Pune varies with property size, number of rooms, infestation level and service requirements. Assessment helps determine the suitable option.",
      },
      {
        question: "Do you provide bed bug treatment for homes in Pune?",
        answer: "Yes, bed bug treatment is available for houses, apartments, rented properties, bedrooms and other residential spaces across Pune and nearby service areas.",
      },
      {
        question: "Do you provide bed bug treatment for hotels and PGs in Pune?",
        answer: "Yes, professional services can be arranged for hotels, hostels, PGs, guest houses and other accommodation properties based on their individual requirements.",
      },
      {
        question: "How long does bed bug treatment take in Pune?",
        answer: "Treatment duration depends on the property size, number of rooms, infestation level and areas requiring service. A technician can explain the expected duration.",
      },
      {
        question: "Can mattresses and furniture be treated for bed bugs?",
        answer: "Yes, mattresses, bed frames, headboards, sofas and nearby furniture can be inspected and treated where suitable for the selected bed bug service.",
      },
      {
        question: "Do you offer one-time bed bug treatment in Pune?",
        answer: "Yes, one-time bed bug treatment is available for suitable cases. The recommended service depends on infestation level and the property's condition.",
      },
      {
        question: "Do you offer bed bug service plans in Pune?",
        answer: "Yes, service plan options can include scheduled visits and follow-up support depending on the property, infestation level and service requirements.",
      },
      {
        question: "Do I need to leave my home during bed bug treatment?",
        answer: "Temporary vacating may be required depending on the treatment selected. Your technician will provide preparation and re-entry instructions before service.",
      },
      {
        question: "How can I book bed bug treatment in Pune?",
        answer: "Contact the bed bug treatment team to discuss your situation, arrange an inspection and select a suitable treatment option for your Pune property.",
      },
    ],
    reviews: [],

  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    image: "/images/cities/mumbai.jpg",
    tagline: "Targeted Bed Bug Elimination Across Mumbai, Thane & Navi Mumbai",
    title: "Bed Bug Treatment in Mumbai | Same-Day Pest Control",
    metaDescription:
      "Bed bug treatment in Mumbai, Thane & Navi Mumbai. 100% odorless, eco-friendly solutions for flats and hotels. Schedule a free same-day inspection today.",
    keywords: [
      "bed bug treatment mumbai",
      "bed bug control mumbai",
      "bed bug exterminator mumbai",
      "bed bug treatment andheri",
      "bed bug treatment bandra",
      "bed bug control powai",
      "bed bug control thane",
      "bed bug treatment navi mumbai",
    ],
    heroDescription:
      "Comprehensive bed bug removal engineered for Mumbai's climate and high-density apartments. Penetrates wooden bed frames, wall paneling, and mattress crevices with zero downtime.",
    responseTime: "Within 60-90 mins",
    activeTechnicians: "26+ Field Specialists",
    homesTreated: "18,200+",
    rating: "4.9/5",
    reviewCount: "4,950+",
    phone: "+919769321234",
    phoneDisplay: "+91 97693 21234",
    whatsappText: "Hi, I need urgent bed bug treatment in Mumbai.",
    coverageAreas: [
      {
        zone: "Western Suburbs",
        localities: ["Andheri East & West", "Bandra", "Juhu", "Goregaon", "Malad", "Kandivali", "Borivali", "Santacruz", "Vile Parle", "Khar"],
      },
      {
        zone: "Central Mumbai & South Mumbai",
        localities: ["Dadar", "Lower Parel", "Worli", "Prabhadevi", "Colaba", "Marine Lines", "Byculla", "Kurla", "Ghatkopar", "Powai", "Mulund", "Bhandup"],
      },
      {
        zone: "Thane & Beyond",
        localities: ["Thane West", "Ghodbunder Road", "Majiwada", "Kalyan", "Dombivli", "Mira Road", "Bhayandar"],
      },
    ],
    pricing: [
      { propertyType: "1 RK / Compact Flat", startingPrice: "₹1,299", duration: "1 Hour", warranty: "12 Months" },
      { propertyType: "1 BHK Apartment", startingPrice: "₹1,599", duration: "1.5 Hours", warranty: "12 Months" },
      { propertyType: "2 BHK Apartment", startingPrice: "₹2,199", duration: "2 Hours", warranty: "12 Months", popular: true },
      { propertyType: "3 BHK Apartment", startingPrice: "₹2,799", duration: "2.5 Hours", warranty: "12 Months" },
      { propertyType: "High-Rise / Penthouse / Hotel", startingPrice: "Custom Quote", duration: "Tailored", warranty: "12 Months" },
    ],
    localHighlights: [
      {
        title: "Humidity-Resistant Formulas",
        description: "Customized micro-capsule formulations designed to remain lethal to bed bugs even in Mumbai's humid coastal climate.",
      },
      {
        title: "Rapid Local Dispatch",
        description: "Local hubs in Andheri, Dadar, Thane, and Vashi allow our technicians to reach high-rise flats in under 60-90 minutes.",
      },
      {
        title: "Zero Furniture Disposal",
        description: "Our targeted steam and odorless treatment reaches deep into mattress seams so you never have to discard costly beds or sofas.",
      },
      {
        title: "12-Month Warranty & Support",
        description: "Backed by a 12-month warranty with scheduled follow-ups so high-rise residents across Mumbai stay bed bug-free.",
      },
    ],
    faqs: [
      {
        question: "What is the best way to treat bed bugs in Mumbai?",
        answer: "Professional bed bug treatment in Mumbai starts with an inspection to identify activity and hiding areas, followed by a suitable targeted treatment approach.",
      },
      {
        question: "How much does bed bug treatment cost in Mumbai?",
        answer: "Bed bug treatment cost in Mumbai depends on property size, rooms, infestation level and service requirements. An assessment helps determine the appropriate option.",
      },
      {
        question: "Do you provide bed bug treatment for apartments in Mumbai?",
        answer: "Yes, professional bed bug treatment is available for apartments, homes, rented flats, bedrooms and other residential properties across Mumbai and nearby areas.",
      },
      {
        question: "Do you treat bed bugs in hotels and PGs in Mumbai?",
        answer: "Yes, bed bug services can be arranged for hotels, hostels, PGs, guest houses and other accommodation properties according to their treatment requirements.",
      },
      {
        question: "How long does bed bug treatment take in Mumbai?",
        answer: "Treatment duration depends on property size, rooms, infestation level and treatment areas. Your technician can explain the expected service time after assessment.",
      },
      {
        question: "Can mattresses and sofas be treated for bed bugs?",
        answer: "Yes, mattresses, bed frames, sofas, headboards and nearby furniture can be inspected and treated where appropriate as part of the selected service.",
      },
      {
        question: "Do you offer one-time bed bug treatment in Mumbai?",
        answer: "Yes, one-time treatment is available for suitable cases. The recommended service depends on infestation level, property conditions and treatment requirements.",
      },
      {
        question: "Do you offer bed bug service plans in Mumbai?",
        answer: "Yes, service plan options are available for customers requiring scheduled visits or follow-up support based on their property and infestation requirements.",
      },
      {
        question: "Do I need to leave my apartment during treatment?",
        answer: "Depending on the selected treatment, temporary vacating may be required. Your technician will explain preparation and re-entry instructions before service.",
      },
      {
        question: "How can I book bed bug treatment in Mumbai?",
        answer: "Contact the bed bug treatment team to discuss your infestation, arrange an inspection and understand suitable treatment options for your Mumbai property.",
      },
    ],
    reviews: [],

  },
  {
    slug: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    image: "/images/cities/bangalore.jpg",
    tagline: "Professional Bed Bug Extermination in Bangalore Tech City",
    title: "Bed Bug Treatment in Bangalore | Fast Same-Day Control",
    metaDescription:
      "Professional bed bug treatment in Bangalore. Safe, odorless solutions across Whitefield, HSR Layout, Koramangala & Indiranagar. Free same-day inspection.",
    keywords: [
      "bed bug treatment bangalore",
      "bed bug control bangalore",
      "bed bug exterminator bengaluru",
      "bed bug treatment whitefield",
      "bed bug treatment hsr layout",
      "bed bug control koramangala",
      "bed bug control indiranagar",
      "bed bug control electronic city",
    ],
    heroDescription:
      "Bengaluru's top-rated bed bug eradication service for apartments, techie co-living hubs, and gated communities. Eco-friendly, odorless treatment backed by certified technicians.",
    responseTime: "Within 60-90 mins",
    activeTechnicians: "22+ Field Technicians",
    homesTreated: "15,800+",
    rating: "4.9/5",
    reviewCount: "4,880+",
    phone: "+919769321234",
    phoneDisplay: "+91 97693 21234",
    whatsappText: "Hi, I need urgent bed bug treatment in Bangalore.",
    coverageAreas: [
      {
        zone: "East Bangalore & Tech Corridors",
        localities: ["Whitefield", "Marathahalli", "Bellandur", "Outer Ring Road (ORR)", "Sarjapur Road", "Kadugodi", "Mahadevapura", "Varthur"],
      },
      {
        zone: "South Bangalore",
        localities: ["HSR Layout", "Koramangala", "BTM Layout", "JP Nagar", "Jayanagar", "Electronic City", "Bannerghatta Road", "Arekere", "Begur"],
      },
      {
        zone: "Central & North Bangalore",
        localities: ["Indiranagar", "Domlur", "MG Road", "Hebbal", "Yelahanka", "Thanisandra", "Hennur", "RT Nagar", "Malleshwaram", "Rajajinagar"],
      },
    ],
    pricing: [
      { propertyType: "1 RK / Studio Flat", startingPrice: "₹1,199", duration: "1 Hour", warranty: "12 Months" },
      { propertyType: "1 BHK Apartment", startingPrice: "₹1,499", duration: "1.5 Hours", warranty: "12 Months" },
      { propertyType: "2 BHK Apartment", startingPrice: "₹1,999", duration: "2 Hours", warranty: "12 Months", popular: true },
      { propertyType: "3 BHK Apartment", startingPrice: "₹2,599", duration: "2.5 Hours", warranty: "12 Months" },
      { propertyType: "Villa / Co-Living / PG", startingPrice: "Custom Quote", duration: "Tailored", warranty: "12 Months" },
    ],
    localHighlights: [
      {
        title: "Fast Tech-Corridor Coverage",
        description: "Same-day inspection teams deployed near Whitefield, Electronic City, Bellandur, and HSR Layout.",
      },
      {
        title: "Co-Living & Rental Friendly",
        description: "Clean treatments designed for rented flats and tech co-living spaces with quick turnarounds and no residue.",
      },
      {
        title: "Child & Pet Approved",
        description: "Low-toxicity, safe formulations that protect your family and companion animals without toxic fumes.",
      },
      {
        title: "12-Month Warranty & Support",
        description: "Long-term protection with a 12-month warranty and periodic monitoring for homes and tech parks across Bengaluru.",
      },
    ],
    faqs: [
      {
        question: "What is the best way to treat bed bugs in Bengaluru?",
        answer: "Professional bed bug treatment starts with an inspection to identify activity and hiding areas, followed by a suitable targeted treatment for your property.",
      },
      {
        question: "How much does bed bug treatment cost in Bengaluru?",
        answer: "Bed bug treatment cost in Bengaluru depends on property size, rooms, infestation level and service requirements. An assessment helps determine the suitable option.",
      },
      {
        question: "Do you provide bed bug treatment for homes in Bengaluru?",
        answer: "Yes, professional bed bug treatment is available for apartments, houses, rented homes, bedrooms and other residential properties across Bengaluru.",
      },
      {
        question: "Do you provide bed bug treatment for hotels and PGs in Bengaluru?",
        answer: "Yes, bed bug services can be arranged for hotels, hostels, PGs, guest houses and other accommodation properties based on their treatment requirements.",
      },
      {
        question: "How long does bed bug treatment take in Bengaluru?",
        answer: "Service time depends on the property, number of rooms, infestation level and areas requiring treatment. The technician can explain the expected service duration.",
      },
      {
        question: "Can bed bugs in mattresses and beds be treated?",
        answer: "Yes, mattresses, bed frames, headboards and nearby furniture can be inspected and treated where appropriate as part of a professional bed bug service.",
      },
      {
        question: "Do you offer one-time bed bug treatment in Bengaluru?",
        answer: "Yes, one-time bed bug service is available for suitable cases. Treatment requirements are assessed based on the infestation and property conditions.",
      },
      {
        question: "Do you offer bed bug service plans in Bengaluru?",
        answer: "Yes, service plan options are available for customers who require scheduled visits or follow-up support based on their property and infestation requirements.",
      },
      {
        question: "Do I need to leave my home during bed bug treatment?",
        answer: "Depending on the selected treatment, temporary vacating may be required. Your technician will explain preparation and re-entry instructions before service.",
      },
      {
        question: "How can I book bed bug treatment in Bengaluru?",
        answer: "Contact the bed bug treatment team to discuss your requirements, arrange an inspection and understand suitable treatment options for your Bengaluru property.",
      },
    ],
    reviews: [],

  },
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    image: "/images/cities/delhi.jpg",
    tagline: "Licensed Bed Bug Treatment & Control Across Delhi NCR",
    title: "Bed Bug Treatment in Delhi | Same-Day Pest Eradication",
    metaDescription:
      "Bed bug treatment across Delhi NCR. Same-day inspection in Dwarka, Rohini, Saket & South Delhi. 100% odorless formula with a guaranteed 12-month warranty.",
    keywords: [
      "bed bug treatment delhi",
      "bed bug control delhi",
      "bed bug exterminator delhi",
      "bed bug control south delhi",
      "bed bug treatment dwarka",
      "bed bug treatment rohini",
      "bed bug treatment saket",
      "pest control for bed bugs delhi",
    ],
    heroDescription:
      "Targeted bed bug eradication for independent builder floors, DDA flats, student housing, and commercial properties across Delhi. Odorless, deep-penetrating formulas backed by a 12-month warranty.",
    responseTime: "Within 60-90 mins",
    activeTechnicians: "20+ Certified Technicians",
    homesTreated: "16,400+",
    rating: "4.9/5",
    reviewCount: "4,780+",
    phone: "+919769321234",
    phoneDisplay: "+91 97693 21234",
    whatsappText: "Hi, I need urgent bed bug treatment in Delhi.",
    coverageAreas: [
      {
        zone: "South Delhi",
        localities: ["Saket", "Hauz Khas", "Greater Kailash (GK)", "Lajpat Nagar", "Vasant Kunj", "Malviya Nagar", "Defence Colony", "CR Park", "Green Park"],
      },
      {
        zone: "West Delhi",
        localities: ["Dwarka", "Janakpuri", "Rajouri Garden", "Uttam Nagar", "Paschim Vihar", "Punjabi Bagh", "Tilak Nagar", "Vikaspuri"],
      },
      {
        zone: "North & Central Delhi",
        localities: ["Rohini", "Pitampura", "Karol Bagh", "Connaught Place", "Civil Lines", "Model Town", "Shalimar Bagh", "Kamla Nagar"],
      },
    ],
    pricing: [
      { propertyType: "1 RK / Room", startingPrice: "₹1,199", duration: "1 Hour", warranty: "12 Months" },
      { propertyType: "1 BHK Floor / Flat", startingPrice: "₹1,499", duration: "1.5 Hours", warranty: "12 Months" },
      { propertyType: "2 BHK Builder Floor", startingPrice: "₹1,999", duration: "2 Hours", warranty: "12 Months", popular: true },
      { propertyType: "3 BHK Builder Floor", startingPrice: "₹2,699", duration: "2.5 Hours", warranty: "12 Months" },
      { propertyType: "Kothi / Bungalow / Hotel", startingPrice: "Custom Quote", duration: "Tailored", warranty: "12 Months" },
    ],
    localHighlights: [
      {
        title: "All Floor Types Covered",
        description: "Specialized procedures for independent builder floors, heritage bungalows, and high-rise apartments across Delhi.",
      },
      {
        title: "Deep Crack & Seam Treatment",
        description: "Targeted application for headboards, wooden skirting, wallpaper seams, and switchboard boxes where bugs lay eggs.",
      },
      {
        title: "100% Family & Pet Safe",
        description: "Zero harmful fumes. Safe for children, asthma patients, and household pets with quick room re-occupancy.",
      },
      {
        title: "12-Month Warranty & Support",
        description: "A 12-month warranty with follow-up visits keeps Delhi homes, builder floors, and bungalows protected year-round.",
      },
    ],
    faqs: [
      {
        question: "What is the best way to treat bed bugs in New Delhi?",
        answer: "Professional bed bug treatment in New Delhi starts with an inspection to locate activity and hiding areas before selecting a suitable targeted treatment approach.",
      },
      {
        question: "How much does bed bug treatment cost in New Delhi?",
        answer: "Treatment cost depends on property size, number of rooms, infestation level and service requirements. An assessment helps determine the appropriate treatment option.",
      },
      {
        question: "Do you provide bed bug treatment for homes in New Delhi?",
        answer: "Yes, bed bug treatment is available for houses, apartments, rented homes, bedrooms and other residential properties across New Delhi and surrounding areas.",
      },
      {
        question: "Do you provide bed bug treatment for hotels and PGs?",
        answer: "Yes, professional bed bug services can be arranged for hotels, hostels, PGs, guest houses and accommodation properties based on their specific requirements.",
      },
      {
        question: "How long does bed bug treatment take in New Delhi?",
        answer: "Treatment duration varies with property size, rooms, infestation level and areas requiring service. Your technician can explain the expected duration after assessment.",
      },
      {
        question: "Can mattresses and furniture be treated for bed bugs?",
        answer: "Yes, mattresses, bed frames, headboards, sofas and nearby furniture can be inspected and treated where appropriate for the selected bed bug service.",
      },
      {
        question: "Do you offer one-time bed bug treatment in New Delhi?",
        answer: "Yes, one-time treatment is available for suitable cases. Service recommendations depend on infestation level, property conditions and treatment requirements.",
      },
      {
        question: "Do you offer bed bug service plans in New Delhi?",
        answer: "Yes, service plan options may include scheduled visits and follow-up support depending on the property, infestation level and selected service.",
      },
      {
        question: "Do I need to leave my home during treatment?",
        answer: "Temporary vacating may be required depending on the selected treatment. Your technician will provide preparation and re-entry instructions before service.",
      },
      {
        question: "How can I book bed bug treatment in New Delhi?",
        answer: "Contact the bed bug treatment team to discuss your requirements, arrange an inspection and understand suitable treatment options for your New Delhi property.",
      },
    ],
    reviews: [],

  },
  {
    slug: "noida",
    name: "Noida",
    state: "Uttar Pradesh",
    image: "/images/cities/noida.jpg",
    tagline: "Guaranteed Bed Bug Treatment in Noida & Greater Noida",
    title: "Bed Bug Treatment in Noida | Same-Day Pest Eradication",
    metaDescription:
      "Bed bug treatment in Noida & Greater Noida high-rise societies. 100% odorless, pet-safe treatments with free same-day inspection and 12-month warranty.",
    keywords: [
      "bed bug treatment noida",
      "bed bug control noida",
      "bed bug exterminator noida",
      "bed bug treatment greater noida",
      "bed bug treatment noida extension",
      "bed bug treatment sector 62 noida",
      "bed bug control sector 137 noida",
      "pest control noida",
    ],
    heroDescription:
      "Engineered for Noida's high-rise gated societies and commercial hubs. Fast same-day elimination of bed bugs, nymphs, and eggs using odorless, micro-targeted formulations.",
    responseTime: "Within 60-90 mins",
    activeTechnicians: "16+ Certified Technicians",
    homesTreated: "11,800+",
    rating: "4.9/5",
    reviewCount: "4,550+",
    phone: "+919769321234",
    phoneDisplay: "+91 97693 21234",
    whatsappText: "Hi, I need urgent bed bug treatment in Noida.",
    coverageAreas: [
      {
        zone: "Central Noida Sectors",
        localities: ["Sector 18", "Sector 50", "Sector 62", "Sector 75", "Sector 76", "Sector 78", "Sector 79", "Sector 34", "Sector 52"],
      },
      {
        zone: "Expressway & High-Rise Societies",
        localities: ["Sector 128", "Sector 137", "Sector 143", "Sector 150", "Sector 93", "Sector 104", "Sector 107", "Sector 110"],
      },
      {
        zone: "Greater Noida West (Noida Extension)",
        localities: ["Gaur City 1 & 2", "Sector 1", "Sector 4", "Sector 16", "Techzone 4", "Crossings Republik"],
      },
    ],
    pricing: [
      { propertyType: "Studio / 1 RK Flat", startingPrice: "₹1,199", duration: "1 Hour", warranty: "12 Months" },
      { propertyType: "1 BHK High-Rise Flat", startingPrice: "₹1,499", duration: "1.5 Hours", warranty: "12 Months" },
      { propertyType: "2 BHK High-Rise Flat", startingPrice: "₹1,999", duration: "2 Hours", warranty: "12 Months", popular: true },
      { propertyType: "3 BHK High-Rise Flat", startingPrice: "₹2,599", duration: "2.5 Hours", warranty: "12 Months" },
      { propertyType: "Society Towers / Commercial", startingPrice: "Custom Quote", duration: "Tailored", warranty: "12 Months" },
    ],
    localHighlights: [
      {
        title: "High-Rise Society Specialists",
        description: "Familiar with society gate passes, security guidelines, and multi-story apartment layouts across Noida & Greater Noida.",
      },
      {
        title: "Same-Day Inspection Guarantee",
        description: "Immediate slots available across Sector 62, 137, 75, and Gaur City in Noida Extension.",
      },
      {
        title: "100% Odorless & Safe Formulations",
        description: "Safe for kids, senior citizens, and pets. Does not leave unpleasant smells in closed apartment towers.",
      },
      {
        title: "12-Month Warranty & Support",
        description: "A 12-month warranty with scheduled follow-ups protects Noida & Greater Noida high-rises from recurring infestations.",
      },
    ],
    faqs: [
      {
        question: "What is the best way to treat bed bugs in Noida?",
        answer: "Professional bed bug treatment in Noida begins with an inspection to identify activity and hiding areas before selecting a suitable targeted treatment approach.",
      },
      {
        question: "How much does bed bug treatment cost in Noida?",
        answer: "Bed bug treatment cost in Noida depends on property size, rooms, infestation level and service requirements. Assessment helps determine the suitable service option.",
      },
      {
        question: "Do you provide bed bug treatment for homes in Noida?",
        answer: "Yes, professional bed bug treatment is available for apartments, houses, rented properties, bedrooms and other residential spaces across Noida and nearby areas.",
      },
      {
        question: "Do you provide bed bug treatment for hotels and PGs in Noida?",
        answer: "Yes, bed bug services can be arranged for hotels, hostels, PGs, guest houses and other accommodation properties according to their treatment requirements.",
      },
      {
        question: "How long does bed bug treatment take in Noida?",
        answer: "Treatment duration depends on property size, number of rooms, infestation level and areas requiring service. A technician can explain the expected duration.",
      },
      {
        question: "Can mattresses and furniture be treated for bed bugs?",
        answer: "Yes, mattresses, bed frames, headboards, sofas and nearby furniture can be inspected and treated where appropriate for the selected bed bug service.",
      },
      {
        question: "Do you offer one-time bed bug treatment in Noida?",
        answer: "Yes, one-time treatment is available for suitable cases. The recommended service depends on infestation level, property condition and treatment requirements.",
      },
      {
        question: "Do you offer bed bug service plans in Noida?",
        answer: "Yes, service plan options can provide scheduled visits and follow-up support depending on the property, infestation level and selected treatment service.",
      },
      {
        question: "Do I need to leave my home during bed bug treatment?",
        answer: "Temporary vacating may be required depending on the treatment selected. Your technician will provide preparation and re-entry instructions before service.",
      },
      {
        question: "How can I book bed bug treatment in Noida?",
        answer: "Contact the bed bug treatment team to discuss your situation, arrange an inspection and understand suitable treatment options for your Noida property.",
      },
    ],
    reviews: [],

  },
];

const LOCATION_DISPLAY_ORDER = ["Bangalore", "Delhi", "Mumbai", "Noida", "Pune"];

locations.sort(
  (a, b) => LOCATION_DISPLAY_ORDER.indexOf(a.name) - LOCATION_DISPLAY_ORDER.indexOf(b.name),
);

export function getAllLocations(): LocationInfo[] {
  return locations;
}

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  return locations.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllLocationSlugs(): string[] {
  return locations.map((l) => l.slug);
}
