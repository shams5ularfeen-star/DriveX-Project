// DriveX Pakistan — Strict Car Dataset
// IMPORTANT: Each car uses ONLY its assigned images. No mixing, swapping, or sharing.
// Image roles:
//   - frontImage: required, default display
//   - backImage: optional, shown on hover/click toggle
//   - interiorImage: optional alt view (when no back exists) — exposed via "Interior" tab
//   - sideImage: optional alt view (when no back exists) — exposed via "Side" tab

export type CarCategory =
  | "Economy"
  | "Sedan"
  | "SUV"
  | "Luxury"
  | "Exotic"
  | "Vans"
  | "Wedding"
  | "Family"
  | "City"

export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric"
export type Transmission = "Manual" | "Automatic" | "CVT" | "DCT"

export interface Car {
  id: string
  name: string
  model: string
  category: CarCategory
  pricePerDay: number // PKR
  fuel: FuelType
  transmission: Transmission
  seats: number
  ac: boolean
  insurance: boolean
  rating: number
  reviews: number
  city: string
  description: string
  frontImage: string
  backImage?: string
  interiorImage?: string
  sideImage?: string
  featured?: boolean
  /**
   * Total fleet quantity for this car (per city).
   * If undefined, the system falls back to the category default
   * (Economy 25, Sedan/SUV/Luxury 20, Exotic 10, Vans/Family/Wedding 8).
   */
  totalQuantity?: number
}

export const CITIES = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Rawalpindi",
  "Peshawar",
  "Multan",
  "Quetta",
  "Faisalabad",
  "Sialkot",
  "Hyderabad",
] as const

export const CATEGORIES: CarCategory[] = [
  "Economy",
  "Sedan",
  "SUV",
  "Luxury",
  "Exotic",
  "Vans",
  "Wedding",
  "Family",
  "City",
]

