import type { PortfolioFormState, PortfolioItem } from "./types";

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: "PF-001",
    title: "ประตูม้วนแบบไฟฟ้า",
    description: "ผลงานการประกอบประตูไฟฟ้าของโรงงาน",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    updatedAt: "14 มี.ค. 2026",
  },
  {
    id: "PF-002",
    title: "ประตูม้วนแบบรอกโซ่",
    description: "ผลงานประกอบประตูม้วนแบบรอกโซ่",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    updatedAt: "12 มี.ค. 2026",
  },
  {
    id: "PF-003",
    title: "ประตูม้วนหน้าร้าน",
    description: "ติดตั้งหน้าร้านพร้อมระบบล็อกเสริม",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    updatedAt: "10 มี.ค. 2026",
  },
  {
    id: "PF-004",
    title: "ประตูม้วนคลังสินค้า",
    description: "ติดตั้งสำหรับพื้นที่ใช้งานหนัก",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    updatedAt: "09 มี.ค. 2026",
  },
  {
    id: "PF-005",
    title: "ประตูม้วนโครงการใหม่",
    description: "งานติดตั้งไซต์งานก่อสร้างใหม่",
    image: "https://images.unsplash.com/photo-1556156653-e5a7676f271d?auto=format&fit=crop&w=800&q=80",
    updatedAt: "08 มี.ค. 2026",
  },
];

export const emptyPortfolioForm: PortfolioFormState = {
  title: "",
  description: "",
  images: [],
};
