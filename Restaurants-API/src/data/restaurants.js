const restaurants = [

    // =====================================================
    // 🇪🇬 EGYPTIAN
    // =====================================================

    {
        name: "Abou El Sid",
        address: "157 26th of July Corridor, Zamalek, Cairo",
        area: "Zamalek",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        rating: 3.8,
        ratingCount: 7336,
        location: {
            type: "Point",
            coordinates: [31.22417, 30.05946]
        }
    },

    {
        name: "Felfela",
        address: "15 Hoda Shaarawy, Downtown Cairo",
        area: "Downtown",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        rating: 3.6,
        ratingCount: 2098,
        location: {
            type: "Point",
            coordinates: [31.2381, 30.0465]
        }
    },

    {
        name: "Koshary Abou Tarek",
        address: "16 Marouf, Downtown Cairo",
        area: "Downtown",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        rating: 4.3,
        ratingCount: 43475,
        location: {
            type: "Point",
            coordinates: [31.23773, 30.05025]
        }
    },

    {
        name: "Zooba",
        address: "Zamalek, Cairo",
        area: "Zamalek",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        rating: 4.2,
        ratingCount: 6806,
        location: {
            type: "Point",
            coordinates: [31.218, 30.063]
        }
    },

    {
        name: "Khufu's",
        address: "Mena House, Giza",
        area: "Giza",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        rating: 4.8,
        ratingCount: 3000,
        location: {
            type: "Point",
            coordinates: [31.1342, 29.9765]
        }
    },

    {
        name: "Zitouni",
        address: "Four Seasons Nile Plaza, Garden City, Cairo",
        area: "Garden City",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        rating: 4.6,
        ratingCount: 1330,
        location: {
            type: "Point",
            coordinates: [31.229, 30.035]
        }
    },

    {
        name: "Fasahet Somaya",
        address: "59 Al Falki, Cairo",
        area: "Downtown",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        rating: 4.4,
        ratingCount: 1181,
        location: {
            type: "Point",
            coordinates: [31.238, 30.044]
        }
    },

    {
        name: "Andrea El Mariouteya",
        address: "Mariouteya Road, Giza",
        area: "Mariouteya",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        rating: 4.2,
        ratingCount: 6000,
        location: {
            type: "Point",
            coordinates: [31.02, 30.0]
        }
    },

    {
        name: "Oldish",
        address: "20 Mohammed Mahmoud, Downtown Cairo",
        area: "Downtown",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        rating: 4.3,
        ratingCount: 7744,
        location: {
            type: "Point",
            coordinates: [31.236, 30.044]
        }
    },

    {
        name: "Eish + Malh",
        address: "20 Adly Street, Abdeen, Cairo",
        area: "Abdeen",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        rating: 4.0,
        ratingCount: 6053,
        location: {
            type: "Point",
            coordinates: [31.2437, 30.05102]
        }
    },

    {
        name: "Kazaz Restaurant",
        address: "Downtown Cairo",
        area: "Downtown",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        rating: 4.1,
        ratingCount: 2500,
        location: {
            type: "Point",
            coordinates: [31.240, 30.050]
        }
    },

    {
        name: "Naguib Mahfouz Cafe",
        address: "Khan El Khalili, Cairo",
        area: "Khan El Khalili",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
        rating: 4.2,
        ratingCount: 3500,
        location: {
            type: "Point",
            coordinates: [31.262, 30.047]
        }
    },

    {
        name: "El Prince",
        address: "Imbaba, Giza",
        area: "Imbaba",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
        rating: 4.4,
        ratingCount: 5000,
        location: {
            type: "Point",
            coordinates: [31.207, 30.076]
        }
    },

    {
        name: "Al Khal Egyptian Restaurant",
        address: "Heliopolis, Cairo",
        area: "Heliopolis",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        rating: 4.8,
        ratingCount: 2439,
        location: {
            type: "Point",
            coordinates: [31.34804, 30.07241]
        }
    },

    {
        name: "Sequoia",
        address: "Abu El Feda, Zamalek, Cairo",
        area: "Zamalek",
        cuisine: "Egyptian",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        rating: 4.3,
        ratingCount: 5000,
        location: {
            type: "Point",
            coordinates: [31.222, 30.068]
        }
    },

    // =====================================================
    // 🍣 JAPANESE
    // =====================================================

    {
        name: "Kazoku",
        address: "Swan Lake, New Cairo",
        area: "New Cairo",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        rating: 4.6,
        ratingCount: 2869,
        location: {
            type: "Point",
            coordinates: [31.43711, 30.06122]
        }
    },

    {
        name: "SACHI Heliopolis",
        address: "3 Cleopatra Street, Heliopolis, Cairo",
        area: "Heliopolis",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
        rating: 4.6,
        ratingCount: 1801,
        location: {
            type: "Point",
            coordinates: [31.319, 30.09]
        }
    },

    {
        name: "Makino Japanese Restaurant",
        address: "21 Mohammed Mazhar, Zamalek",
        area: "Zamalek",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
        rating: 4.3,
        ratingCount: 459,
        location: {
            type: "Point",
            coordinates: [31.22231, 30.06752]
        }
    },

    {
        name: "Mori Sushi",
        address: "Zamalek, Cairo",
        area: "Zamalek",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1563612116625-3012372fccce",
        rating: 4.7,
        ratingCount: 2529,
        location: {
            type: "Point",
            coordinates: [31.221, 30.068]
        }
    },

    {
        name: "Sapporo Japanese Restaurant",
        address: "Dokki, Giza",
        area: "Dokki",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d",
        rating: 4.8,
        ratingCount: 999,
        location: {
            type: "Point",
            coordinates: [31.211, 30.043]
        }
    },

    {
        name: "Reif Kushiyaki",
        address: "New Cairo, Cairo",
        area: "New Cairo",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1535007813616-35a984a3b9a8",
        rating: 4.7,
        ratingCount: 2500,
        location: {
            type: "Point",
            coordinates: [31.470, 30.020]
        }
    },

    {
        name: "ARIGATO Sushi",
        address: "22A Taha Hussein, Zamalek",
        area: "Zamalek",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1564489563601-c53cfc451e93",
        rating: 4.4,
        ratingCount: 842,
        location: {
            type: "Point",
            coordinates: [31.2195, 30.0677]
        }
    },

    {
        name: "Ginger Asian Restaurant",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Japanese",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252",
        rating: 4.9,
        ratingCount: 835,
        location: {
            type: "Point",
            coordinates: [29.950, 31.240]
        }
    },

    // =====================================================
    // 🍕 ITALIAN
    // =====================================================

    {
        name: "Pier 88",
        address: "19 Saray El Gezira, Zamalek",
        area: "Zamalek",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
        rating: 4.4,
        ratingCount: 2663,
        location: {
            type: "Point",
            coordinates: [31.222, 30.061]
        }
    },

    {
        name: "La Zisa",
        address: "Nile Corniche, Cairo",
        area: "Garden City",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1579684947550-22e945225d9a",
        rating: 4.5,
        ratingCount: 176,
        location: {
            type: "Point",
            coordinates: [31.230, 30.035]
        }
    },

    {
        name: "Pepenero",
        address: "Heliopolis, Cairo",
        area: "Heliopolis",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
        rating: 4.5,
        ratingCount: 2668,
        location: {
            type: "Point",
            coordinates: [31.320, 30.088]
        }
    },

    {
        name: "Bullona",
        address: "Garden City, Cairo",
        area: "Garden City",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
        rating: 4.7,
        ratingCount: 1000,
        location: {
            type: "Point",
            coordinates: [31.232, 30.040]
        }
    },

    {
        name: "O's Pasta",
        address: "26 July Street, Zamalek",
        area: "Zamalek",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0",
        rating: 4.4,
        ratingCount: 2987,
        location: {
            type: "Point",
            coordinates: [31.220, 30.067]
        }
    },

    {
        name: "Vivo",
        address: "The Ritz-Carlton Cairo",
        area: "Garden City",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
        rating: 4.5,
        ratingCount: 1000,
        location: {
            type: "Point",
            coordinates: [31.230, 30.040]
        }
    },

    {
        name: "Roberto's Italian Restaurant",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Italian",
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
        rating: 4.8,
        ratingCount: 597,
        location: {
            type: "Point",
            coordinates: [29.915, 31.200]
        }
    },

    // =====================================================
    // 🥩 GRILL / STEAK
    // =====================================================

    {
        name: "Crimson Bar & Grill",
        address: "16 Kamal El Tawil, Zamalek",
        area: "Zamalek",
        cuisine: "Grill / Steak",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947",
        rating: 4.4,
        ratingCount: 4376,
        location: {
            type: "Point",
            coordinates: [31.22242, 30.07072]
        }
    },

    {
        name: "The Grill",
        address: "Semiramis InterContinental, Cairo",
        area: "Garden City",
        cuisine: "French / Steak",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
        rating: 4.7,
        ratingCount: 938,
        location: {
            type: "Point",
            coordinates: [31.230, 30.035]
        }
    },

    {
        name: "Mizo",
        address: "New Cairo",
        area: "New Cairo",
        cuisine: "Grill / Steak",
        image: "https://images.unsplash.com/photo-1558030006-450675393462",
        rating: 4.5,
        ratingCount: 1500,
        location: {
            type: "Point",
            coordinates: [31.470, 30.020]
        }
    },

    {
        name: "Butcher's Burger",
        address: "New Cairo",
        area: "New Cairo",
        cuisine: "Grill / Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        rating: 4.4,
        ratingCount: 3000,
        location: {
            type: "Point",
            coordinates: [31.470, 30.020]
        }
    },

    {
        name: "Andrea Mariouteya",
        address: "Mariouteya, Giza",
        area: "Mariouteya",
        cuisine: "Grill",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        rating: 4.2,
        ratingCount: 6026,
        location: {
            type: "Point",
            coordinates: [31.020, 30.000]
        }
    },

    {
        name: "Balbaa Village",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Grill / Seafood",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        rating: 4.2,
        ratingCount: 810,
        location: {
            type: "Point",
            coordinates: [29.940, 31.200]
        }
    },

    {
        name: "Kazoku Grill",
        address: "New Cairo",
        area: "New Cairo",
        cuisine: "Grill",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947",
        rating: 4.5,
        ratingCount: 900,
        location: {
            type: "Point",
            coordinates: [31.437, 30.061]
        }
    },

    // =====================================================
    // 🦐 SEAFOOD
    // =====================================================

    {
        name: "Santorini Greek Restaurant",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        rating: 4.9,
        ratingCount: 1237,
        location: {
            type: "Point",
            coordinates: [29.954, 31.215]
        }
    },

    {
        name: "Branzino",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44",
        rating: 4.4,
        ratingCount: 117,
        location: {
            type: "Point",
            coordinates: [29.950, 31.210]
        }
    },

    {
        name: "White & Blue",
        address: "Greek Nautical Club, Alexandria",
        area: "Alexandria",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
        rating: 4.1,
        ratingCount: 886,
        location: {
            type: "Point",
            coordinates: [29.887, 31.216]
        }
    },

    {
        name: "Fish Market",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        rating: 4.0,
        ratingCount: 674,
        location: {
            type: "Point",
            coordinates: [29.890, 31.215]
        }
    },

    {
        name: "Zephyrion",
        address: "Abu Qir, Alexandria",
        area: "Abu Qir",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
        rating: 4.0,
        ratingCount: 83,
        location: {
            type: "Point",
            coordinates: [30.080, 31.320]
        }
    },

    {
        name: "Farag Fish",
        address: "Alexandria",
        area: "Alexandria",
        cuisine: "Seafood",
        image: "https://images.unsplash.com/photo-1534482421-64566f976cfa",
        rating: 4.4,
        ratingCount: 64,
        location: {
            type: "Point",
            coordinates: [29.950, 31.200]
        }
    },

    // =====================================================
    // 🌍 INTERNATIONAL
    // =====================================================

    {
        name: "Taboula",
        address: "1 Latin America Street, Cairo",
        area: "Garden City",
        cuisine: "Lebanese",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554",
        rating: 4.2,
        ratingCount: 3564,
        location: {
            type: "Point",
            coordinates: [31.233, 30.041]
        }
    },

    {
        name: "Dahabiya Cairo",
        address: "106 Nile Street, Dokki, Giza",
        area: "Dokki",
        cuisine: "International",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        rating: 4.8,
        ratingCount: 1489,
        location: {
            type: "Point",
            coordinates: [31.214, 30.040]
        }
    },

    {
        name: "La Terrace",
        address: "22 Taha Hussein, Zamalek",
        area: "Zamalek",
        cuisine: "International",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        rating: 4.6,
        ratingCount: 1450,
        location: {
            type: "Point",
            coordinates: [31.2195, 30.0677]
        }
    },

    {
        name: "Le Pacha 1901",
        address: "Zamalek, Cairo",
        area: "Zamalek",
        cuisine: "International",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        rating: 4.3,
        ratingCount: 7250,
        location: {
            type: "Point",
            coordinates: [31.222, 30.061]
        }
    },

    {
        name: "Old Cairo Restaurant",
        address: "Old Cairo",
        area: "Old Cairo",
        cuisine: "International",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        rating: 4.5,
        ratingCount: 668,
        location: {
            type: "Point",
            coordinates: [31.230, 30.010]
        }
    },

    {
        name: "Gingko",
        address: "Nile City, Cairo",
        area: "Nile City",
        cuisine: "Asian / International",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        rating: 4.7,
        ratingCount: 319,
        location: {
            type: "Point",
            coordinates: [31.225, 30.070]
        }
    },

    {
        name: "Sky View Restaurant",
        address: "Le Metropole Hotel, Alexandria",
        area: "Alexandria",
        cuisine: "International",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
        rating: 4.9,
        ratingCount: 1354,
        location: {
            type: "Point",
            coordinates: [29.885, 31.200]
        }
    }

];

module.exports = restaurants;