import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "นโยบายความเป็นส่วนตัว" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-[18px] py-8 flex-1">
        <h1 className="font-display font-bold text-2xl mb-4">นโยบายความเป็นส่วนตัว</h1>
        <div className="space-y-3 text-ink-dim text-sm leading-relaxed">
          <p>
            เว็บนี้เก็บรหัสอุปกรณ์แบบไม่ระบุตัวตน (device fingerprint) ไว้ในเบราว์เซอร์ของคุณ
            เพื่อป้องกันการโหวตซ้ำเท่านั้น ไม่เก็บชื่อ อีเมล หรือข้อมูลที่ระบุตัวตนได้
            เว้นแต่คุณกรอกเอง เช่น ข้อความในแชท
          </p>
          <p>ข้อมูลโหวตและแชทอาจแสดงต่อผู้ใช้คนอื่นแบบไม่ระบุตัวตน (ใช้ชื่อสุ่ม)</p>
          <p>
            {/* TODO: replace with the real contact email before launch (project brief section 3). */}
            หากต้องการให้ลบข้อมูลที่เกี่ยวข้องกับคุณ ติดต่อได้ที่
            contact@ghostbillboard.example
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
