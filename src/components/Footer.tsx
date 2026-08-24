import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-hairline mt-7.5 py-6.5 pb-15">
      <div className="mx-auto max-w-[760px] px-[18px]">
        <div className="flex gap-4 flex-wrap text-sm text-ink-faint">
          <Link href="/privacy" className="hover:text-ember">
            นโยบายความเป็นส่วนตัว
          </Link>
          <Link href="/terms" className="hover:text-ember">
            ข้อตกลงการใช้งาน
          </Link>
          <a href="mailto:contact@ghostbillboard.example" className="hover:text-ember">
            ติดต่อทีมงาน
          </a>
        </div>
        <p className="text-[13px] text-ink-faint mt-3.5 opacity-75">
          เนื้อหาทั้งหมดจัดอันดับโดยผู้ใช้ ไม่ใช่ความเห็นของทีมงาน · บิลบอร์ดผี © 2026
        </p>
      </div>
    </footer>
  );
}
