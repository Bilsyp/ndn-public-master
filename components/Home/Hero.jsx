import Link from "next/link";
const Hero = () => {
  return (
    <section className="flex justify-center items-center h-[90vh]">
      <div className="container mx-auto p-3   lg:mx-0 lg:max-w-[70%] ">
        <h1 className="title text-2xl font-semibold lg:text-4xl">
          Eksperimen Named Data Networking: Meningkatkan Streaming Video
        </h1>
        <p className="py-6 lg:text-xl   font-Poppins">
          Jelajahi dunia baru streaming online dengan web kami yang memanfaatkan
          Named Data Networking (NDN). Rasakan keunggulan teknologi terdepan
          dalam pengalaman streaming yang lebih cepat, handal, dan aman. Temukan
          era baru hiburan digital dengan web streaming berbasis NDN: Terhubung,
          Cepat, Tanpa Batas!
        </p>
        <Link href={"/streaming"}>
          <button className="btn">Streaming</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