export const DEFAULT_CARS: Car[] = [
  // ========== ECONOMY / SMALL ==========
  {
    id: "suzuki-mehran-vx",
    name: "Suzuki Mehran VX",
    model: "2019",
    category: "Economy",
    pricePerDay: 5500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.3,
    reviews: 142,
    city: "Lahore",
    description:
      "Pakistan's most reliable budget hatchback. Easy on fuel and perfect for navigating city streets.",
    frontImage:
      "https://imgcdn.zigwheels.pk/large/gallery/exterior/13/123/suzuki-mehran-front-angle-low-view.jpg",
    backImage:
      "https://imgcdn.zigwheels.pk/large/gallery/exterior/13/123/suzuki-mehran-rear-cross-side-view.jpg",
  },
  {
    id: "suzuki-bolan",
    name: "Suzuki Bolan",
    model: "2021",
    category: "Vans",
    pricePerDay: 6000,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 7,
    ac: false,
    insurance: true,
    rating: 4.1,
    reviews: 98,
    city: "Karachi",
    description:
      "Spacious passenger van ideal for family trips and group travel within the city.",
    frontImage:
      "https://imgcdn.zigwheels.pk/large/gallery/color/13/122/suzuki_bolan_solid_white.jpg",
    backImage:
      "https://imgcdn.zigwheels.pk/large/gallery/exterior/13/122/suzuki-bolan-rear-cross-side-view.jpg",
  },
  {
    id: "suzuki-alto",
    name: "Suzuki Alto",
    model: "2023",
    category: "Economy",
    pricePerDay: 6500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 210,
    city: "Islamabad",
    description:
      "Compact, modern hatchback with excellent fuel economy. The smart choice for city commuting.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/16749/original/Cover.jpg?1768990406",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16752/original/Right_Rear_View.jpg?1768990407",
  },
  {
    id: "suzuki-wagon-r",
    name: "Suzuki Wagon R",
    model: "2022",
    category: "Economy",
    pricePerDay: 7000,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 178,
    city: "Rawalpindi",
    description:
      "Roomy interior in a small footprint. Practical, reliable and easy to drive.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/15360/original/Cover.jpg?1768566983",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/15350/original/Back_View.jpg?1768566979",
  },
  {
    id: "toyota-corolla",
    name: "Toyota Corolla",
    model: "2024",
    category: "Sedan",
    pricePerDay: 11000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 412,
    city: "Lahore",
    description:
      "The world's best-selling sedan. Refined ride, polished interior and bullet-proof reliability.",
    frontImage:
      "https://imgcdn.zigwheels.pk/large/gallery/exterior/14/118/toyota-corolla-front-angle-low-view.jpg",
    backImage:
      "https://imgcdn.zigwheels.pk/large/gallery/exterior/14/118/toyota-corolla-rear-cross-side-view.jpg",
    featured: true,
  },
  {
    id: "honda-civic",
    name: "Honda Civic",
    model: "2020",
    category: "Sedan",
    pricePerDay: 13500,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 388,
    city: "Karachi",
    description:
      "Sporty, sharp and stylish — the Civic blends performance with everyday usability.",
    frontImage:
      "https://img.pcauto.com/model/images/modelPic/my/Honda_Civic/2020_Honda_Civic/Exterior/01%20(2).jpg",
    backImage:
      "https://img.pcauto.com/model/images/modelPic/my/Honda_Civic/2020_Honda_Civic/Exterior/05%20(2).jpg",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    model: "2024",
    category: "SUV",
    pricePerDay: 28000,
    fuel: "Diesel",
    transmission: "Automatic",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 256,
    city: "Islamabad",
    description:
      "Commanding presence with serious off-road capability. The benchmark family SUV.",
    frontImage:
      "https://cache2.arabwheels.sa/system/car_generation_pictures/18967/original/Cover.?1750834419",
    backImage:
      "https://cache2.arabwheels.sa/system/car_generation_pictures/18977/original/Right%20Rear%20View.?1750834422",
    featured: true,
  },
  {
    id: "toyota-land-cruiser-zx",
    name: "Toyota Land Cruiser ZX",
    model: "2024",
    category: "Luxury",
    pricePerDay: 65000,
    fuel: "Diesel",
    transmission: "Automatic",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 187,
    city: "Islamabad",
    description:
      "The legendary 300-series flagship. Off-road royalty meets first-class luxury.",
    frontImage:
      "https://assets.cdntoyota.co.za/toyotacms23/attachments/ckrq17ssi5cev0rqqxp368mnh-lc-300-front-34-ret-turned.desktop.jpg",
    backImage:
      "https://assets.cdntoyota.co.za/toyotacms23/attachments/ckrq17t7o5fav0qlpmy93t252-lc-300-full-rear-ret.desktop.jpg",
    featured: true,
  },
  {
    id: "toyota-hilux-revo",
    name: "Toyota Hilux Revo",
    model: "2023",
    category: "SUV",
    pricePerDay: 22000,
    fuel: "Diesel",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 198,
    city: "Peshawar",
    description:
      "Tough, indestructible and ready for any road. The pickup truck Pakistan trusts.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/16960/original/Cover.jpg?1772165892",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/16957/original/Left_Rear_View.jpg?1772165891",
  },

  // ========== LUXURY SEDANS ==========
  {
    id: "mercedes-s-class",
    name: "Mercedes-Benz S-Class",
    model: "2026",
    category: "Luxury",
    pricePerDay: 75000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 142,
    city: "Lahore",
    description:
      "The pinnacle of automotive luxury. Whisper-quiet, supremely comfortable, technologically unmatched.",
    frontImage:
      "https://static.pakwheels.com/2026/02/pre-media_26c0017_002_0-1-750x430.jpg",
    backImage:
      "https://static.pakwheels.com/2026/02/mercedes-s-class-2026-28.webp",
    featured: true,
  },
  {
    id: "bmw-7-series",
    name: "BMW 7 Series",
    model: "2025 740i",
    category: "Luxury",
    pricePerDay: 72000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 168,
    city: "Islamabad",
    description:
      "Pure flagship presence. The 7 Series fuses commanding design with effortless power.",
    frontImage:
      "https://images.hgmsites.net/med/2025-bmw-7-series-740i-sedan-angular-front-exterior-view_100943118_m.webp",
    backImage:
      "https://images.hgmsites.net/med/2025-bmw-7-series-740i-sedan-angular-rear-exterior-view_100943111_m.webp",
    featured: true,
  },
  {
    id: "audi-a8",
    name: "Audi A8",
    model: "2023",
    category: "Luxury",
    pricePerDay: 68000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 124,
    city: "Karachi",
    description:
      "Quattro-driven excellence. Audi's flagship saloon packs technology with understated luxury.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/8200/original/Cover.jpg?1768563222",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/10468/original/Left_Rear_View.jpg?1768563219",
  },
  {
    id: "range-rover",
    name: "Range Rover",
    model: "2022",
    category: "Luxury",
    pricePerDay: 85000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 156,
    city: "Lahore",
    description:
      "British luxury at its peak. Effortlessly capable, breathtakingly refined inside and out.",
    frontImage:
      "https://imgcdn.zigwheels.ph/large/gallery/exterior/18/2959/land-rover-range-rover-2022-front-cross-side-view-240500.jpg",
    backImage:
      "https://imgcdn.zigwheels.ph/large/gallery/exterior/18/2959/land-rover-range-rover-2022-rear-cross-side-view-858019.jpg",
  },
  {
    id: "lamborghini-huracan",
    name: "Lamborghini Huracán",
    model: "2023",
    category: "Exotic",
    pricePerDay: 280000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 2,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 64,
    city: "Karachi",
    description:
      "Italian thunder. A naturally aspirated V10 wrapped in razor-sharp design.",
    frontImage:
      "https://carsales.pxcrush.net/general/car/spec/S00046BV.jpg?width=642&height=428&watermark=259373711",
    backImage:
      "https://carsales.pxcrush.net/general/car/spec/S00046BW.jpg?width=642&height=428&watermark=133128341",
    featured: true,
  },
  {
    id: "ferrari-roma",
    name: "Ferrari Roma",
    model: "2022",
    category: "Exotic",
    pricePerDay: 320000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 48,
    city: "Lahore",
    description:
      "La Nuova Dolce Vita. Ferrari's grand tourer is elegance and ferocity in equal measure.",
    frontImage:
      "https://www.chi-athenaeum.org/assets/components/phpthumbof/cache/11466-_1.511a76f6b048a3e5c026d2d472200e6f.jpg",
    backImage: "https://www.chi-athenaeum.org/assets/GD2020C/11466_3.jpg",
  },
  {
    id: "rolls-royce",
    name: "Rolls Royce",
    model: "Wraith",
    category: "Wedding",
    pricePerDay: 350000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 92,
    city: "Lahore",
    description:
      "The ultimate wedding chariot. Hand-crafted, opulent and unmistakably Rolls Royce.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/14794/original/Cover.jpg?1768566491",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/5731/original/2013-rolls-royce-wraith.jpg?1768566487",
    featured: true,
  },
  {
    id: "toyota-corolla-altis-x",
    name: "Toyota Corolla Altis X",
    model: "2022",
    category: "Sedan",
    pricePerDay: 12500,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 220,
    city: "Faisalabad",
    description:
      "The flagship Corolla trim. Premium kit and comfort wrapped in an iconic silhouette.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/5361/original/Corolla-X-Cars-Cropped-Pictures-for-Website.jpg?1606903674",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7272/original/8.jpg?1768560541",
  },
  {
    id: "toyota-land-cruiser-v8",
    name: "Toyota Land Cruiser V8",
    model: "2018",
    category: "Luxury",
    pricePerDay: 55000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 134,
    city: "Islamabad",
    description:
      "Iconic 200-series V8. Unstoppable on any road, palatial inside.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6007/original/Land_Cruiser_200_-_PNG.png?1768567431",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/3882/original/side_pose.jpg?1768567427",
  },
  {
    id: "mercedes-c-class",
    name: "Mercedes-Benz C-Class",
    model: "2023",
    category: "Luxury",
    pricePerDay: 38000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 110,
    city: "Karachi",
    description:
      "The little S-Class. Mercedes-Benz refinement in a sharper, sportier package.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/7514/original/2023-mercedes-benz-c-class-sedan-door-controls-carbuzz-816898.jpg?1768565385",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/7508/original/2023-mercedes-benz-c-class-sedan-rim-carbuzz-816905.jpg?1768565379",
  },
  {
    id: "bmw-5-series",
    name: "BMW 5 Series",
    model: "2010",
    category: "Luxury",
    pricePerDay: 32000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 88,
    city: "Lahore",
    description:
      "The executive sedan benchmark. Sharp dynamics with German engineering pedigree.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/2917/original/BMW_5_Series_2010.jpg?1768563373",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/3638/original/Rear_End_BMW_5_series.jpg?1768563374",
  },
  {
    id: "audi-a6",
    name: "Audi A6",
    model: "2018",
    category: "Luxury",
    pricePerDay: 36000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 102,
    city: "Islamabad",
    description:
      "Quattro all-wheel drive and a cabin that feels carved from a single block of luxury.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/6393/original/Audi_A6_Front.jpg?1768563203",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/10448/original/Left_Rear_View.jpg?1768563200",
  },

  // ========== SUVS / CROSSOVERS ==========
  {
    id: "kia-sportage-awd",
    name: "KIA Sportage AWD",
    model: "2023",
    category: "SUV",
    pricePerDay: 18000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 168,
    city: "Multan",
    description:
      "All-wheel drive confidence with bold styling and a tech-forward interior.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7734/original/Sportage_white.jpeg?1768564766",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6669/original/Key.jpg?1768564769",
  },
  {
    id: "kia-sportage-l",
    name: "KIA Sportage L",
    model: "2024",
    category: "SUV",
    pricePerDay: 16000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 132,
    city: "Sialkot",
    description:
      "Modern crossover with a generous feature list at a smart price point.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/8102/original/Cover.jpg?1738231817",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/8108/original/Left_Rear_View.jpg?1738231847",
  },
  {
    id: "suzuki-cultus-vxl",
    name: "Suzuki Cultus VXL",
    model: "2021",
    category: "Economy",
    pricePerDay: 7500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 156,
    city: "Hyderabad",
    description:
      "Top-of-the-line Cultus trim with all the essentials for daily city driving.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/6014/original/Suzuki_Cultus_-_PNG.png?1768562638",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6561/original/Headlight.jpg?1768562637",
  },
  {
    id: "range-rover-vogue",
    name: "Range Rover Vogue",
    model: "2018",
    category: "Luxury",
    pricePerDay: 80000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 84,
    city: "Lahore",
    description:
      "Refinement, capability, dignity. The Vogue is the SUV that doesn't compromise.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7709/original/range_rover.png?1768566440",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/14685/original/Left_Rear_View.jpg?1768566438",
  },
  {
    id: "honda-br-v",
    name: "Honda BR-V",
    model: "2018",
    category: "Family",
    pricePerDay: 13000,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 184,
    city: "Karachi",
    description:
      "Seven-seat family hauler with Honda's refined drive and excellent reliability.",
    frontImage: "https://static.pakwheels.com/2018/12/Honda_BR-V-1.jpg",
    backImage: "https://static.pakwheels.com/2018/12/Honda_BR-V-2.jpg",
  },
  {
    id: "suzuki-khyber-ga",
    name: "Suzuki Khyber GA",
    model: "1998",
    category: "Economy",
    pricePerDay: 5000,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 4,
    ac: false,
    insurance: true,
    rating: 4.0,
    reviews: 62,
    city: "Quetta",
    description:
      "Classic Khyber. A piece of automotive history that still gets the job done.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/15162/original/Cover.jpg?1768566842",
    interiorImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/4211/original/dashboard.JPG?1452770147",
  },
  {
    id: "suzuki-alto-vxl-ags",
    name: "Suzuki Alto VXL AGS",
    model: "2015",
    category: "Economy",
    pricePerDay: 6800,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.3,
    reviews: 138,
    city: "Faisalabad",
    description:
      "Compact, automatic and easy. Hassle-free city driving in its purest form.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/3924/original/Suzuki_Alto_2015.jpg?1768566723",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/15030/original/Back_View.jpg?1768566698",
  },
  {
    id: "suzuki-cultus",
    name: "Suzuki Cultus",
    model: "2022",
    category: "Economy",
    pricePerDay: 7200,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 142,
    city: "Multan",
    description:
      "Reliable city hatchback with great fuel economy and proven Suzuki dependability.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/15089/original/Cover.jpg?1768566803",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/15084/original/Right_Rear_View.jpg?1768566802",
  },
  {
    id: "suzuki-wagonr-vxr",
    name: "Suzuki WagonR VXR",
    model: "2020",
    category: "Economy",
    pricePerDay: 7000,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 156,
    city: "Hyderabad",
    description:
      "Tall-boy practicality with surprising interior space for its size.",
    frontImage:
      "http://propakistani.pk/tools/wp-content/uploads/2018/10/Suzuki-Wagon-r-1.png",
    backImage:
      "http://propakistani.pk/tools/wp-content/uploads/2018/10/reer_end.jpg",
  },
  {
    id: "daihatsu-mira-es",
    name: "Daihatsu Mira ES",
    model: "2017",
    category: "Economy",
    pricePerDay: 6800,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.3,
    reviews: 102,
    city: "Sialkot",
    description:
      "Light, efficient and well-equipped Japanese kei car for the urban driver.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/11384/original/Cover.jpg?1768563845",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/11378/original/Right_Rear_View.jpg?1768563843",
  },
  {
    id: "prince-pearl",
    name: "Prince Pearl",
    model: "2020",
    category: "Economy",
    pricePerDay: 5500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.0,
    reviews: 64,
    city: "Rawalpindi",
    description:
      "Pakistan's value champion. A small, efficient hatchback for everyday errands.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/5253/original/prince.jpg?1595597356",
    sideImage:
      "https://profit.pakistantoday.com.pk/wp-content/uploads/2019/12/6-3-696x464.jpg",
  },
  {
    id: "united-bravo",
    name: "United Bravo",
    model: "2019",
    category: "Economy",
    pricePerDay: 5500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.0,
    reviews: 58,
    city: "Peshawar",
    description:
      "Affordable local hatchback. Ideal for first-time renters and short trips.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/5254/original/bravo.jpg?1595597417",
  },
  {
    id: "kia-picanto-at",
    name: "KIA Picanto AT",
    model: "2020",
    category: "Economy",
    pricePerDay: 8500,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 134,
    city: "Lahore",
    description:
      "Charming city hatchback with grown-up features and Korean build quality.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/6017/original/Picanto_-_PNG.png?1768564737",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6626/original/DRL.jpg?1768564733",
  },
  {
    id: "suzuki-swift-gl-mt",
    name: "Suzuki Swift GL MT",
    model: "2022",
    category: "Economy",
    pricePerDay: 9000,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 142,
    city: "Karachi",
    description:
      "Fun, agile and stylish. The Swift makes every drive feel a little more spirited.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7311/original/White-Base-PS.jpg?1768566947",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/6572/original/Engine.jpg?1768566944",
  },
  {
    id: "faw-v2",
    name: "FAW V2",
    model: "2020",
    category: "Economy",
    pricePerDay: 6500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.1,
    reviews: 76,
    city: "Multan",
    description:
      "Compact hatchback with a roomy interior at an attractive daily rate.",
    frontImage: "https://static.pakwheels.com/2020/10/v2-750x430.jpg",
    backImage:
      "https://www.gari.pk/images/new/cars/2021-12/1342_1_35486.jpg",
  },

  // ========== SEDANS CONTINUED ==========
  {
    id: "toyota-corolla-xli-vvti",
    name: "Toyota Corolla XLi VVTi",
    model: "2010",
    category: "Sedan",
    pricePerDay: 8500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 198,
    city: "Faisalabad",
    description:
      "The classic XLi. Practical, reliable and a familiar favourite on Pakistani roads.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/2867/original/Toyota_Corolla_10th.jpg?1768567139",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/15696/original/Left_Rear_View.jpg?1768567137",
  },
  {
    id: "toyota-corolla-gli",
    name: "Toyota Corolla GLi",
    model: "2021",
    category: "Sedan",
    pricePerDay: 10500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 220,
    city: "Lahore",
    description:
      "The smart Corolla pick. More features than XLi, sharper styling than ever.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/5361/original/Corolla-X-Cars-Cropped-Pictures-for-Website.jpg?1606903674",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7272/original/8.jpg?1768560541",
  },
  {
    id: "toyota-corolla-altis-1-6",
    name: "Toyota Corolla Altis 1.6",
    model: "2020",
    category: "Sedan",
    pricePerDay: 11500,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 184,
    city: "Islamabad",
    description:
      "Refined 1.6L engine, comfortable cabin and the badge that holds value.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7266/original/2.jpg?1768560543",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/7274/original/10.jpg?1768560540",
  },
  {
    id: "toyota-yaris-sedan",
    name: "Toyota Yaris Sedan",
    model: "2024",
    category: "Sedan",
    pricePerDay: 9500,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 162,
    city: "Karachi",
    description:
      "Compact sedan with Toyota DNA. Perfect entry into the world of automatic sedans.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/16706/original/Cover.jpg?1768979326",
    interiorImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/8056/original/Dashboard.jpg?1768568237",
  },
  {
    id: "honda-civic-oriel",
    name: "Honda Civic Oriel",
    model: "2022",
    category: "Sedan",
    pricePerDay: 14000,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 198,
    city: "Lahore",
    description:
      "Top Civic Oriel trim with full-LED lighting and premium leather interior.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/10345/original/Cover_%2818%29.jpg?1767275410",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/7378/original/Rear-Side.jpg?1677570258",
  },
  {
    id: "honda-civic-rs-turbo",
    name: "Honda Civic RS Turbo 1.5",
    model: "2025",
    category: "Sedan",
    pricePerDay: 16000,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 142,
    city: "Islamabad",
    description:
      "The new flagship Civic. Turbocharged, beautifully finished, and seriously fast.",
    frontImage: "https://honda.com.pk/images/2025/civicrscolors/Ignite-Red.jpg",
    backImage:
      "https://honda.com.pk/images/2025/civic-rs/backlights-draker.jpg",
    featured: true,
  },
  {
    id: "honda-city-aspire-cvt",
    name: "Honda City 1.5 Aspire CVT",
    model: "2021",
    category: "Sedan",
    pricePerDay: 11500,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 178,
    city: "Karachi",
    description:
      "Honda City Aspire — a popular choice with smooth CVT and a refined ride.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/5261/original/city.jpg?1768564274",
    interiorImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/3350/original/cityfacelift_interior.jpg?1449744724",
  },
  {
    id: "honda-city",
    name: "Honda City",
    model: "2024",
    category: "Sedan",
    pricePerDay: 12000,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 156,
    city: "Multan",
    description:
      "All-new City with sharper styling and Honda's latest tech kit.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16740/original/Cover.jpg?1768988801",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/16741/original/Left_Rear_View.jpg?1768988801",
  },
  {
    id: "changan-alsvin",
    name: "Changan Alsvin",
    model: "2022",
    category: "Sedan",
    pricePerDay: 9500,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 122,
    city: "Rawalpindi",
    description:
      "Modern sedan packed with features at an exceptional value point.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/6015/original/Alsvin_-_PNG.png?1768563564",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7397/original/Front-Side.jpg?1768563563",
  },
  {
    id: "proton-saga",
    name: "Proton Saga",
    model: "2022",
    category: "Sedan",
    pricePerDay: 9000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.3,
    reviews: 98,
    city: "Sialkot",
    description:
      "Compact Malaysian sedan offering comfort and equipment at a sensible price.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/6949/original/Front.jpg?1768566416",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/6955/original/Rear-Side.jpg?1768566418",
  },
  {
    id: "hyundai-elantra-gls",
    name: "Hyundai Elantra GLS",
    model: "2021",
    category: "Sedan",
    pricePerDay: 14500,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 132,
    city: "Hyderabad",
    description:
      "Bold styling and a rich feature list make the Elantra a class standout.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/9800/original/Cover.jpg?1760439908",
    interiorImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/9808/original/Steering_Wheel.jpg?1760439910",
  },
  {
    id: "hyundai-sonata-25-gls",
    name: "Hyundai Sonata 2.5 GLS",
    model: "2022",
    category: "Sedan",
    pricePerDay: 22000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 118,
    city: "Karachi",
    description:
      "Mid-size luxury cruiser with assertive styling and a refined drive.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_version_specification_pictures/1209/original/1.jpg?1737615472",
    backImage:
      "https://cache4.pakwheels.com/system/car_version_specification_pictures/1211/original/3.jpg?1737615497",
  },
  {
    id: "toyota-camry-hybrid",
    name: "Toyota Camry Hybrid",
    model: "2017",
    category: "Sedan",
    pricePerDay: 26000,
    fuel: "Hybrid",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 96,
    city: "Lahore",
    description:
      "Hybrid efficiency in a full-size, executive-grade sedan. Smooth, silent, sublime.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/4633/original/Toyota_Camry_2017.jpg?1768567108",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/15634/original/Right_Rear_View.jpg?1768567105",
  },
  {
    id: "honda-accord",
    name: "Honda Accord",
    model: "2014",
    category: "Sedan",
    pricePerDay: 18000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 88,
    city: "Islamabad",
    description:
      "Spacious Accord with Honda's hallmark blend of comfort and dependability.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6845/original/Steering-COntrols-1.jpg?1768564170",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/6836/original/Rear-Light.jpg?1768564168",
  },
  {
    id: "honda-br-v-s-mt",
    name: "Honda BR-V S MT",
    model: "2018",
    category: "Family",
    pricePerDay: 12500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 144,
    city: "Faisalabad",
    description:
      "Three-row family transport with manual transmission and Honda reliability.",
    frontImage: "https://static.pakwheels.com/2018/12/Honda_BR-V-1.jpg",
    backImage: "https://static.pakwheels.com/2018/12/Honda_BR-V-2.jpg",
  },

  // ========== SUVs / CROSSOVERS CONTINUED ==========
  {
    id: "honda-hr-v-vti-15",
    name: "Honda HR-V VTi 1.5",
    model: "2024",
    category: "SUV",
    pricePerDay: 17000,
    fuel: "Petrol",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 124,
    city: "Lahore",
    description:
      "Sleek urban crossover with Honda's signature smooth ride and clever packaging.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/16746/original/Cover.jpg?1768989567",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/16747/original/Right_Rear_View.jpg?1768989567",
  },
  {
    id: "honda-hr-v-ehev",
    name: "Honda HR-V e:HEV",
    model: "2024",
    category: "SUV",
    pricePerDay: 19000,
    fuel: "Hybrid",
    transmission: "CVT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 102,
    city: "Karachi",
    description:
      "Hybrid HR-V with seamless electric assist and elevated efficiency.",
    frontImage:
      "https://static.pakwheels.com/2024/03/2024-Honda-Vezel-HR-V-facelift-1-850x408-1-750x408.jpg",
    backImage:
      "https://static.pakwheels.com/2024/03/2024-Honda-Vezel-HR-V-facelift-2-850x439-1-750x430.jpg",
  },
  {
    id: "kia-stonic-explus",
    name: "KIA Stonic EX+",
    model: "2024",
    category: "SUV",
    pricePerDay: 14000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 96,
    city: "Islamabad",
    description:
      "Compact crossover with sharp styling and a confident, engaging drive.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/16838/original/Cover.jpg?1769009520",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16841/original/Right_Rear_View.jpg?1769009521",
  },
  {
    id: "kia-sportage-alpha",
    name: "KIA Sportage Alpha",
    model: "2024",
    category: "SUV",
    pricePerDay: 17500,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 138,
    city: "Multan",
    description:
      "Entry Sportage Alpha — full SUV credentials at a value-driven price.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/8102/original/Cover.jpg?1738231817",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/8108/original/Left_Rear_View.jpg?1738231847",
  },
  {
    id: "hyundai-tucson",
    name: "Hyundai Tucson",
    model: "2023",
    category: "SUV",
    pricePerDay: 18500,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 152,
    city: "Lahore",
    description:
      "Striking design and a thoroughly modern cabin make the Tucson stand out.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/8720/original/Cover.jpg?1745488440",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/8724/original/Right_Rear_View.jpg?1745488463",
  },
  {
    id: "mg-hs-2026",
    name: "MG HS 2026",
    model: "2026",
    category: "SUV",
    pricePerDay: 20000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 84,
    city: "Karachi",
    description:
      "All-new MG HS with bold styling, a tech-led cabin and impressive performance.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/17082/original/Cover.jpg?1776670293",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/17084/original/Right_Rear_View.jpg?1776670293",
  },
  {
    id: "haval-jolion-hev",
    name: "Haval Jolion HEV",
    model: "2024",
    category: "SUV",
    pricePerDay: 17500,
    fuel: "Hybrid",
    transmission: "DCT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 96,
    city: "Rawalpindi",
    description:
      "Stylish hybrid SUV with a feature-rich interior and smooth electrified drive.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/7070/original/360-Degree.jpg?1768564162",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7059/original/Rear-Side.jpg?1768564157",
  },
  {
    id: "mg-zs-ev",
    name: "MG ZS EV",
    model: "2022",
    category: "SUV",
    pricePerDay: 16500,
    fuel: "Electric",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 102,
    city: "Lahore",
    description:
      "All-electric crossover. Silent, quick and ready for the EV future today.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/5322/original/zs-ev.jpg?1768565745",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/6924/original/Side-Profile.jpg?1768565728",
  },

  // ========== MPV / VANS ==========
  {
    id: "toyota-hiace",
    name: "Toyota Hiace",
    model: "2022",
    category: "Vans",
    pricePerDay: 18000,
    fuel: "Diesel",
    transmission: "Manual",
    seats: 12,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 162,
    city: "Islamabad",
    description:
      "The legendary 12-seat tour van. Comfortable, reliable and ready for any journey.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/16715/original/Cover.jpg?1768981325",
    interiorImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7332/original/Rear-Seats.jpg?1768567353",
  },
  {
    id: "kia-carnival",
    name: "KIA Carnival",
    model: "2023",
    category: "Vans",
    pricePerDay: 26000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 8,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 108,
    city: "Lahore",
    description:
      "Premium MPV with first-class style and limousine-grade rear comfort.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/7988/original/Cover.jpg?1737101800",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7989/original/Right_Rear_View.jpg?1737101800",
    featured: true,
  },
  {
    id: "dfsk-glory-580",
    name: "DFSK Glory 580",
    model: "2021",
    category: "SUV",
    pricePerDay: 14500,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.4,
    reviews: 78,
    city: "Karachi",
    description:
      "Seven-seat crossover with generous space and a competitive price.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/6431/original/Glory_580_Pro_Front.jpg?1652179255",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16832/original/Right_Rear_View.jpg?1769001577",
  },
  {
    id: "changan-karvaan",
    name: "Changan Karvaan",
    model: "2020",
    category: "Vans",
    pricePerDay: 9500,
    fuel: "Petrol",
    transmission: "Manual",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.2,
    reviews: 86,
    city: "Faisalabad",
    description:
      "Family-friendly mini-van with seating for seven and a sensible daily rate.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/4835/original/Changan_Karvaan_.jpg?1536237811",
    sideImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/10984/original/Left_Side_View.jpg?1768563578",
  },
  {
    id: "changan-oshan-x7",
    name: "Changan Oshan X7",
    model: "2024",
    category: "SUV",
    pricePerDay: 17500,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 94,
    city: "Sialkot",
    description:
      "Bold full-size SUV with three rows and impressive levels of standard equipment.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16816/original/Cover.jpg?1769000052",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/16817/original/Right_Rear_View.jpg?1769000052",
  },
  {
    id: "proton-x70",
    name: "Proton X70",
    model: "2021",
    category: "SUV",
    pricePerDay: 16000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 102,
    city: "Multan",
    description:
      "Geely-engineered crossover delivering modern tech and assertive design.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/6973/original/Headlight.jpg?1768566432",
    sideImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/6974/original/Side-Profile.jpg?1768566433",
  },

  // ========== PREMIUM / LUXURY CONTINUED ==========
  {
    id: "mercedes-e300",
    name: "Mercedes-Benz E300",
    model: "2024",
    category: "Luxury",
    pricePerDay: 52000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 116,
    city: "Lahore",
    description:
      "Executive saloon perfection. The E300 is the sweet spot of the Mercedes lineup.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/16843/original/Cover.jpg?1769010008",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/16846/original/Left_Rear_View.jpg?1769010009",
  },
  {
    id: "mercedes-glc-300",
    name: "Mercedes-Benz GLC 300",
    model: "2023",
    category: "Luxury",
    pricePerDay: 48000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 124,
    city: "Karachi",
    description:
      "Mercedes' best-selling SUV. Sharp lines, plush cabin, effortless performance.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/9620/original/Cover.jpg?1758284194",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/9625/original/Left_Rear_View.jpg?1758284196",
  },
  {
    id: "mercedes-gle-450",
    name: "Mercedes-Benz GLE 450",
    model: "2024",
    category: "Luxury",
    pricePerDay: 62000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 96,
    city: "Islamabad",
    description:
      "Mid-size luxury SUV that balances performance with first-class comfort.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/13442/original/Cover.jpg?1768565519",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/13437/original/Right_Rear_View.jpg?1768565516",
  },
  {
    id: "mercedes-amg-g63",
    name: "Mercedes-AMG G63",
    model: "2024",
    category: "Luxury",
    pricePerDay: 120000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 78,
    city: "Lahore",
    description:
      "The G-Wagon AMG. Iconic shape, twin-turbo V8 thunder and zero compromises.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/13453/original/Cover.jpg?1768565527",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/13446/original/Left_Rear_View.jpg?1768565522",
    featured: true,
  },
  {
    id: "bmw-3-series",
    name: "BMW 3 Series",
    model: "2008",
    category: "Luxury",
    pricePerDay: 22000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.5,
    reviews: 96,
    city: "Karachi",
    description:
      "The classic E90. Driver-focused dynamics with timeless BMW DNA.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/2885/original/BMW_3_Series_2005.jpg?1768563359",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/3205/original/BMW_E90_3_series_rear_end.jpg?1768563356",
  },
  {
    id: "bmw-x5",
    name: "BMW X5",
    model: "2013",
    category: "Luxury",
    pricePerDay: 42000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.6,
    reviews: 88,
    city: "Islamabad",
    description:
      "The original sports activity vehicle. Powerful, plush and ready for anything.",
    frontImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/2933/original/BMW_X5_2013.jpg?1768563466",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/3648/original/X5_Rear_End.jpg?1768563462",
  },
  {
    id: "audi-a4",
    name: "Audi A4",
    model: "2020",
    category: "Luxury",
    pricePerDay: 28000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 104,
    city: "Lahore",
    description:
      "Audi's compact executive sedan. Quattro grip and a beautifully crafted cabin.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/10428/original/Cover.jpg?1768563189",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/10421/original/Left_Rear_View.jpg?1768563186",
  },
  {
    id: "audi-q5",
    name: "Audi Q5",
    model: "2022",
    category: "Luxury",
    pricePerDay: 45000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 92,
    city: "Karachi",
    description:
      "Premium mid-size SUV with smooth Quattro all-wheel drive and a polished interior.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/10416/original/Cover.jpg?1768563179",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/10413/original/Right_Rear_View.jpg?1768563178",
  },
  {
    id: "audi-e-tron-gt",
    name: "Audi e-tron GT",
    model: "2023",
    category: "Exotic",
    pricePerDay: 95000,
    fuel: "Electric",
    transmission: "Automatic",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 64,
    city: "Islamabad",
    description:
      "All-electric Audi flagship. Whisper-quiet acceleration with stunning visuals.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/5519/original/audi-gt-etron.jpg?1768563232",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/5525/original/2019-audi-e-tron-gauge-cluster-carbuzz-786950.jpg?1768563230",
  },
  {
    id: "range-rover-sport",
    name: "Range Rover Sport",
    model: "2014",
    category: "Luxury",
    pricePerDay: 55000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.7,
    reviews: 78,
    city: "Lahore",
    description:
      "The dynamic Range Rover. Sportier proportions, every bit as luxurious.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/3031/original/Range-Rover_Sport_2014.jpg?1768566452",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/4185/original/rear_end.jpg?1768566447",
  },
  {
    id: "lexus-lx-570",
    name: "Lexus LX 570",
    model: "2018",
    category: "Luxury",
    pricePerDay: 70000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 7,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 84,
    city: "Karachi",
    description:
      "Land Cruiser bones, Lexus refinement. The LX 570 is luxury that won't quit.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/12931/original/Cover.jpg?1768565159",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7285/original/1.jpg?1768565156",
  },
  {
    id: "porsche-cayenne",
    name: "Porsche Cayenne",
    model: "2014",
    category: "Luxury",
    pricePerDay: 58000,
    fuel: "Petrol",
    transmission: "Automatic",
    seats: 5,
    ac: true,
    insurance: true,
    rating: 4.8,
    reviews: 72,
    city: "Lahore",
    description:
      "The sports car of SUVs. Porsche pedigree applied to a luxurious five-seater.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/4672/original/Porsche_Cayenne.jpg?1768566373",
    sideImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/7520/original/cayenne-exterior-left-side-view-removebg-preview.png?1768566367",
  },

  // ========== SUPER / HYPERCARS ==========
  {
    id: "lamborghini-revuelto",
    name: "Lamborghini Revuelto",
    model: "2024",
    category: "Exotic",
    pricePerDay: 450000,
    fuel: "Hybrid",
    transmission: "DCT",
    seats: 2,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 32,
    city: "Lahore",
    description:
      "Lamborghini's V12 plug-in hybrid flagship. The future of the bull.",
    frontImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/9207/original/Cover.jpg?1754390650",
    backImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/9203/original/Right_Rear_View.jpg?1754390649",
    featured: true,
  },
  {
    id: "porsche-taycan",
    name: "Porsche Taycan",
    model: "2022",
    category: "Exotic",
    pricePerDay: 180000,
    fuel: "Electric",
    transmission: "Automatic",
    seats: 4,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 56,
    city: "Karachi",
    description:
      "Porsche's electric soul. Brutal acceleration with classic 911 silhouette cues.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/6417/original/Porsche_Taycan_Front.jpg?1768566406",
    backImage:
      "https://cache1.pakwheels.com/system/car_generation_pictures/14654/original/Left_Rear_View.jpg?1768566404",
  },
  {
    id: "bugatti-veyron",
    name: "Bugatti Veyron",
    model: "2010",
    category: "Exotic",
    pricePerDay: 750000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 2,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 18,
    city: "Lahore",
    description:
      "The legend. 1001 horsepower, quad-turbo W16 — automotive history on four wheels.",
    frontImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/10850/original/Cover.jpg?1768563500",
    sideImage:
      "https://cache3.pakwheels.com/system/car_generation_pictures/10845/original/Right_Side_View.jpg?1768563498",
  },
  {
    id: "ferrari-f80",
    name: "Ferrari F80",
    model: "2025",
    category: "Exotic",
    pricePerDay: 850000,
    fuel: "Hybrid",
    transmission: "DCT",
    seats: 2,
    ac: true,
    insurance: true,
    rating: 5.0,
    reviews: 12,
    city: "Karachi",
    description:
      "Ferrari's latest hypercar masterpiece. F1 technology with road-going legality.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/9167/original/Cover.jpg?1754376500",
    backImage:
      "https://cache4.pakwheels.com/system/car_generation_pictures/9171/original/Left_Rear_View.jpg?1754376502",
  },
  {
    id: "maserati-mc20",
    name: "Maserati MC20",
    model: "2022",
    category: "Exotic",
    pricePerDay: 320000,
    fuel: "Petrol",
    transmission: "DCT",
    seats: 2,
    ac: true,
    insurance: true,
    rating: 4.9,
    reviews: 24,
    city: "Lahore",
    description:
      "Italian artistry returned. Maserati's mid-engined supercar with breathtaking design.",
    frontImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/13042/original/Cover.jpg?1768565209",
    backImage:
      "https://cache2.pakwheels.com/system/car_generation_pictures/5737/original/Maserati_MC20_2021_1000_0001.jpg?1768565206",
  },
]

// Helper utilities ---------------------------------------------------------

export function getCarById(id: string, list: Car[] = DEFAULT_CARS): Car | undefined {
  return list.find((c) => c.id === id)
}

export function getCarsByCategory(category: CarCategory, list: Car[] = DEFAULT_CARS): Car[] {
  return list.filter((c) => c.category === category)
}

export function getFeaturedCars(list: Car[] = DEFAULT_CARS): Car[] {
  return list.filter((c) => c.featured)
}

/**
 * Returns the secondary image (back / interior / side) for a car if available.
 * Used by car cards to switch image on hover.
 */
export function getSecondaryImage(car: Car): string | undefined {
  return car.backImage ?? car.interiorImage ?? car.sideImage
}

/**
 * Returns the label for the secondary image tab (Back / Interior / Side / null).
 */
export function getSecondaryLabel(car: Car): "Back" | "Interior" | "Side" | null {
  if (car.backImage) return "Back"
  if (car.interiorImage) return "Interior"
  if (car.sideImage) return "Side"
  return null
}
