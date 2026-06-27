interface Greeting {
  greeting: string;
  action: string;
}

const morningGreetings: Greeting[] = [
  {
    greeting: "Good morning, {name}.",
    action: "Let's fill today's pipeline.",
  },
  {
    greeting: "Fresh day. Fresh prospects.",
    action: "Let's discover who's worth contacting.",
  },
  {
    greeting: "Morning, {name}.",
    action: "Coffee's optional. Closing deals isn't.",
  },
];

const afternoonGreetings: Greeting[] = [
  {
    greeting: "Good afternoon, {name}.",
    action: "Your next client is still out there.",
  },
  {
    greeting: "Let's keep your pipeline moving, {name}.",
    action: "A few searches could land your next project.",
  },
  {
    greeting: "Ready for another round, {name}?",
    action: "Let's find businesses that actually need you.",
  },
];

const eveningGreetings: Greeting[] = [
  {
    greeting: "Good evening, {name}.",
    action: "One more search could change tomorrow.",
  },
  {
    greeting: "Let's finish today strong, {name}.",
    action: "A few great leads before you log off?",
  },
  {
    greeting: "Perfect timing, {name}.",
    action: "Let's discover tomorrow's clients.",
  },
];

const generalGreetings: Greeting[] = [
  {
    greeting: "Welcome back, {name}.",
    action: "Your next client starts with one search.",
  },
  {
    greeting: "{name}, let's find companies worth talking to.",
    action: "Research. Reach out. Close deals.",
  },
  {
    greeting: "Somewhere, a business needs exactly what you offer.",
    action: "Let's find them.",
  },
  {
    greeting: "Ready to turn searches into signed clients, {name}?",
    action: "LeadFlow has the tools.",
  },
  {
    greeting: "{name}, your next opportunity starts here.",
    action: "Who deserves your next email?",
  },
  {
    greeting: "New businesses. Better prospects.",
    action: "Let's go, {name}.",
  },
];

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
  }
}
