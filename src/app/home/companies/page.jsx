import CompanyWrap from "@/components/wrappers/CompanyWrap";

export default function page() {
  return (
    <>
      <section className="container flex justify-center flex-col pt-6">
        <div className="flex flex-col items-center">
          <CompanyWrap />
        </div>
      </section>
    </>
  );
}
