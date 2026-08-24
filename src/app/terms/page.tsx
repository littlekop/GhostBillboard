import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "ข้อตกลงการใช้งาน" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-[18px] py-8 flex-1">
        <h1 className="font-display font-bold text-2xl mb-4">ข้อตกลงการใช้งาน</h1>
        <div className="space-y-3 text-ink-dim text-sm leading-relaxed">
          <p>ห้ามส่งลิงก์ที่มีเนื้อหาผิดกฎหมาย ละเมิดลิขสิทธิ์ หรือไม่เหมาะสม</p>
          <p>
            ทีมงานมีสิทธิ์ลบเรื่องหรือระงับการโหวตที่ผิดปกติ (เช่น ปั่นโหวตด้วยบอท)
            โดยไม่ต้องแจ้งล่วงหน้า
          </p>
          <p>เนื้อหาทั้งหมดเป็นความคิดเห็น/การจัดอันดับจากผู้ใช้ ไม่ใช่ความเห็นของทีมงาน</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
