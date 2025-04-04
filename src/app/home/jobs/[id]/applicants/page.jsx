import ApplicantWrap from "@/components/wrappers/ApplicantWrap";

export default function page() {
  return (
    <>
      <section className="container flex justify-center flex-col pt-6">
        <div className="flex flex-col items-center">
          <ApplicantWrap />
        </div>
      </section>
    </>
  );
}
