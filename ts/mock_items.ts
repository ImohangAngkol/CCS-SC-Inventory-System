export type ItemStatus = "available" | "borrowed" | "reserved" | "damaged";

export interface Item {
  id: string;
  name: string;
  category: string;
  status: ItemStatus;
  description?: string;
  location?: string;
}

export const MOCK_ITEMS: Item[] = [
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
