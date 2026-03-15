/**
 * Seed อะไหล่ — เพิ่มหมวดหมู่อะไหล่ + สินค้าอะไหล่ตัวอย่างลง database
 * วิธีรัน: npx tsx prisma/seed-parts.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const partsCategories = [
  { id: "cat-parts-sheet", name: "แผ่นประตูม้วน" },
  { id: "cat-parts-rail", name: "เสารางประตูม้วน" },
  { id: "cat-parts-shaft", name: "แกนเพลาประตูม้วน" },
  { id: "cat-parts-box", name: "กล่องเก็บม้วนประตู" },
  { id: "cat-parts-lock", name: "ตัวล็อกประตูม้วน" },
  { id: "cat-parts-key", name: "กุญแจประตูม้วน" },
  { id: "cat-parts-pulley", name: "รอกโซ่ประตูม้วน" },
  { id: "cat-parts-gear", name: "ชุดเฟืองโซ่ประตูม้วน" },
  { id: "cat-parts-chain", name: "โซ่ประตูม้วน" },
  { id: "cat-parts-chainlock", name: "ตัวล็อคโซ่สาว" },
  // "มอเตอร์" มีอยู่แล้วจาก seed หลัก (cat-parts-motor)
  { id: "cat-parts-switch", name: "สวิตช์กดควบคุม" },
  { id: "cat-parts-other", name: "อื่นๆ" },
];

const partsProducts = [
  { id: "prod-key", name: "กุญแจประตูม้วน", catId: "cat-parts-key", price: 150, desc: "กุญแจสำหรับปลดล็อกและล็อกประตูม้วน เพื่อเพิ่มความปลอดภัย" },
  { id: "prod-pulley", name: "รอกโซ่ประตูม้วน รุ่น 1.5 ตัน", catId: "cat-parts-pulley", price: 8000, desc: "รอกที่ช่วยทดแรงในการดึงโซ่เพื่อยกหรือปิดประตูม้วน" },
  { id: "prod-sheet", name: "แผ่นประตูม้วน", catId: "cat-parts-sheet", price: 60, desc: "แผ่นโลหะที่ใช้เป็นตัวเปิด-ปิด ช่วยกันฝุ่น ลม และความร้อน" },
  { id: "prod-rail", name: "เสารางประตูม้วน", catId: "cat-parts-rail", price: 500, desc: "รางนำทางที่ช่วยให้แผ่นประตูม้วนเลื่อนขึ้น-ลงได้อย่างราบรื่น" },
  { id: "prod-motor-set", name: "ชุดมอเตอร์ประตูม้วน", catId: "cat-parts-motor", price: 4900, desc: "มอเตอร์สำหรับระบบเปิด-ปิดอัตโนมัติ รองรับงานหนัก" },
  { id: "prod-gear", name: "ชุดเฟืองโซ่ประตูม้วน", catId: "cat-parts-gear", price: 1200, desc: "ชุดเฟืองและโซ่สำหรับส่งกำลังในการยกบานประตู" },
  { id: "prod-switch", name: "สวิตช์กดควบคุม", catId: "cat-parts-switch", price: 650, desc: "สวิตช์ควบคุมการเปิด-ปิดมอเตอร์แบบกดขึ้นลง" },
  { id: "prod-shaft", name: "แกนเพลาประตูม้วน", catId: "cat-parts-shaft", price: 2300, desc: "แกนรับน้ำหนักหลักของชุดประตู เพิ่มความมั่นคงในการหมุน" },
];

async function main() {
  console.log("🔩 เริ่ม seed หมวดหมู่อะไหล่ + สินค้า...\n");

  // 1. หมวดหมู่อะไหล่
  console.log("📦 เพิ่มหมวดหมู่อะไหล่...");
  for (const cat of partsCategories) {
    await prisma.productCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        kind: "อะไหล่",
        colors: [],
        isActive: true,
      },
    });
    console.log(`  ✓ ${cat.name}`);
  }

  // 2. สินค้าอะไหล่
  console.log("\n🏷️  เพิ่มสินค้าอะไหล่...");
  for (const prod of partsProducts) {
    const cat = partsCategories.find((c) => c.id === prod.catId);
    const catName = cat?.name ?? "มอเตอร์"; // fallback for motor which is from main seed

    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: {
        id: prod.id,
        name: prod.name,
        kind: "อะไหล่",
        categoryId: prod.catId,
        categoryName: catName,
        price: prod.price,
        colors: [],
        description: prod.desc,
        warrantyYears: "1",
        images: [],
        status: "วางขาย",
      },
    });
    console.log(`  ✓ ${prod.name} (${prod.price.toLocaleString()} บาท)`);
  }

  console.log("\n✅ Seed อะไหล่เสร็จสมบูรณ์!");
}

main()
  .catch((e) => {
    console.error("❌ Seed ล้มเหลว:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
