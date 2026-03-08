type MockImageProps = {
  label: string;
  tone?: "dark" | "steel" | "warm";
};

function MockImage({ label, tone = "steel" }: MockImageProps) {
  const toneClass =
    tone === "dark"
      ? "from-slate-700 via-slate-600 to-zinc-700"
      : tone === "warm"
        ? "from-amber-200 via-stone-300 to-neutral-500"
        : "from-slate-200 via-slate-400 to-slate-700";

  return (
    <div
      className={`relative h-full min-h-[260px] w-full overflow-hidden rounded-2xl bg-gradient-to-br shadow-md ${toneClass}`}
      aria-label={label}
    >
      <div className="absolute inset-0 bg-black/20" />
      <p className="absolute left-4 top-4 rounded bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700">{label}</p>
    </div>
  );
}

const reasons = [
  "เรามีแบบประตูม้วนหลายแบบให้เลือกตามหน้างานและงบประมาณในราคายุติธรรม",
  "เราเลือกใช้อุปกรณ์และวัสดุคุณภาพมาตรฐาน ติดตั้งแข็งแรง ใช้งานได้จริง",
  "ทีมช่างประสบการณ์สูง พร้อมเครื่องมือครบ งานเรียบร้อย เปิด-ปิดลื่น",
  "ติดตั้งนอกเวลาทำการได้ ลดผลกระทบต่อธุรกิจและการทำงานประจำวัน",
  "มีผลงานติดตั้งในชลบุรี ระยอง และพื้นที่ใกล้เคียงมากกว่า 10 ปี",
];

const productsAndServices = [
  "ประตูม้วนแบบมือดึง และประตูม้วนสแตนเลส",
  "ประตูม้วนแบบรอกโซ่",
  "ประตูม้วนไฟฟ้าเปิดด้วยรีโมท หรือประตูม้วนอัตโนมัติ",
];

const repairServices = [
  "แก้ไขประตูม้วน-ประตูรั้วโรงงาน เปิดไม่ขึ้น ปิดไม่ลง หรือชุดขับเสียหาย",
  "ซ่อมมอเตอร์ประตูม้วนไฟฟ้า มอเตอร์ไม่ทำงาน หรือรีโมทสั่งงานไม่ได้",
  "แก้ปัญหาเสียงดัง รางคด ฝืด ติดขัด ล็อกไม่อยู่",
  "ซ่อมประตูม้วนที่เสียหายจากการใช้งานหนักหรือการชนกระแทก",
  "ซ่อมประตูรั้วอัตโนมัติ มอเตอร์ประตูรั้ว และระบบควบคุม",
  "แปลงประตูม้วนมือดึงเป็นไฟฟ้า-รีโมท",
];

