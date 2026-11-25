const SCHEDULE = {
  0: { open: 9 * 60, close: 13 * 60, label: "9h–13h" },
  1: null,
  2: { open: 9 * 60, close: 19 * 60, label: "9h–19h" },
  3: { open: 9 * 60, close: 19 * 60, label: "9h–19h" },
  4: { open: 9 * 60, close: 19 * 60, label: "9h–19h" },
  5: { open: 9 * 60, close: 19 * 60, label: "9h–19h" },
  6: { open: 9 * 60, close: 19 * 60, label: "9h–19h" },
};

const DAY_NAMES = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

function saoPauloNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    day: dayMap[value.weekday],
    minutes: Number(value.hour) * 60 + Number(value.minute),
  };
}

function nextOpening(day) {
  for (let step = 1; step <= 7; step += 1) {
    const next = (day + step) % 7;
    if (SCHEDULE[next]) {
      const when = step === 1 ? "amanhã" : DAY_NAMES[next];
      return `Abre ${when} às 9h`;
    }
  }
  return "Consulte o horário no WhatsApp";
}

function statusFor(now) {
  const today = SCHEDULE[now.day];

  if (today && now.minutes >= today.open && now.minutes < today.close) {
    const closeHour = today.close / 60;
    return {
      open: true,
      text: `Aberta agora · fecha às ${closeHour}h`,
    };
  }

  if (today && now.minutes < today.open) {
    return { open: false, text: "Abre hoje às 9h" };
  }

  return { open: false, text: nextOpening(now.day) };
}

function renderStatus() {
  const node = document.querySelector("[data-status]");
  const text = document.querySelector("[data-status-text]");
  if (!node || !text) return;

  const now = saoPauloNow();
  const status = statusFor(now);

  text.textContent = status.text;
  node.classList.toggle("is-open", status.open);
  node.classList.toggle("is-closed", !status.open);
  node.dataset.state = status.open ? "aberta" : "fechada";

  document.querySelectorAll("[data-day]").forEach((row) => {
    row.classList.toggle("is-today", Number(row.dataset.day) === now.day);
  });
}

renderStatus();
