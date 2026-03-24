/**
 * Seed Script — เพิ่มข้อมูลตัวอย่างจาก mock data ลง database
 *
 * วิธีรัน: npx tsx prisma/seed.ts
 *
 * ข้อมูลที่จะเพิ่ม:
 * - 1 Admin user (admin / Admin@1234)
 * - 4 หมวดหมู่สินค้า (ประตูม้วน 3 + อะไหล่ 1)
 * - 2 สินค้า (ประตูม้วน 1 + อะไหล่ 1)
 * - 4 ราคาประตูม้วน (ตามขนาดและความหนา)
 * - 3 ผลงาน (portfolio)
 * - 2 ออเดอร์ตัวอย่าง พร้อมรายการสินค้า
 * - 2 คำขอซ่อม
 * - 2 ประวัติซ่อม (สำเร็จ + ยกเลิก)
 * - 2 ประวัติสั่งซื้อ (สำเร็จ + ยกเลิก)
 *
 * ใช้ upsert ทั้งหมด — รันซ้ำกี่ครั้งก็ไม่ duplicate
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 เริ่ม seed ข้อมูล...\n");

  // ==================== 0. Admin User ====================
  console.log("👤 เพิ่ม Admin User...");

  const adminExists = await prisma.user.findUnique({ where: { username: "admin" } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("Admin@1234", 12);
    await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "D-Day",
        email: "admin@d-dayengineering.com",
        phone: "0000000000",
        role: "Admin",
      },
    });
    console.log("  ✓ สร้าง admin (username: admin / password: Admin@1234)");
  } else {
    console.log("  - admin มีอยู่แล้ว ข้าม");
  }

  // ==================== 1. หมวดหมู่สินค้า ====================
  console.log("📦 เพิ่มหมวดหมู่สินค้า...");

  const cat1 = await prisma.productCategory.upsert({
    where: { id: "cat-door-electric" },
    update: { name: "ประตูม้วนแบบไฟฟ้า" },
    create: {
      id: "cat-door-electric",
      name: "ประตูม้วนแบบไฟฟ้า",
      kind: "ประตูม้วน",
      colors: ["ครีม", "ขาว", "เทาเข้ม"],
      isActive: true,
    },
  });

  const cat2 = await prisma.productCategory.upsert({
    where: { id: "cat-door-solid" },
    update: {},
    create: {
      id: "cat-door-solid",
      name: "ประตูม้วนทึบ",
      kind: "ประตูม้วน",
      colors: ["ครีม", "ขาว", "เทาเข้ม"],
      isActive: true,
    },
  });

  const cat3 = await prisma.productCategory.upsert({
    where: { id: "cat-door-ventilated" },
    update: {},
    create: {
      id: "cat-door-ventilated",
      name: "ประตูม้วนโปร่ง",
      kind: "ประตูม้วน",
      colors: ["เงิน", "ดำ"],
      isActive: true,
    },
  });

  const cat4 = await prisma.productCategory.upsert({
    where: { id: "cat-parts-motor" },
    update: {},
    create: {
      id: "cat-parts-motor",
      name: "มอเตอร์",
      kind: "อะไหล่",
      colors: [],
      isActive: true,
    },
  });

  const cat5 = await prisma.productCategory.upsert({
    where: { id: "cat-door-chain" },
    update: {},
    create: {
      id: "cat-door-chain",
      name: "ประตูม้วนแบบรอกโซ่",
      kind: "ประตูม้วน",
      colors: ["ครีม", "ขาว", "เทาเข้ม", "เงิน"],
      isActive: true,
    },
  });

  const cat6 = await prisma.productCategory.upsert({
    where: { id: "cat-door-manual" },
    update: {},
    create: {
      id: "cat-door-manual",
      name: "ประตูม้วนแบบมือดึง",
      kind: "ประตูม้วน",
      colors: ["ครีม", "ขาว", "เทาเข้ม"],
      isActive: true,
    },
  });

  console.log(`  ✓ ${cat1.name}, ${cat2.name}, ${cat3.name}, ${cat4.name}, ${cat5.name}, ${cat6.name}`);

  // ==================== 2. สินค้า ====================
  console.log("🏷️  เพิ่มสินค้า...");

  await prisma.product.upsert({
    where: { id: "prod-door-standard" },
    update: {},
    create: {
      id: "prod-door-standard",
      name: "ประตูม้วนทึบ รุ่นมาตรฐาน",
      kind: "ประตูม้วน",
      categoryId: cat2.id,
      categoryName: cat2.name,
      price: null,
      colors: ["ครีม", "ขาว"],
      description: "เหมาะสำหรับหน้าร้านทั่วไป",
      warrantyYears: "1",
      images: [],
      status: "วางขาย",
    },
  });

  await prisma.product.upsert({
    where: { id: "prod-motor-600kg" },
    update: {},
    create: {
      id: "prod-motor-600kg",
      name: "มอเตอร์ 600KG",
      kind: "อะไหล่",
      categoryId: cat4.id,
      categoryName: cat4.name,
      price: 4200,
      colors: [],
      description: "อะไหล่สำหรับประตูม้วนไฟฟ้า",
      warrantyYears: "1",
      images: [],
      status: "วางขาย",
    },
  });

  console.log("  ✓ 2 สินค้า");

  // ==================== 3. ราคาประตูม้วน ====================
  console.log("💰 เพิ่มราคาประตูม้วน...");

  const pricingData = [
    { id: "dp-solid-18", categoryId: cat2.id, categoryName: cat2.name, thickness: "1.2 mm (เบอร์ 18)", minArea: 1, maxArea: 36, pricePerSqm: 2500 },
    { id: "dp-solid-20", categoryId: cat2.id, categoryName: cat2.name, thickness: "0.9-1.0 mm (เบอร์ 20)", minArea: 1, maxArea: 20, pricePerSqm: 3000 },
    { id: "dp-ventilated-22", categoryId: cat3.id, categoryName: cat3.name, thickness: "0.6-0.7 mm (เบอร์ 22)", minArea: 1, maxArea: 36, pricePerSqm: 2000 },
    { id: "dp-electric-24", categoryId: cat1.id, categoryName: cat1.name, thickness: "0.9-1.0 mm (เบอร์ 24)", minArea: 1, maxArea: 20, pricePerSqm: 3000 },
    { id: "dp-chain-18", categoryId: cat5.id, categoryName: cat5.name, thickness: "1.2 mm (เบอร์ 18)", minArea: 1, maxArea: 36, pricePerSqm: 2200 },
    { id: "dp-chain-20", categoryId: cat5.id, categoryName: cat5.name, thickness: "0.9-1.0 mm (เบอร์ 20)", minArea: 1, maxArea: 20, pricePerSqm: 2700 },
    { id: "dp-manual-18", categoryId: cat6.id, categoryName: cat6.name, thickness: "1.2 mm (เบอร์ 18)", minArea: 1, maxArea: 36, pricePerSqm: 1800 },
    { id: "dp-manual-20", categoryId: cat6.id, categoryName: cat6.name, thickness: "0.9-1.0 mm (เบอร์ 20)", minArea: 1, maxArea: 20, pricePerSqm: 2200 },
  ];

  for (const dp of pricingData) {
    await prisma.doorPricing.upsert({ where: { id: dp.id }, update: {}, create: dp });
  }

  console.log("  ✓ 4 ราคา");

  // ==================== 4. ผลงาน (Portfolio) ====================
  console.log("🖼️  เพิ่มผลงาน...");

  const portfolioData = [
    { id: "pf-electric", title: "ประตูม้วนแบบไฟฟ้า", description: "ผลงานการประกอบประตูไฟฟ้าของโรงงาน", images: ["https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80"] },
    { id: "pf-chain", title: "ประตูม้วนแบบรอกโซ่", description: "ผลงานประกอบประตูม้วนแบบรอกโซ่", images: ["https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80"] },
    { id: "pf-storefront", title: "ประตูม้วนหน้าร้าน", description: "ติดตั้งหน้าร้านพร้อมระบบล็อกเสริม", images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"] },
  ];

  for (const pf of portfolioData) {
    await prisma.portfolio.upsert({ where: { id: pf.id }, update: {}, create: pf });
  }

  console.log("  ✓ 3 ผลงาน");

  // ==================== 5. ออเดอร์ตัวอย่าง ====================
  console.log("📋 เพิ่มออเดอร์ตัวอย่าง...");

  const order1Exists = await prisma.order.findUnique({ where: { id: "order-sample-1" } });
  if (!order1Exists) {
    await prisma.order.create({
      data: {
        id: "order-sample-1",
        firstName: "กฤติภัทร",
        lastName: "ไชยประดิษฐาน",
        phone: "0867098172",
        address: { line: "132/40", subdistrict: "บางนา", district: "เขตบางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
        totalAmount: 60000,
        status: "รอการยืนยัน",
        items: {
          create: [{
            name: "ประตูม้วนไฟฟ้า", categoryName: "ประตูม้วนทึบ", images: [], color: "ดำ",
            widthM: 5, lengthM: 5, thickness: "0.6-0.7 mm (เบอร์ 22) ขนาด 1-36 ตร.ม.",
            installOption: "ติดตั้ง", quantity: 1, pricePerUnit: 60000, warranty: "-",
          }],
        },
      },
    });
  }

  const order2Exists = await prisma.order.findUnique({ where: { id: "order-sample-2" } });
  if (!order2Exists) {
    await prisma.order.create({
      data: {
        id: "order-sample-2",
        firstName: "เทส",
        lastName: "ผู้ใช้",
        phone: "0999999998",
        address: { line: "45/1", subdistrict: "หัวหมาก", district: "เขตบางกะปิ", province: "กรุงเทพมหานคร", postalCode: "10240" },
        totalAmount: 4200,
        status: "ได้รับการยืนยัน",
        items: {
          create: [{
            name: "มอเตอร์ 600KG", categoryName: "มอเตอร์", images: [], color: "-",
            widthM: 0, lengthM: 0, thickness: "-",
            installOption: "ไม่ติดตั้ง", quantity: 1, pricePerUnit: 4200, warranty: "1 ปี",
          }],
        },
      },
    });
  }

  console.log("  ✓ 2 ออเดอร์");

  // ==================== 6. คำขอซ่อม ====================
  console.log("🔧 เพิ่มคำขอซ่อม...");

  await prisma.repairRequest.upsert({
    where: { id: "rr-sample-1" },
    update: {},
    create: {
      id: "rr-sample-1",
      username: "golf1234",
      repairType: "ซ่อมมอเตอร์",
      repairItem: "ประตูม้วนไฟฟ้า",
      detail: "มอเตอร์ไม่ทำงานหลังไฟตก",
      repairDate: "15 มี.ค. 2026",
      address: { line: "132/40", subdistrict: "บางนา", district: "เขตบางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
      images: [],
      selectedPart: "มอเตอร์ 600KG",
      warranty: "30 วัน",
      repairPrice: 1800,
      status: "รอการยืนยัน",
    },
  });

  await prisma.repairRequest.upsert({
    where: { id: "rr-sample-2" },
    update: {},
    create: {
      id: "rr-sample-2",
      username: "testuser",
      repairType: "เปลี่ยนใบประตู",
      repairItem: "ประตูม้วนทึบ",
      detail: "ใบประตูบิดงอจากแรงกระแทก",
      repairDate: "14 มี.ค. 2026",
      address: { line: "99", subdistrict: "หาดใหญ่", district: "หาดใหญ่", province: "สงขลา", postalCode: "90110" },
      images: [],
      selectedPart: "ใบประตู เบอร์ 22",
      warranty: "15 วัน",
      repairPrice: 2500,
      status: "ได้รับการยืนยัน",
    },
  });

  console.log("  ✓ 2 คำขอซ่อม");

  // ==================== 7. ประวัติซ่อม ====================
  console.log("📜 เพิ่มประวัติ...");

  await prisma.repairHistory.upsert({
    where: { id: "rh-sample-1" },
    update: {},
    create: {
      id: "rh-sample-1", username: "golf1234", images: [], repairType: "ซ่อมมอเตอร์",
      repairItem: "ประตูม้วนไฟฟ้า", detail: "มอเตอร์ไม่ทำงานหลังไฟตก", repairDate: "12 มี.ค. 2026",
      address: { line: "132/40", subdistrict: "บางนา", district: "เขตบางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
      status: "สำเร็จ", price: 2500,
    },
  });

  await prisma.repairHistory.upsert({
    where: { id: "rh-sample-2" },
    update: {},
    create: {
      id: "rh-sample-2", username: "testuser", images: [], repairType: "เปลี่ยนใบประตู",
      repairItem: "ประตูม้วนทึบ", detail: "ใบประตูบิดงอจากแรงกระแทก", repairDate: "10 มี.ค. 2026",
      address: { line: "99", subdistrict: "หาดใหญ่", district: "หาดใหญ่", province: "สงขลา", postalCode: "90110" },
      status: "ยกเลิก", price: 0,
    },
  });

  await prisma.productHistory.upsert({
    where: { id: "ph-sample-1" },
    update: {},
    create: {
      id: "ph-sample-1", firstName: "กฤติภัทร", lastName: "ไชยประดิษฐาน", phone: "0867098172",
      address: { line: "132/40", subdistrict: "บางนา", district: "เขตบางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
      items: [{ id: "ph-1-1", name: "ประตูม้วนไฟฟ้า", images: [], color: "ดำ", widthM: 5, lengthM: 5, thickness: "0.6-0.7 mm (เบอร์ 22)", installOption: "ติดตั้ง", quantity: 1, pricePerUnit: 60000, warranty: "-" }],
      totalAmount: 60000, status: "สำเร็จ", completedAt: "14 มี.ค. 2026",
    },
  });

  await prisma.productHistory.upsert({
    where: { id: "ph-sample-2" },
    update: {},
    create: {
      id: "ph-sample-2", firstName: "เทส", lastName: "ผู้ใช้", phone: "0999999998",
      address: { line: "45/1", subdistrict: "หัวหมาก", district: "เขตบางกะปิ", province: "กรุงเทพมหานคร", postalCode: "10240" },
      items: [{ id: "ph-2-1", name: "มอเตอร์ 600KG", images: [], color: "-", widthM: 0, lengthM: 0, thickness: "-", installOption: "ไม่ติดตั้ง", quantity: 1, pricePerUnit: 4200, warranty: "1 ปี" }],
      totalAmount: 4200, status: "ยกเลิก", completedAt: "11 มี.ค. 2026",
    },
  });

  console.log("  ✓ 2 ประวัติซ่อม + 2 ประวัติสั่งซื้อ");

  console.log("\n✅ Seed เสร็จสมบูรณ์!");
}

main()
  .catch((e) => {
    console.error("❌ Seed ล้มเหลว:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
