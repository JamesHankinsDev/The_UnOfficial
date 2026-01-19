"use client";
import Logo from "../../components/Logo";

export default function AboutPage() {
  return (
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
              Where Stories Come Alive
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary dark:text-tertiary mb-4">
            About Us
          </h2>
          
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            <strong>The UnOfficial</strong> started the way most good NBA conversations start: 
            three friends, an opinion, and a "wait, but if you look at the numbers…" spiral that 
            lasts way too long. We're not reporters. We're not insiders. We're fans — the kind who 
            watch way too much ball, care about lineup tweaks in February, and will absolutely talk 
            ourselves into a bench guy if the on/off numbers are spicy enough.
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            No suits. No hot-take factories. Just hoops — discussed like it's a group chat with 
            a stats tab open and just enough knowledge to sound compelling.
          </p>

          <h3 className="text-xl font-semibold text-primary dark:text-tertiary mb-3 mt-8">
            What We're About
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-tertiary mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  We take basketball seriously — not ourselves
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Expect thoughtful analysis without the pretense. We love the league's biggest 
                  narratives and the weird little role-player storylines that make the season fun.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-tertiary mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Stats support the story, they don't replace it
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Data-driven breakdowns that treat basketball like the culture it is. We use 
                  numbers to explain why something felt real before it showed up in the standings.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-tertiary mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Optimistic NBA writing (even when we're frustrated)
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We celebrate the league and bring honest, thoughtful takes without the doom-scrolling. 
                  A little chaos, because the NBA is chaos — and that's the point.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-tertiary mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Real fans, real talk
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  We write like real fans talk — with honesty, humor, and a few running inside jokes. 
                  Think of it as your group chat on a Tuesday night, but with better formatting.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-primary dark:text-tertiary mb-3 mt-8">
            Our Promise
          </h3>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We'll bring effort, curiosity, and fun — and we'll never pretend we're above the madness. 
            Our basketball logo isn't just a design; it represents teamwork, diverse perspectives coming 
            together, and the beautiful unpredictability of the game we love.
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            If you're looking for the perfect take, you might want a network show. If you're looking 
            for smart, fun, optimistic NBA writing that sounds like your group chat? Welcome home.
          </p>
        </div>
      </div>
    </div>
  );
}
