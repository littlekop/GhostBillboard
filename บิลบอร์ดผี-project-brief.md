# บิลบอร์ดผี — Project Brief

**เป้าหมาย**: เว็บ UGC จัดอันดับเรื่องผีที่หลอนที่สุดในไทย ผู้ใช้วางลิงก์ YouTube → โหวต → ดูชาร์ต Top 10 พร้อมเล่นวิดีโอในหน้าเว็บได้เลย โมเดลรายได้หลักคือ AdSense จึงเน้น SEO เป็นสำคัญ

**ไฟล์อ้างอิง UI/UX ที่ทำไว้แล้ว**: `ghost-billboard-prototype.jsx` (React prototype รันได้ในเบราว์เซอร์ทันที ใช้เป็นต้นแบบดีไซน์/ฟีเจอร์ทั้งหมด — **ไม่ใช่โค้ด production**, เขียนด้วย inline `<style>` และ mock data ทั้งหมด)

---

## งานหลักที่ต้องทำ

### 1. ย้ายจาก single-file React ไปเป็น Next.js (สำคัญที่สุด)
เหตุผล: prototype ปัจจุบัน render ด้วย JavaScript ล้วนในเบราว์เซอร์ Google มองไม่เห็นเนื้อหา ไม่มี URL จริงต่อเรื่อง กระทบ SEO และคุณภาพบัญชี AdSense โดยตรง

ต้องมี:
- Route จริงต่อเรื่อง: `/story/[slug]-[id]` render เป็น HTML เต็มตั้งแต่ request แรก (SSR หรือ ISR)
- `<title>`, meta description, Open Graph image **แยกตามแต่ละเรื่อง** (สำคัญทั้ง SEO และตอนแชร์ลิงก์ไป LINE/Facebook/X)
- Structured data (JSON-LD) แบบ `VideoObject` / `ItemList` ให้มีโอกาสได้ rich snippet
- `sitemap.xml` (อัปเดตอัตโนมัติเมื่อมีเรื่องใหม่) และ `robots.txt`
- คุม Core Web Vitals ให้ดี — เอฟเฟกต์หลอนๆ (embers, glitch, static burst) ที่ใส่ไว้ต้องไม่ทำ PageSpeed ตกจนกระทบอันดับค้นหา

### 2. ต่อ Supabase (Postgres) จริง
แทน mock data ใน prototype ปัจจุบัน

**Schema ที่ตกลงกันไว้:**
```sql
create table stories (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null unique,
  title text not null,
  thumbnail_url text,
  channel_name text,
  category text,
  device_id text,
  vote_count int default 0,
  vote_sum int default 0,
  created_at timestamptz default now()
);

create table votes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories(id),
  device_id text not null,
  score int default 1,
  created_at timestamptz default now(),
  unique (story_id, device_id) -- กันโหวตซ้ำระดับ DB
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories(id),
  reason text,
  reporter_id text,
  created_at timestamptz default now()
);
```

**หลักการที่ตกลงกันไว้:**
- Voter identity: anonymous device fingerprint (ไม่บังคับ login) — เก็บ device_id ฝั่ง client
- Duplicate video check: เช็กจาก `youtube_id` ก่อนบันทึก ถ้ามีอยู่แล้วให้โหวตเรื่องเดิมแทนการสร้างใหม่ (unique constraint ที่ DB เป็นตัวกัน race condition ตัวจริง ฝั่ง frontend เช็กเบื้องต้นเท่านั้น)
- Ranking: เรียงตาม `vote_count`/`vote_sum` ตรงๆ ไม่ใช้ time-decay algorithm
- Time-range filter: "วันนี้ / สัปดาห์นี้ / ตลอดกาล" กรองจาก `created_at`
- แท็บ "ล่าสุด" แยกจากแท็บ "หลอนที่สุด" — เรียงตาม `created_at` แทนคะแนนโหวต

### 3. Realtime สำหรับยอดผู้ชม + แชท
ตอนนี้ใน prototype เป็นแค่ local state จำลอง (ตัวเลขสุ่ม, แชทไม่ sync ข้ามคน)

