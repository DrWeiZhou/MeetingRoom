import { Atom, CalendarDots, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[100dvh] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#102c27] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-2 top-48 h-48 w-48 rounded-full border border-[#55b7a5]/30" />
        <div className="relative flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10"><Atom size={25} /></span><span className="text-sm font-semibold tracking-wide">具身智能与机器人研究院</span></div>
        <div className="relative max-w-xl">
          <p className="mb-5 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.22em] text-[#83cabb]">SPACE / TIME / COLLABORATION</p>
          <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.045em] xl:text-6xl">让每一次讨论，<br />准时发生。</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#b6ccc7]">统一查看会议室占用情况，按半小时精确预约，让研究协作更顺畅。</p>
        </div>
        <div className="relative flex gap-8 text-sm text-[#a9c0bb]"><span className="flex items-center gap-2"><CalendarDots size={18} />周一至周日</span><span className="flex items-center gap-2"><ShieldCheck size={18} />冲突自动校验</span></div>
      </section>
      <section className="flex min-h-[100dvh] items-center px-4 py-10 sm:px-8 lg:px-16">{children}</section>
    </main>
  );
}
