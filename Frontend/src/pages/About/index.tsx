import React from "react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">
        About KidsCycle
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          At <strong>KidsCycle</strong>, we believe in sustainability and
          affordability. Our mission is to help parents buy and sell pre-loved
          kids' items—bicycles, tricycles, toys, and more—with ease and trust.
          Why spend more when you can recycle and reuse quality products in
          great condition?
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed">
          <li>List your gently-used kids' items for resale.</li>
          <li>We pick them up, quality-check them, and post them online.</li>
          <li>
            Customers can browse and buy verified, affordable items for their
            kids.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Our Team</h2>
        <p className="text-gray-700 leading-relaxed">
          We're a passionate team of parents, recyclers, and developers
          committed to creating a circular economy for children’s products.
        </p>
        {/* Optional: Add team cards or photos in future */}
      </section>
    </div>
  );
};

export default About;