const partsServices = [
  "จำหน่ายกล่องประตูม้วน",
  "จำหน่ายมอเตอร์ประตูม้วนทุกรุ่น มีประกันสินค้า",
  "จำหน่ายอะไหล่ประตูม้วนทุกระบบ สอบถามรุ่น/ขนาดก่อนสั่งได้",
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="relative min-h-[380px] bg-gradient-to-br from-stone-400 via-neutral-600 to-slate-800 p-6 md:p-10">
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative mx-auto flex min-h-[320px] max-w-5xl flex-col items-center justify-center text-center text-white">
            <h1 className="text-3xl font-bold md:text-5xl">
              ดีเดย์ประตูม้วน คือผู้เชี่ยวชาญงานด้านประตูม้วนทุกระบบและประตูรั้วโรงงาน
            </h1>
            <p className="mt-6 max-w-4xl text-base leading-relaxed md:text-xl">
              เราติดตั้งประตูม้วนได้ทุกแบบที่ลูกค้าต้องการ เช่น ประตูม้วนไฟฟ้า-รีโมท ประตูม้วนรอกโซ่ ประตูม้วนมือดึง และงานประตูรั้วโรงงาน
              โดยเน้นงานคุณภาพ ราคาเหมาะสม และรับประกันผลงาน
            </p>
            <button
              type="button"
              className="mt-8 rounded-full bg-white px-6 py-2 text-base font-semibold text-slate-900 hover:bg-slate-100"
            >
              ติดต่อเรา
            </button>
          </div>
        </div>
      </section>

      <section className="grid items-center gap-8 border-y border-slate-200 py-8 lg:grid-cols-[1fr_42%]">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">5 เหตุผลหลัก สำหรับบริการติดตั้งประตูม้วนที่ดีจาก ดีเดย์</h2>
          <ol className="mt-5 space-y-3 pl-5 text-slate-700 md:text-lg">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ol>
        </div>
        <MockImage label="ภาพผลงานติดตั้ง (Mock)" tone="steel" />
      </section>

      <section className="border-y border-slate-200 py-10 text-center">
        <p className="text-5xl font-black tracking-tight text-blue-700">ดีเดย์</p>
        <p className="text-4xl font-black text-slate-900">ประตูม้วน</p>
        <h3 className="mt-6 text-2xl font-bold text-slate-900 md:text-4xl">
          ประตูม้วนดีมีคุณภาพ ช่างประตูม้วนดีมีฝีมือ ได้ประตูม้วนดีๆ สเปคตรงปกต้อง ดีเดย์ประตูม้วน
        </h3>
        <p className="mx-auto mt-4 max-w-4xl text-slate-700 md:text-lg">
          ต้องการติดตั้งประตูม้วน แนะนำช่างประตูม้วนบ่อวิน ชลบุรี หจก. ดีเดย์ ประตูม้วน ทะเบียนการค้า 0203551006260
        </p>
        <p className="mt-3 text-slate-800 md:text-xl">ติดต่อได้ทุกวัน</p>
        <p className="mt-2 text-lg font-semibold text-slate-900 md:text-3xl">โทร: 08-3015-1893, 08-6033-5224</p>
      </section>

      <section className="grid items-center gap-8 border-y border-slate-200 py-8 lg:grid-cols-[42%_1fr]">
        <MockImage label="ภาพสินค้าและบริการ (Mock)" tone="dark" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">สินค้าและบริการ</h2>
          <p className="mt-4 text-slate-700 md:text-lg">
            จำหน่ายและรับติดตั้งประตูเหล็กม้วน ประตูม้วนสแตนเลส โรลเลอร์ชัตเตอร์ Roller Shutter ทุกระบบ ทุกขนาด โดยทีมช่างในพื้นที่ศรีราชา
            บ่อวิน ปลวกแดง และระยอง
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 md:text-lg">
            {productsAndServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid items-center gap-8 border-y border-slate-200 py-8 lg:grid-cols-[1fr_42%]">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">
            รับซ่อมประตูม้วนทุกระบบ แก้ได้ซ่อมจบทุกปัญหาโดยช่างซ่อมประตูม้วน ศรีราชา รับประกันงานซ่อม
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 md:text-lg">
            {repairServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <MockImage label="ภาพงานซ่อม (Mock)" tone="warm" />
      </section>

      <section className="grid items-center gap-8 border-y border-slate-200 py-8 lg:grid-cols-[42%_1fr]">
        <MockImage label="ภาพอะไหล่ประตูม้วน (Mock)" tone="steel" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">จำหน่ายอะไหล่ประตูม้วนอัตโนมัติ อะไหล่ประตูม้วนไฟฟ้า</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 md:text-lg">
            {partsServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <h2 className="text-3xl font-bold text-sky-900 md:text-5xl">ทำไมต้องเลือกเรา?</h2>
        <p className="mx-auto mt-5 max-w-5xl text-slate-700 md:text-2xl">
          เพราะเราเลือกใช้วัสดุคุณภาพ ใช้งานได้ทนทาน ติดตั้งโดยช่างผู้ชำนาญมากกว่า 20 ปี
        </p>
        <p className="mx-auto mt-3 max-w-5xl text-slate-700 md:text-2xl">
          เราส่งมอบงานคุณภาพจริง ไม่ทิ้งงาน เก็บรายละเอียดครบ ตรงเวลา ในราคาที่สมเหตุสมผล
        </p>
        <p className="mx-auto mt-3 max-w-5xl text-slate-700 md:text-2xl">
          ให้บริการครอบคลุมพื้นที่: บ่อวิน, ปลวกแดง, ระยอง และพื้นที่ใกล้เคียง
        </p>
        <p className="mt-6 text-2xl font-bold text-blue-700 md:text-4xl">โทรเลย: 083-015-1893, 086-033-5224</p>
      </section>
    </div>
  );
}
