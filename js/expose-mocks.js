/* Attach mock data to window for simple page consumption without modules. 
   Load order: expose-mocks.js BEFORE script.js on every page.
   Later: replace with backend API calls and remove global mocks.
*/
window.SCIS_MOCKS = window.SCIS_MOCKS || {};
window.SCIS_MOCKS.MOCK_ITEMS = window.SCIS_MOCKS.MOCK_ITEMS || [
  { id: "ITM-001", name: "Projector Epson X200", category: "Electronics", status: "available", description: "1080p projector for classrooms", location: "AV Room" },
  { id: "ITM-002", name: "Wireless Mic Set", category: "Audio", status: "borrowed", description: "Dual handheld mics", location: "Office" },
  { id: "ITM-003", name: "Folding Chairs (20)", category: "Furniture", status: "reserved", description: "For event seating", location: "Storage A" },
  { id: "ITM-004", name: "Banner Stand", category: "Event", status: "available", description: "Adjustable stand", location: "Storage B" },
  { id: "ITM-005", name: "Megaphone", category: "Audio", status: "damaged", description: "Speaker crackle issue", location: "Office" },
  { id: "ITM-006", name: "Extension Cords (5)", category: "Electronics", status: "available", description: "3m heavy-duty", location: "Storage C" },
  { id: "ITM-007", name: "LED Lights Set", category: "Event", status: "borrowed", description: "Stage lighting kit", location: "AV Room" },
  { id: "ITM-008", name: "Pop-up Tent", category: "Event", status: "reserved", description: "Outdoor booth", location: "Storage B" },
  { id: "ITM-009", name: "Laptop (Council)", category: "Electronics", status: "available", description: "Core i5, 8GB RAM", location: "Office" },
  { id: "ITM-010", name: "Sound Mixer", category: "Audio", status: "damaged", description: "Knob loose, needs repair", location: "AV Room" },
];

window.SCIS_MOCKS.MOCK_USERS = window.SCIS_MOCKS.MOCK_USERS || [
  { id: "USR-001", name: "Andrew Santos", email: "andrew@school.edu", role: "student", course: "BSIT", year: 3 },
  { id: "USR-002", name: "Lara Mendoza", email: "lara@school.edu", role: "student", course: "BSEd", year: 2 },
  { id: "USR-003", name: "Miguel Cruz", email: "miguel@school.edu", role: "officer" },
  { id: "USR-004", name: "Priya Gomez", email: "priya@school.edu", role: "officer" },
  { id: "USR-005", name: "Admin User", email: "admin@school.edu", role: "admin" },
];

window.SCIS_MOCKS.MOCK_TRANSACTIONS = window.SCIS_MOCKS.MOCK_TRANSACTIONS || [
  { id: "TX-001", userId: "USR-001", itemId: "ITM-002", type: "borrow", status: "approved", notes: "Event rehearsal", date: "2025-11-15T09:00:00Z" },
  { id: "TX-002", userId: "USR-001", itemId: "ITM-007", type: "borrow", status: "pending", notes: "Club meeting", date: "2025-11-16T13:00:00Z" },
  { id: "TX-003", userId: "USR-002", itemId: "ITM-003", type: "reserve", status: "approved", notes: "Dept orientation", date: "2025-11-14T08:00:00Z" },
  { id: "TX-004", userId: "USR-003", itemId: "ITM-005", type: "report", status: "closed", notes: "Damage noted", date: "2025-11-10T14:00:00Z" },
];