ของจริงต้องมี:
- Supabase Realtime channel ต่อวิดีโอ — คนที่ดูคลิปเดียวกันอยู่ห้องเดียวกัน เห็นแชท/ยอดคนตรงกัน
- Anonymous session id (ไม่บังคับ login) เก็บใน browser storage
- Moderation เบื้องต้น: filter คำหยาบ + กันสแปมข้อความรัว (แชทไม่ล็อกอินมักโดนป่วนง่าย)
- ถ้าจะประหยัด effort ก่อนได้: ใช้ polling ทุก 2-3 วินาทีแทน WebSocket ไปก่อนก็พอสำหรับ MVP

### 4. YouTube Embed Player
- ใช้ YouTube iframe embed (`youtube.com/embed/{videoId}?autoplay=1&rel=0`) เล่นในหน้าเว็บเลย ไม่ออกไป YouTube
- **ต้อง handle กรณีคลิปตั้งค่าห้าม embed** (`embeddable: false`) — ให้ fallback เป็นปุ่ม "ดูใน YouTube" แทนถ้า embed ใช้ไม่ได้
- แสดงข้อมูลคลิป (title, thumbnail, channel) ผ่าน YouTube oEmbed API ตอน submit ลิงก์ใหม่

---

## ฟีเจอร์ที่ทำ UI ไว้แล้วใน prototype (ยกไปต่อได้เลย)
- หน้าแรก: hero + ช่องวางลิงก์ YouTube + preview ก่อนส่งเข้าชาร์ต
- กันลิงก์ซ้ำ: เช็กจาก YouTube video ID ถ้ามีอยู่แล้วให้ปุ่มเปลี่ยนเป็น "โหวตให้เรื่องนี้แทน"
- ชาร์ต Top 10 (อันดับ 1-3 แบบ featured, 4-10 แบบลิสต์)
- แท็บ "หลอนที่สุด" / "ล่าสุด" + แท็บช่วงเวลา วันนี้/สัปดาห์นี้/ตลอดกาล
- Modal เล่นวิดีโอ พร้อมยอด "ร่วมฟังพร้อมกัน X คน" และช่องแชท (ไม่ต้อง login)
- ปุ่มแชร์ (LINE / Facebook / X / คัดลอกลิงก์) และปุ่มแจ้งปัญหา (🚩 ลิงก์เสีย / เนื้อหาไม่เหมาะสม / อื่นๆ)
- พื้นที่โฆษณา 3 จุด (แบนเนอร์ใต้ hero, nativeในฟีด, ท้ายหน้า) — ใส่ dashed placeholder ไว้ รอแปะโค้ด AdSense จริง
- แถวสินค้า affiliate 3 จุด (ตอนนี้เป็น mock, ต้องเปลี่ยน URL เป็น affiliate link จริงจาก Involve Asia/ACCESSTRADE)
- ปุ่มลอย "เลี้ยงกาแฟแอดมิน" ลิงก์ tip.me (ต้องใส่ username จริง)
- หน้านโยบายความเป็นส่วนตัว + ข้อตกลงการใช้งาน (โครงร่างพื้นฐานตาม PDPA — ต้องใส่อีเมลติดต่อจริงก่อนเผยแพร่)
- ธีม: โปสเตอร์หนังผีไทยเก่า/สมุดข่าวลึกลับ — ฟอนต์ Trirong (หัวข้อ) + Sarabun (เนื้อหา), โทนดำอมน้ำตาลไหม้ + แดงเลือด + ส้มไฟ, เอฟเฟกต์ embers ลอย, ตาเรืองแสงโผล่วาบๆ, เลือดหยดใน hero, static burst เป็นระยะ — ทั้งหมด respect `prefers-reduced-motion`

## ยังไม่ได้ทำ / รอตัดสินใจ
- ช่องแนะนำ "The Ghost Radio" และ "The Shock" — **ยังไม่ได้ขออนุญาตใช้ชื่อ/โลโก้อย่างเป็นทางการ** ต้องติดต่อก่อนถ้าจะใช้ branding ตรงๆ ตอนนี้ prototype ใส่แค่ชื่อ+คำอธิบายทั่วไป
- ยังไม่มีระบบ moderation/ban สำหรับคนโหวตปั่นหรือส่งลิงก์สแปม
- Analytics (Google Analytics / Plausible) ยังไม่ได้ต่อ

## Deploy
- ผู้ใช้มี Vercel connector พร้อมใช้งานอยู่แล้ว — deploy ผ่าน Vercel ได้เลยหลังโปรเจกต์พร้อม
