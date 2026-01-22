"use client";
import Logo from "../../components/Logo";
import ContactForm from "../../components/ContactForm";

export default function AboutPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          {/* Header with Logo */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <Logo className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-tertiary mb-2">
                The UnOfficial
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                Serious Fans, UnSerious Takes
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-primary dark:text-tertiary mb-4">
              About Us
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Stop me if you've heard this one. We started as a hot take over a
              cold beer at our local bar. That take then took over the night.
              Then, in the group thread, it took over the week. Now, a few years
              later, it's taken over it's own platform.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              That's the origin story of The UnOfficial - a few jabroni's, a
              love of basketball, and literally no other qualifications.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              On our platform, we hope you'll find anything from the spiciest of
              takes on what it means to be a "modern day NBA super-star", to the
              more vanilla stories on what makes the greats so great. And
              hopefully, you'll find something in-between.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              If any of what you read hear sparks you to share it with your
              friends, kick off your own group thread hot takes, or maybe even
              reach out to us to put your own thought up on the plaftorm, than
              we accomplished what we set out to do.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Welcome, to The UnOfficial!
            </p>
          </div>
        </div>
      </div>
      {/* Call to action and contact form for interested writers */}
      <section className="mt-16 mb-8 p-6 bg-tertiary/10 dark:bg-tertiary/20 rounded-lg border border-tertiary/20 dark:border-tertiary/30 max-w-2xl mx-auto">
        {/* <h2 className="text-2xl font-bold mb-2 text-tertiary">
          Interested in sharing your thoughts here too?
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Get in touch and we'll see if we're a good fit for you to post your
          own UnOfficial takes!
        </p> */}
        {/* <ContactForm /> */}
      </section>
    </>
  );
}
