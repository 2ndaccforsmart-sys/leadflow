interface Greeting {
  greeting: string;
  action: string;
}

const FIRST_VISIT_KEY = "greeting_first_visit";

const morningGreetings: Greeting[] = [
  {
    greeting: "☀️ Morning, {name}.",
    action: "Ready to find some leads?",
  },
  {
    greeting: "☀️ Hey {name}, fresh day.",
    action: "Let's see who's out there.",
  },
  {
    greeting: "☀️ Morning, {name}.",
    action: "Your next client is waiting to be found.",
  },
  {
    greeting: "☀️ Good morning, {name}.",
    action: "Time to hunt for new prospects.",
  },
  {
    greeting: "☀️ Rise and shine, {name}.",
    action: "Leads won't find themselves.",
  },
];

const afternoonGreetings: Greeting[] = [
  {
    greeting: "🌤️ Afternoon, {name}.",
    action: "Still looking for leads?",
  },
  {
    greeting: "🌤️ Hey {name}, keep the momentum going.",
    action: "Let's find someone worth contacting.",
  },
  {
    greeting: "🌤️ Good afternoon, {name}.",
    action: "Anyone new worth reaching out to?",
  },
  {
    greeting: "🌤️ {name}, there are leads out there.",
    action: "Let's go find them.",
  },
  {
    greeting: "🌤️ Ready for a search, {name}?",
    action: "Your next deal could be one query away.",
  },
];

const eveningGreetings: Greeting[] = [
  {
    greeting: "🌙 Evening, {name}.",
    action: "One more search before you wrap up?",
  },
  {
    greeting: "🌙 Hey {name}, don't call it a day yet.",
    action: "Let's find a few quick leads.",
  },
  {
    greeting: "🌙 Good evening, {name}.",
    action: "Tomorrow's clients are waiting to be discovered.",
  },
  {
    greeting: "🌙 {name}, a quick search could find your next deal.",
    action: "Worth a shot?",
  },
  {
    greeting: "🌙 Last round, {name}?",
    action: "Let's make it count.",
  },
];

const generalGreetings: Greeting[] = [
  {
    greeting: "Hey {name}.",
    action: "Looking for leads today?",
  },
  {
    greeting: "Welcome back, {name}.",
    action: "Let's find some fresh prospects.",
  },
  {
    greeting: "{name}, your next opportunity is one search away.",
    action: "What are you looking for?",
  },
  {
    greeting: "Got a minute, {name}?",
    action: "Let's dig up some leads.",
  },
  {
    greeting: "Ready for another round, {name}?",
    action: "New businesses to discover.",
  },
  {
    greeting: "Hi {name}.",
    action: "Ready to find your next client?",
  },
];

const firstVisitGreeting: Greeting = {
  greeting: "👋 Welcome to LeadFlow, {name}!",
  action: "Let's find your first lead.",
};

function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getGreeting(userName: string): Greeting {
  // First visit? Show welcome greeting once
  try {
    const seen = localStorage.getItem(FIRST_VISIT_KEY);
    if (!seen) {
      localStorage.setItem(FIRST_VISIT_KEY, "true");
      return {
        greeting: firstVisitGreeting.greeting.replace("{name}", userName),
        action: firstVisitGreeting.action.replace("{name}", userName),
      };
    }
  } catch {
    // localStorage unavailable — fall through
  }

  const timeOfDay = getTimeOfDay();

  let timeBasedGreetings: Greeting[];

  switch (timeOfDay) {
    case "morning":
      timeBasedGreetings = morningGreetings;
      break;
    case "afternoon":
      timeBasedGreetings = afternoonGreetings;
      break;
    case "evening":
      timeBasedGreetings = eveningGreetings;
      break;
    default:
      timeBasedGreetings = generalGreetings;
      break;
  }

  // 70% chance of time-based greeting, 30% chance of general
  const useTimeBased = Math.random() < 0.7;
  const greetings = useTimeBased ? timeBasedGreetings : generalGreetings;

  const selected = getRandomItem(greetings);

  return {
    greeting: selected.greeting.replace("{name}", userName),
    action: selected.action.replace("{name}", userName),
  };
}

export function getTimeIcon(): string {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case "morning":
      return "☀️";
    case "afternoon":
      return "🌤️";
    case "evening":
      return "🌙";
    default:
      return "✨";
  }
}
